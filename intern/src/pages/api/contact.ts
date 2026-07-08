// src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from "astro";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

export const POST: APIRoute = async ({ request }) => {
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