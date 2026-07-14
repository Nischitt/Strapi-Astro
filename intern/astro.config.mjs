// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Tell Astro its real public URL — needed so it correctly determines
  // its own origin when running behind Render's reverse proxy. Without
  // this, Astro's built-in CSRF Origin check can mismatch and reject
  // POST requests (login, logout, contact, bookings) with a 403.
  site: 'https://strapi-astro-1.onrender.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  image: {
    domains: ['res.cloudinary.com'],
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
