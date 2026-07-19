// src/types/instructor.ts
import type { TImage } from "./index";

export type TInstructor = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  photo: TImage | null;
  biography: string;
  certifications: string; // comma-separated, e.g. "First Aid, Defensive Driving"
  yearsOfExperience: number;
  languagesSpoken: string; // comma-separated, e.g. "English, Nepali"
  vehicleSpecialization: string;
};

// Small shape used when a course or review just needs to reference
// which instructor it belongs to — not the full profile.
export type TInstructorRef = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
};