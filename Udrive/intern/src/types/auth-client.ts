// src/types/auth-client.ts
// Runs in the browser. Calls our own /api/auth/* routes (not Strapi
// directly) — those routes talk to Strapi server-side and set the
// httpOnly cookie. No token handling happens here anymore.

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Registration failed");
  return data; // { user }
}

export async function loginUser(identifier: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Login failed");
  return data; // { user }
}