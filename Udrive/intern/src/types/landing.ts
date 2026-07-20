// src/types/landing.ts
import type { TImage, TLink } from "./index";

// Re-exported under the old name so existing imports in block components
// (BlockRenderer, Hero, ContentWithImage, PersonCard, FeaturedArticles)
// keep working without needing to be touched.
export type { TImage as TStrapiImage, TLink };

export type THeroBlock = {
  __component: "blocks.hero";
  id: number;
  heading: string;
  text: string;
  links: TLink[];
  image: TImage;
};

export type TSectionHeadingBlock = {
  __component: "blocks.section-heading";
  id: number;
  subHeading: string;
  heading: string;
  anchorLink: string | null;
};

export type TCard = {
  id: number;
  heading: string;
  text: string;
};

export type TCardGridBlock = {
  __component: "blocks.card-grid";
  id: number;
  cards: TCard[];
};

export type TContentWithImageBlock = {
  __component: "blocks.content-with-image";
  id: number;
  reversed: boolean;
  heading: string;
  content: string;
  link: TLink | null;
  image: TImage;
};

export type TMarkdownBlock = {
  __component: "blocks.markdown";
  id: number;
  content: string;
};

export type TPersonCardBlock = {
  __component: "blocks.person-card";
  id: number;
  text: string;
  personName: string;
  personJob: string;
  image: TImage;
};

export type TFaqItem = {
  id: number;
  heading: string;
  text: string;
};

export type TFaqsBlock = {
  __component: "blocks.faqs";
  id: number;
  faq: TFaqItem[];
};

export type TNewsletterBlock = {
  __component: "blocks.newsletter";
  id: number;
  heading: string;
  text: string;
  placeholder: string;
  label: string;
  formId: string | null;
};

// Minimal article shape as it appears embedded inside the
// `blocks.featured-articles` dynamic-zone block on the landing page.
// For the full Article shape (used on /blog), see types/blog.ts.
export type TFeaturedArticleSummary = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  featuredImage: TImage;
  author: {
    id: number;
    documentId: string;
    fullName: string;
    bio: string;
  };
};

export type TFeaturedArticlesBlock = {
  __component: "blocks.featured-articles";
  id: number;
  articles: TFeaturedArticleSummary[];
};

export type TLandingPageBlock =
  | THeroBlock
  | TSectionHeadingBlock
  | TCardGridBlock
  | TContentWithImageBlock
  | TMarkdownBlock
  | TPersonCardBlock
  | TFaqsBlock
  | TNewsletterBlock
  | TFeaturedArticlesBlock;

export type TLandingPage = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: TLandingPageBlock[];
};

export type TPage = {
  id: number;
  documentId: string;
  title: string;
  Description: string; // capital D — matches your Strapi field exactly
  slug: string;
  blocks: TLandingPageBlock[];
};

export type TStrapiSingleResponse<T> = {
  data: T;
  meta: Record<string, unknown>;
};

export type TStrapiCollectionResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};