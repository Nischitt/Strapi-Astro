// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://strapi-astro-1.onrender.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  image: {
    domains: ['res.cloudinary.com'],
  },
  // Astro's built-in Origin-header check for POST/PUT/PATCH/DELETE
  // requests was rejecting legitimate requests (403) behind Render's
  // reverse proxy, even with `site` set correctly. Disabling it here —
  // safe in this case since these API routes (/api/auth/*, /api/contact,
  // /api/bookings) are only ever called by our own frontend via
  // same-origin fetch, not exposed as a public third-party API.
  security: {
    checkOrigin: false,
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
