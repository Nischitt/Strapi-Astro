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

  const { courseDocumentId, rating, comment } = await request.json();

  if (!courseDocumentId) {
    return new Response(
      JSON.stringify({ error: "Missing course reference." }),
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

  // authorName and user are set here from the verified session, never
  // trusted from the request body — the client has no way to submit a
  // review under someone else's name. Strapi's draftAndPublish on this
  // content type means this POST lands as a draft: invisible to the
  // public getReviewsForCourse() query until an admin publishes it.
  const strapiRes = await fetch(`${BASE_API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      data: {
        course: courseDocumentId,
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
    JSON.stringify({ success: true }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};