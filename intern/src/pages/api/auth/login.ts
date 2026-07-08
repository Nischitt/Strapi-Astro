// src/pages/api/auth/login.ts
export const prerender = false;

import type { APIRoute } from "astro";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { identifier, password } = await request.json();

  const strapiRes = await fetch(`${BASE_API_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return new Response(
      JSON.stringify({ error: data?.error?.message || "Login failed" }),
      { status: strapiRes.status, headers: { "Content-Type": "application/json" } }
    );
  }

  cookies.set("udrive_jwt", data.jwt, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return new Response(JSON.stringify({ user: data.user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};