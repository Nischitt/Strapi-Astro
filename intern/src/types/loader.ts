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

// Every image field only ever needs these — restricting to just them
// drops Strapi's "formats" object (thumbnail/small/medium/large variants,
// each with their own url/width/height/size) which is otherwise the
// single biggest chunk of dead weight in most responses. Keeping "mime"
// too since ContentWithImage checks it first before falling back to a
// file-extension check for video detection.
const IMAGE_FIELDS = { fields: ["url", "alternativeText", "mime"] };

const BLOCKS_POPULATE = {
  "blocks.hero": {
    populate: {
      links: { populate: "*" }, // small repeatable component, no media inside
      image: IMAGE_FIELDS,
    },
  },
  "blocks.section-heading": { populate: "*" }, // flat fields only, no relations
  "blocks.card-grid": { populate: "*" }, // cards component, no media
  "blocks.content-with-image": {
    populate: {
      link: { populate: "*" },
      image: IMAGE_FIELDS,
    },
  },
  "blocks.markdown": { populate: "*" }, // just a text field, populate is a no-op here
  "blocks.person-card": {
    populate: {
      image: IMAGE_FIELDS,
    },
  },
  "blocks.faqs": { populate: "*" }, // faq component, no media
  "blocks.newsletter": { populate: "*" }, // flat fields only
  "blocks.featured-articles": {
    populate: {
      articles: {
        fields: ["title", "description", "slug"],
        populate: {
          featuredImage: IMAGE_FIELDS,
          // Only fullName is ever rendered for the author on article
          // cards — bio and author.image aren't shown here, so we skip
          // both entirely rather than pulling a full nested media object.
          author: { fields: ["fullName"] },
        },
      },
    },
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
  featuredImage: IMAGE_FIELDS,
  // Only tag.title is ever rendered (as a small badge on cards/detail
  // pages) — description is fetched but never shown, so we drop it.
  contentTags: { fields: ["title"] },
  // Same reasoning as featured-articles above: only fullName is shown,
  // author.bio and author.image aren't rendered on article cards or
  // the article detail page, so neither is requested.
  author: { fields: ["fullName"] },
};

/** Fetches all published articles, most recent first. */
export async function getArticles(): Promise<
  TStrapiCollectionResponse<TArticle>
> {
  const query = qs.stringify(
    {
      fields: ["title", "description", "slug", "publishedAt"],
      populate: ARTICLE_POPULATE,
      sort: ["publishedAt:desc"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/articles?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href);
  return response.json();
}

/**
 * Fetches a single article by its slug. Unlike the listing above, this
 * one needs the full `content` field too since it's the article detail
 * page — so no top-level `fields` restriction here, only the nested
 * media/relation trimming.
 */
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
      populate: { featuredImage: IMAGE_FIELDS },
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
      populate: { featuredImage: IMAGE_FIELDS },
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/courses?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href);
  return response.json();
}