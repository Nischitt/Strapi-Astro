// src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { checkRateLimit, getClientIp } from "../../types/rate-limit";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  // 5 messages per hour per IP — generous for a genuine visitor,
  // tight enough to stop a form being used to spam your inbox/Strapi.
  const rateLimit = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many messages sent. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const body = await request.json();
  const { name, email, phone, message, company } = body;

  // Honeypot: real users never fill this hidden field. Bots that
  // auto-fill every field will, so silently pretend success and drop it.
  if (company) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Name, email, and message are required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
    return new Response(
      JSON.stringify({ error: "Name must be between 2 and 100 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid email address." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (typeof message !== "string" || message.trim().length < 10 || message.length > 2000) {
    return new Response(
      JSON.stringify({ error: "Message must be between 10 and 2000 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (phone && (typeof phone !== "string" || phone.length > 20)) {
    return new Response(
      JSON.stringify({ error: "Phone number is too long." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const strapiRes = await fetch(`${BASE_API_URL}/api/contact-messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { name, email, phone: phone || null, message },
    }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return new Response(
      JSON.stringify({
        error: data?.error?.message || "Could not send your message.",
      }),
      { status: strapiRes.status, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};