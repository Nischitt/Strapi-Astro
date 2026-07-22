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

// Every image field only ever needs these â€” restricting to just them
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
          // cards â€” bio and author.image aren't shown here, so we skip
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
export async function getLandingPage(): Promise<TStrapiSingleResponse<TLandingPage>> {
  const query = qs.stringify(
    { populate: { blocks: { on: BLOCKS_POPULATE } } },
    { encodeValuesOnly: true }
  );

  const path = `/api/landing-page?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/** Fetches a single Page (collection type) by its slug â€” e.g. About. */
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

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

const ARTICLE_POPULATE = {
  featuredImage: IMAGE_FIELDS,
  // Only tag.title is ever rendered (as a small badge on cards/detail
  // pages) â€” description is fetched but never shown, so we drop it.
  contentTags: { fields: ["title"] },
  // Same reasoning as featured-articles above: only fullName is shown,
  // author.bio and author.image aren't rendered on article cards or
  // the article detail page, so neither is requested.
  author: { fields: ["fullName"] },
};

/** Fetches all published articles, most recent first. */
export async function getArticles(): Promise<TStrapiCollectionResponse<TArticle>> {
  const query = qs.stringify(
    {
      populate: ARTICLE_POPULATE,
      sort: ["publishedAt:desc"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/articles?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}
/**
 * Fetches a single article by its slug. Unlike the listing above, this
 * one needs the full `content` field too since it's the article detail
 * page â€” so no top-level `fields` restriction here, only the nested
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

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/** Fetches all categories, in admin-defined order, for the course filter menu. */
export async function getCategories(): Promise<TStrapiCollectionResponse<import("./category").TCategory>> {
  const query = qs.stringify(
    { sort: ["order:asc", "name:asc"] },
    { encodeValuesOnly: true }
  );

  const path = `/api/categories?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/** Fetches all published courses, cheapest first. Optionally filtered by category slug. */
export async function getCourses(
  categorySlug?: string
): Promise<TStrapiCollectionResponse<TCourse>> {
  const query = qs.stringify(
    {
      populate: { featuredImage: IMAGE_FIELDS, category: { fields: ["name", "slug"] }, instructor: { fields: ["name", "slug"] } },
      sort: ["price:asc"],
      ...(categorySlug ? { filters: { category: { slug: { $eq: categorySlug } } } } : {}),
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/courses?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/**
 * Fetches published reviews for a single course, most recent first.
 * Reviews start as drafts (draftAndPublish is on for this content type)
 * so this â€” the public find endpoint â€” only ever returns ones an admin
 * has explicitly published, giving you moderation for free with no
 * custom controller code.
 */
export async function getReviewsForCourse(
  courseSlug: string
): Promise<TStrapiCollectionResponse<import("./review").TReview>> {
  const query = qs.stringify(
    {
      filters: { course: { slug: { $eq: courseSlug } } },
      fields: ["rating", "comment", "authorName", "createdAt"],
      sort: ["createdAt:desc"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/reviews?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}
/**
 * Fetches the current user's own review for a course, if one exists â€”
 * used to show "edit your review" instead of "write a review" and to
 * block duplicate submissions. Uses the trusted server API token
 * (not the public endpoint) because filtering/reading by a specific
 * user id runs into the same relation-visibility restriction that
 * blocked setting the `user` field directly â€” the Public/Authenticated
 * roles aren't meant to have broad read access into the User model,
 * so this needs the same elevated, server-only credential the create
 * flow already uses.
 */
export async function getUserReviewForCourse(
  courseSlug: string,
  userId: number
): Promise<import("./review").TReview | null> {
  const apiToken = import.meta.env.STRAPI_API_TOKEN;
  if (!apiToken) return null;

  const query = qs.stringify(
    {
      filters: {
        course: { slug: { $eq: courseSlug } },
        user: { id: { $eq: userId } },
      },
      fields: ["rating", "comment", "authorName", "createdAt"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/reviews?${query}&status=published`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, {
    headers: { Authorization: `Bearer ${apiToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const data = await response.json();
  return data?.data?.[0] ?? null;
}

/** Fetches all published instructors, alphabetical by name. */
export async function getInstructors(): Promise<TStrapiCollectionResponse<import("./instructor").TInstructor>> {
  const query = qs.stringify(
    {
      populate: { photo: IMAGE_FIELDS },
      sort: ["name:asc"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/instructors?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/** Fetches a single instructor by slug, including the courses they teach. */
export async function getInstructorBySlug(
  slug: string
): Promise<TStrapiCollectionResponse<import("./instructor").TInstructor & { courses: TCourse[] }>> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: {
        photo: IMAGE_FIELDS,
        courses: {
          fields: ["title", "slug", "price", "duration", "level"],
          populate: { featuredImage: IMAGE_FIELDS },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/instructors?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/** Fetches published reviews for a single instructor, most recent first. */
export async function getReviewsForInstructor(
  instructorSlug: string
): Promise<TStrapiCollectionResponse<import("./review").TReview>> {
  const query = qs.stringify(
    {
      filters: { instructor: { slug: { $eq: instructorSlug } } },
      fields: ["rating", "comment", "authorName", "createdAt"],
      sort: ["createdAt:desc"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/reviews?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/**
 * Fetches the current user's own review for an instructor, if one
 * exists. Same trusted-API-token approach as getUserReviewForCourse â€”
 * see that function's comment for why the public endpoint can't do this.
 */
export async function getUserReviewForInstructor(
  instructorSlug: string,
  userId: number
): Promise<import("./review").TReview | null> {
  const apiToken = import.meta.env.STRAPI_API_TOKEN;
  if (!apiToken) return null;

  const query = qs.stringify(
    {
      filters: {
        instructor: { slug: { $eq: instructorSlug } },
        user: { id: { $eq: userId } },
      },
      fields: ["rating", "comment", "authorName", "createdAt"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/reviews?${query}&status=published`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, {
    headers: { Authorization: `Bearer ${apiToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const data = await response.json();
  return data?.data?.[0] ?? null;
}

/**
 * Fetches the admin-editable contact address, phone, and map
 * coordinates from the Global single type. A separate lightweight
 * query (just these 4 fields) rather than reusing the full global-data
 * fetch in Layout.astro, since that one is cached for header/footer/
 * banner and this is only needed on the contact page.
 */
export async function getContactInfo(): Promise<{
  contactAddress: string | null;
  contactPhone: string | null;
  mapLatitude: number | null;
  mapLongitude: number | null;
} | null> {
  const query = qs.stringify(
    { fields: ["contactAddress", "contactPhone", "mapLatitude", "mapLongitude"] },
    { encodeValuesOnly: true }
  );

  const path = `/api/global?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  if (!response.ok) return null;

  const json = await response.json();
  return json?.data ?? null;
}

export async function getCourseBySlug(
  slug: string
): Promise<TStrapiCollectionResponse<TCourse>> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: { featuredImage: IMAGE_FIELDS, category: { fields: ["name", "slug"] }, instructor: { fields: ["name", "slug"] } },
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/courses?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

export async function getAvailableSlotsForCourse(
  courseSlug: string
): Promise<TStrapiCollectionResponse<any>> {
  const query = qs.stringify(
    {
      filters: { course: { slug: { $eq: courseSlug } } },
      sort: ["date:asc", "startTime:asc"],
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/available-slots?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/** Fetches all holidays (used to disable dates in the calendar). */
export async function getHolidays(): Promise<TStrapiCollectionResponse<any>> {
  const query = qs.stringify({}, { encodeValuesOnly: true });
  const path = `/api/holidays?${query}`;
  const url = new URL(path, BASE_API_URL);

  const response = await fetch(url.href, { cache: "no-store" });
  return response.json();
}

/** Creates a booking. Uses the trusted server API token since Booking
 * writes need elevated access (same pattern as review creation). */
export async function createBooking(payload: {
  course: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  availableSlot?: string;
  drivingLicenseStatus: string;
  preferredVehicle: string;
  pickupRequired: boolean;
  pickupAddress?: string;
  notes?: string;
}): Promise<{ ok: boolean; error?: string; data?: any }> {
  const apiToken = import.meta.env.STRAPI_API_TOKEN;
  const url = new URL("/api/bookings", BASE_API_URL);

  const response = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
    },
    body: JSON.stringify({ data: { ...payload, bookingStatus: "Pending" } }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    return { ok: false, error: err?.error?.message || "Booking failed." };
  }

  const data = await response.json();
  return { ok: true, data: data?.data };
}


/** Fetches the single Booking Settings record. */
export async function getBookingSettings(): Promise<any | null> {
  const url = new URL("/api/booking-setting", BASE_API_URL);
  const response = await fetch(url.href, { cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.data ?? null;
}

/** Checks whether a specific date is a holiday. */
export async function isDateHoliday(dateStr: string): Promise<boolean> {
  const query = qs.stringify(
    { filters: { date: { $eq: dateStr } } },
    { encodeValuesOnly: true }
  );
  const url = new URL(`/api/holidays?${query}`, BASE_API_URL);
  const response = await fetch(url.href, { cache: "no-store" });
  if (!response.ok) return false;
  const data = await response.json();
  return (data?.data?.length ?? 0) > 0;
}

/** Counts existing bookings for a course on a given date, excluding
 * cancelled ones — used to enforce maximumBookingsPerDay. */
export async function countBookingsForCourseOnDate(
  courseDocumentId: string,
  dateStr: string
): Promise<number> {
  const query = qs.stringify(
    {
      filters: {
        course: { documentId: { $eq: courseDocumentId } },
        selectedDate: { $eq: dateStr },
        bookingStatus: { $ne: "Cancelled" },
      },
      pagination: { pageSize: 1 },
    },
    { encodeValuesOnly: true }
  );
  const url = new URL(`/api/bookings?${query}`, BASE_API_URL);
  const response = await fetch(url.href, { cache: "no-store" });
  if (!response.ok) return 0;
  const data = await response.json();
  return data?.meta?.pagination?.total ?? 0;
}

export async function getBookingsForUser(email: string): Promise<any[]> {
  const query = qs.stringify(
    {
      filters: { email: { $eqi: email } }, // case-insensitive match
      populate: { course: { fields: ["title", "slug", "price"] } },
      sort: ["createdAt:desc"],
    },
    { encodeValuesOnly: true }
  );
  const url = new URL(`/api/bookings?${query}`, BASE_API_URL);
  const response = await fetch(url.href, { cache: "no-store" });
  if (!response.ok) return [];
  const data = await response.json();
  return data?.data ?? [];
}