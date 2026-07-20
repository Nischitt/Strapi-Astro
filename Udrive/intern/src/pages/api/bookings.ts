// src/pages/api/bookings.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { getCurrentUser } from "../../types/auth-server";
import { checkRateLimit, getClientIp } from "../../types/rate-limit";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "You must be logged in to book a course." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip = getClientIp(request);
  // Logged-in users only reach this point, so this mainly guards against
  // a compromised/scripted account spamming bookings.
  const rateLimit = checkRateLimit(`bookings:${ip}`, 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many booking attempts. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const {
    courseDocumentId,
    courseSlug,
    courseTitle,
    coursePrice,
    name,
    email,
    phone,
    notes,
  } = await request.json();

  if (!courseDocumentId || !name || !email || !phone) {
    return new Response(
      JSON.stringify({ error: "Missing required booking details." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid email address." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const phonePattern = /^98\d{8}$/;
  if (!phonePattern.test(phone)) {
    return new Response(
      JSON.stringify({
        error: "Phone number must be 10 digits and start with 98 (e.g. 9800000000).",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (notes && (typeof notes !== "string" || notes.length > 1000)) {
    return new Response(
      JSON.stringify({ error: "Notes must be under 1000 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const strapiRes = await fetch(`${BASE_API_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        course: courseDocumentId,
        name,
        email,
        phone,
        notes: notes || null,
        bookingStatus: "Pending",
      },
    }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return new Response(
      JSON.stringify({
        error: data?.error?.message || "Could not create your booking.",
      }),
      { status: strapiRes.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      booking: {
        id: data.data.id,
        name,
        email,
        phone,
        courseTitle,
        courseSlug,
        coursePrice,
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};