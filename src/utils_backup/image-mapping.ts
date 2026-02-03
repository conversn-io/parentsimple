/**
 * Image mapping utility for ParentSimple content pillars
 * Maps topic images to content categories and age groups
 */

export interface ImageMapping {
  pillar: string;
  ageRange: string;
  images: string[];
}

export const imageMappings: ImageMapping[] = [
  {
    pillar: "Early Foundations",
    ageRange: "Ages 0-10",
    images: [
      "/images/topics/asian-family-study-together.jpeg",
      "/images/topics/family-reads-by-fire.jpeg",
      "/images/topics/father-helps-son-study-project.jpeg",
      "/images/topics/family-chess-quality-time.jpeg",
      "/images/topics/black-family-cooks-together-kitchen.jpeg",
    ],
  },
  {
    pillar: "Building Momentum",
    ageRange: "Ages 11-14",
    images: [
      "/images/topics/parents-school-visit-fall-foliage.jpeg",
      "/images/topics/student-tutor-meet-lesson.jpeg",
      "/images/topics/teacher-small-group-hs-students.jpeg",
      "/images/topics/asian-parents-school-visit.jpeg",
      "/images/topics/focused-asian-student-study-hall.jpeg",
    ],
  },
  {
    pillar: "College Prep",
    ageRange: "Ages 15-17",
    images: [
      "/images/topics/parents-meet-college-counselor.jpeg",
      "/images/topics/parents-visit-campus-lawn.jpeg",
      "/images/topics/mom-daughter-college-library.jpeg",
      "/images/topics/young-latina-father-review-admission.jpeg",
      "/images/topics/young-students-visit-school.jpeg",
    ],
  },
  {
    pillar: "Financial Planning",
    ageRange: "All Ages",
    images: [
      "/images/topics/financial-planning-session.jpeg",
      "/images/topics/home-office-study-room-chair-lib.jpeg",
      "/images/topics/private-study-room-home-office.jpeg",
      "/images/topics/wood-library-with-ladder-home-office.jpeg",
      "/images/topics/city-scape-view-home-office.jpeg",
    ],
  },
  {
    pillar: "Resources",
    ageRange: "All Ages",
    images: [
      "/images/topics/libary-study-session-diverse-students.jpeg",
      "/images/topics/asian-female-male-group-study.jpeg",
      "/images/topics/black-teacher-student-stem-engineering.jpeg",
      "/images/topics/proud-black-family-graduation.jpeg",
      "/images/topics/family-gather-review-conversation.jpeg",
    ],
  },
];

/**
 * Get random image for a content pillar
 */
export function getImageForPillar(pillar: string): string {
  const mapping = imageMappings.find((m) => m.pillar === pillar);
  if (!mapping || mapping.images.length === 0) {
    return "/images/topics/family-gather-review-conversation.jpeg"; // Default fallback
  }
  const randomIndex = Math.floor(Math.random() * mapping.images.length);
  return mapping.images[randomIndex];
}

/**
 * Get all images for a content pillar
 */
export function getImagesForPillar(pillar: string): string[] {
  const mapping = imageMappings.find((m) => m.pillar === pillar);
  return mapping?.images || [];
}

/**
 * Get image mapping by age range
 */
export function getImagesByAgeRange(ageRange: string): string[] {
  const mapping = imageMappings.find((m) => m.ageRange === ageRange);
  return mapping?.images || [];
}

