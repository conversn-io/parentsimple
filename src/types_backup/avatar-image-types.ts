export interface AvatarProfile {
  demographics: {
    age_range: string;
    generation: string;
    location: string;
    income: string;
    net_worth: string;
    education: string;
    employment: string;
    marital_status: string;
  };
  psychographics: {
    values: string[];
    concerns: string[];
    aspirations: string[];
  };
  lifestyle: {
    home_ownership: string;
    living_situation: string;
    technology_comfort: string;
    media_consumption: string;
    social_circles: string;
  };
}

export interface ImageSituation {
  title: string;
  description: string;
  emotional_tone: string;
  context: string;
  visual_elements: string[];
  use_cases: string[];
}

export interface ImageCategory {
  description: string;
  situations: ImageSituation[];
}

export interface VisualStyleGuidelines {
  photography_style: {
    lighting: string;
    color_palette: string;
    composition: string;
    authenticity: string;
  };
  avoid_elements: string[];
  preferred_elements: string[];
}

export interface ContentApplication {
  homepage_hero: string;
  service_pages: string;
  blog_articles: string;
  social_media: string;
  email_campaigns: string;
  landing_pages: string;
}

export interface RegionalConsiderations {
  middle_america_characteristics: string[];
  avoid_regional_stereotypes: string[];
}

export interface AvatarImageLibrary {
  avatar_profile: AvatarProfile;
  image_categories: {
    financial_planning: ImageCategory;
    home_and_housing: ImageCategory;
    health_and_wellness: ImageCategory;
    family_and_legacy: ImageCategory;
    retirement_lifestyle: ImageCategory;
    technology_and_modern_life: ImageCategory;
    concerns_and_challenges: ImageCategory;
  };
  visual_style_guidelines: VisualStyleGuidelines;
  content_application: ContentApplication;
  regional_considerations: RegionalConsiderations;
}

// Helper function to get image situations by category
export function getImageSituationsByCategory(
  library: AvatarImageLibrary,
  category: keyof AvatarImageLibrary['image_categories']
): ImageSituation[] {
  return library.image_categories[category].situations;
}

// Helper function to get image situations by use case
export function getImageSituationsByUseCase(
  library: AvatarImageLibrary,
  useCase: string
): ImageSituation[] {
  const allSituations: ImageSituation[] = [];
  
  Object.values(library.image_categories).forEach(category => {
    category.situations.forEach(situation => {
      if (situation.use_cases.includes(useCase)) {
        allSituations.push(situation);
      }
    });
  });
  
  return allSituations;
}

// Helper function to get image situations by emotional tone
export function getImageSituationsByEmotionalTone(
  library: AvatarImageLibrary,
  emotionalTone: string
): ImageSituation[] {
  const allSituations: ImageSituation[] = [];
  
  Object.values(library.image_categories).forEach(category => {
    category.situations.forEach(situation => {
      if (situation.emotional_tone.toLowerCase().includes(emotionalTone.toLowerCase())) {
        allSituations.push(situation);
      }
    });
  });
  
  return allSituations;
}

// Helper function to get recommended image for specific content type
export function getRecommendedImageForContent(
  library: AvatarImageLibrary,
  contentType: keyof ContentApplication
): string {
  return library.content_application[contentType];
}






