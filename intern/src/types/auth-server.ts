// src/types/auth-server.ts
// Server-only helper. Reads the httpOnly jwt cookie and asks Strapi who it
// belongs to. Used in .astro frontmatter (which runs on the server), never
// in client <script> tags.
import type { AstroCookies } from "astro";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

export type TCurrentUser = {
  id: number;
  username: string;
  email: string;
};

export async function getCurrentUser(
  cookies: AstroCookies
): Promise<TCurrentUser | null> {
  const jwt = cookies.get("udrive_jwt")?.value;
  if (!jwt) return null;

  const res = await fetch(`${BASE_API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

  if (!res.ok) return null;
  return res.json();
}