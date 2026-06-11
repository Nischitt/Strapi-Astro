import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'YOUR_PROJECT_ID_HERE', // Find this in your sanity.config.js file
  dataset: 'production',
  useCdn: true, // Speeds up loading times via edge caching
  apiVersion: '2026-06-10', 
});

// Helper function to turn Sanity image references into clean CDN URLs
const builder = imageUrlBuilder(client);
export function urlFor(source) {
  return builder.image(source);
}