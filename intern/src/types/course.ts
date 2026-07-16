// src/types/course.ts
import type { TImage } from "./index";

export type TCourse = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: number;
  content: string;
  level: string;
  category: { id: number; documentId: string; name: string; slug: string } | null;
  featuredImage: TImage | null;
  theoryLessons: number;
  practicalLessons: number;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};