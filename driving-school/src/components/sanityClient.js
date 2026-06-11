import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'YOUR_REAL_PROJECT_ID', // Replace with your string from sanity.config.js
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-06-10',
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  if (!source || !source.asset) return { url: () => "" };
  return builder.image(source);
}