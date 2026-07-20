// src/pages/api/auth/login.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { checkRateLimit, getClientIp } from "../../../types/rate-limit";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

export const POST: APIRoute = async ({ request, cookies }) => {
  const ip = getClientIp(request);
  // 5 attempts per 15 minutes per IP — generous enough for a real user
  // who mistypes their password a few times, tight enough to stop
  // automated credential-stuffing attempts.
  const rateLimit = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many login attempts. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const { identifier, password } = await request.json();

  if (!identifier || !password) {
    return new Response(
      JSON.stringify({ error: "Email/username and password are required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

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