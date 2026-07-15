// src/pages/api/auth/register.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { checkRateLimit, getClientIp } from "../../../types/rate-limit";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, cookies }) => {
  const ip = getClientIp(request);
  // Tighter than login — account creation is a common abuse target
  // (spam accounts, automated signups).
  const rateLimit = checkRateLimit(`register:${ip}`, 3, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many signup attempts. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return new Response(
      JSON.stringify({ error: "Username, email, and password are required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (typeof username !== "string" || username.trim().length < 3 || username.length > 50) {
    return new Response(
      JSON.stringify({ error: "Username must be between 3 and 50 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid email address." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (typeof password !== "string" || password.length < 6) {
    return new Response(
      JSON.stringify({ error: "Password must be at least 6 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const strapiRes = await fetch(`${BASE_API_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return new Response(
      JSON.stringify({ error: data?.error?.message || "Registration failed" }),
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