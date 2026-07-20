// src/types/blog.ts
import type { TImage } from "./index";

export type TTag = {
  id: number;
  documentId: string;
  title: string;
  description: string;
};

export type TAuthor = {
  id: number;
  documentId: string;
  fullName: string;
  bio: string;
  image: TImage;
  articles?: { id: number; documentId: string; title: string }[];
};

export type TArticle = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: string;
  featuredImage: TImage;
  contentTags: TTag[];
  author: TAuthor;
};