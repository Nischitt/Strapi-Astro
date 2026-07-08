// src/types/loader.ts
import qs from "qs";
import type {
  TLandingPage,
  TPage,
  TStrapiSingleResponse,
  TStrapiCollectionResponse,
} from "./landing";
import type { TArticle } from "./blog";
import type { TCourse } from "./course";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

const BLOCKS_POPULATE = {
  "blocks.hero": { populate: "*" },
  "blocks.section-heading": { populate: "*" },
  "blocks.card-grid": { populate: "*" },
  "blocks.content-with-image": { populate: "*" },
  "blocks.markdown": { populate: "*" },
  "blocks.person-card": { populate: "*" },
  "blocks.faqs": { populate: "*" },
  "blocks.newsletter": { populate: "*" },
  "blocks.featured-articles": {
    populate: { articles: { populate: "*" } },
  },
};

/**
 * Fetches the "Landing Page" single type from Strapi.
 *
 * The `blocks` field is a dynamic zone, so each possible component
 * needs its own `populate` entry (Strapi v5 `on` syntax) or nested
 * relations/media inside those blocks (image, links, cards, faq,
 * articles.author, etc.) will come back empty.
 */
export async function getLandingPage(): Promise<
  TStrapiSingleResponse<TLandingPage>
> {
  const query = qs.stringify(
    { populate: { blocks: { on: BLOCKS_POPULATE } } },
    { encodeValuesOnly: true }
  );

  const path = `/api/landing-page?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href);
  return response.json();
}

/** Fetches a single Page (collection type) by its slug — e.g. About. */
export async function getPageBySlug(
  slug: string
): Promise<TStrapiCollectionResponse<TPage>> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: { blocks: { on: BLOCKS_POPULATE } },
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/pages?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href);
  return response.json();
}

const ARTICLE_POPULATE = {
  featuredImage: { populate: "*" },
  contentTags: { populate: "*" },
  author: { populate: { image: { populate: "*" } } },
};

/** Fetches all published articles, most recent first. */
export async function getArticles(): Promise<
  TStrapiCollectionResponse<TArticle>
> {
  const query = qs.stringify(
    { populate: ARTICLE_POPULATE, sort: ["publishedAt:desc"] },
    { encodeValuesOnly: true }
  );

  const path = `/api/articles?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href);
  return response.json();
}

/** Fetches a single article by its slug. */
export async function getArticleBySlug(
  slug: string
): Promise<TStrapiCollectionResponse<TArticle>> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: ARTICLE_POPULATE,
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/articles?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href);
  return response.json();
}

/** Fetches all published courses, cheapest first. */
export async function getCourses(): Promise<
  TStrapiCollectionResponse<TCourse>
> {
  const query = qs.stringify(
    {
      populate: { featuredImage: { populate: "*" } },
      sort: ["price:asc"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/courses?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href);
  return response.json();
}

/** Fetches a single course by its slug. */
export async function getCourseBySlug(
  slug: string
): Promise<TStrapiCollectionResponse<TCourse>> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: { featuredImage: { populate: "*" } },
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/courses?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href);
  return response.json();
}