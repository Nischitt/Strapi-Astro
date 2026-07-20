// src/pages/api/reviews.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { getCurrentUser } from "../../types/auth-server";
import { checkRateLimit, getClientIp } from "../../types/rate-limit";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

export const POST: APIRoute = async ({ request, cookies }) => {
  // Forwarding the visiting user's own JWT hit a hard limitation:
  // Strapi validates that the requesting role can actually "see" every
  // entity a relation field points at before allowing it to be set —
  // and it deliberately restricts giving any role broad read access to
  // the User model, so `user` (and, before that, `course`) kept coming
  // back "Invalid key X" no matter which role permissions were toggled.
  //
  // The fix: Astro verifies the person is genuinely logged in (via
  // their session cookie, same as before), then writes to Strapi using
  // its OWN trusted API token rather than impersonating the visitor.
  // A token's permissions aren't subject to that same per-user
  // relation-visibility restriction, so this sidesteps the issue
  // entirely rather than fighting it with more role checkboxes.
  const user = await getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "You must be logged in to leave a review." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiToken = import.meta.env.STRAPI_API_TOKEN;
  if (!apiToken) {
    console.error("STRAPI_API_TOKEN is not set — cannot submit reviews.");
    return new Response(
      JSON.stringify({ error: "Reviews are temporarily unavailable. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip = getClientIp(request);
  // A genuine student leaves a handful of reviews at most, ever — this
  // is generous for real use and tight enough to stop review spam from
  // a compromised/scripted account.
  const rateLimit = checkRateLimit(`reviews:${ip}`, 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many reviews submitted. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  // Supports reviewing either a course OR an instructor — exactly one
  // of courseDocumentId / instructorDocumentId should be sent. Kept as
  // two optional fields rather than a single "targetType" + id pair so
  // the existing course-review form (already shipped) didn't need any
  // changes to keep working.
  const { courseDocumentId, instructorDocumentId, rating, comment } = await request.json();

  if (!courseDocumentId && !instructorDocumentId) {
    return new Response(
      JSON.stringify({ error: "Missing course or instructor reference." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (courseDocumentId && instructorDocumentId) {
    return new Response(
      JSON.stringify({ error: "A review can only target one course or instructor, not both." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return new Response(
      JSON.stringify({ error: "Rating must be a whole number between 1 and 5." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (
    typeof comment !== "string" ||
    comment.trim().length < 10 ||
    comment.length > 1000
  ) {
    return new Response(
      JSON.stringify({ error: "Review must be between 10 and 1000 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Server-side guard against duplicates, even though the UI already
  // hides the "write a review" form once one exists — the UI check
  // alone isn't trustworthy since a client could POST directly.
  const targetField = courseDocumentId ? "course" : "instructor";
  const targetDocumentId = courseDocumentId || instructorDocumentId;
  const existingCheck = await fetch(
    `${BASE_API_URL}/api/reviews?filters[${targetField}][documentId][$eq]=${encodeURIComponent(
      targetDocumentId
    )}&filters[user][id][$eq]=${user.id}&status=published`,
    { headers: { Authorization: `Bearer ${apiToken}` } }
  );
  const existingData = await existingCheck.json();
  if (existingCheck.ok && existingData?.data?.length > 0) {
    return new Response(
      JSON.stringify({ error: "You've already reviewed this course. Edit your existing review instead." }),
      { status: 409, headers: { "Content-Type": "application/json" } }
    );
  }

  // authorName and user are set here from the verified session, never
  // trusted from the request body — the client has no way to submit a
  // review under someone else's name. Strapi's draftAndPublish on this
  // content type means this POST lands as a draft: invisible to the
  // public getReviewsForCourse() query until an admin publishes it.
  // ?status=published makes this create-and-publish in one call, so
  // reviews go live immediately instead of sitting as an unpublished
  // draft awaiting manual approval in the Strapi admin. Trade-off:
  // there's no longer a moderation step before a submitted review is
  // visible to the public — acceptable here since submission already
  // requires a logged-in account and is rate-limited, but worth
  // revisiting if spam/inappropriate reviews become a problem.
  const strapiRes = await fetch(`${BASE_API_URL}/api/reviews?status=published`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      data: {
        ...(courseDocumentId ? { course: courseDocumentId } : { instructor: instructorDocumentId }),
        user: user.id,
        authorName: user.username,
        rating: numericRating,
        comment: comment.trim(),
      },
    }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return new Response(
      JSON.stringify({
        error: data?.error?.message || "Could not submit your review.",
      }),
      { status: strapiRes.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ success: true, documentId: data?.data?.documentId }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

// Shared by PUT and DELETE: confirms the review being modified actually
// belongs to the requesting user before touching it. Fetches with the
// API token (needed to populate the `user` relation at all, same
// relation-visibility restriction as everywhere else in this file) and
// compares the owner's id against the verified session.
async function verifyReviewOwnership(
  documentId: string,
  userId: number,
  apiToken: string
): Promise<boolean> {
  const res = await fetch(
    `${BASE_API_URL}/api/reviews/${encodeURIComponent(documentId)}?populate=user&status=published`,
    { headers: { Authorization: `Bearer ${apiToken}` } }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return data?.data?.user?.id === userId;
}

export const PUT: APIRoute = async ({ request, cookies }) => {
  const user = await getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "You must be logged in to edit a review." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiToken = import.meta.env.STRAPI_API_TOKEN;
  if (!apiToken) {
    return new Response(
      JSON.stringify({ error: "Reviews are temporarily unavailable. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`reviews:${ip}`, 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { reviewDocumentId, rating, comment } = await request.json();

  if (!reviewDocumentId) {
    return new Response(
      JSON.stringify({ error: "Missing review reference." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return new Response(
      JSON.stringify({ error: "Rating must be a whole number between 1 and 5." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (
    typeof comment !== "string" ||
    comment.trim().length < 10 ||
    comment.length > 1000
  ) {
    return new Response(
      JSON.stringify({ error: "Review must be between 10 and 1000 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const owns = await verifyReviewOwnership(reviewDocumentId, user.id, apiToken);
  if (!owns) {
    return new Response(
      JSON.stringify({ error: "You can only edit your own review." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const strapiRes = await fetch(
    `${BASE_API_URL}/api/reviews/${encodeURIComponent(reviewDocumentId)}?status=published`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        data: { rating: numericRating, comment: comment.trim() },
      }),
    }
  );

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return new Response(
      JSON.stringify({ error: data?.error?.message || "Could not update your review." }),
      { status: strapiRes.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const user = await getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "You must be logged in to delete a review." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiToken = import.meta.env.STRAPI_API_TOKEN;
  if (!apiToken) {
    return new Response(
      JSON.stringify({ error: "Reviews are temporarily unavailable. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { reviewDocumentId } = await request.json();
  if (!reviewDocumentId) {
    return new Response(
      JSON.stringify({ error: "Missing review reference." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const owns = await verifyReviewOwnership(reviewDocumentId, user.id, apiToken);
  if (!owns) {
    return new Response(
      JSON.stringify({ error: "You can only delete your own review." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const strapiRes = await fetch(
    `${BASE_API_URL}/api/reviews/${encodeURIComponent(reviewDocumentId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiToken}` },
    }
  );

  if (!strapiRes.ok) {
    const data = await strapiRes.json().catch(() => null);
    return new Response(
      JSON.stringify({ error: data?.error?.message || "Could not delete your review." }),
      { status: strapiRes.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};