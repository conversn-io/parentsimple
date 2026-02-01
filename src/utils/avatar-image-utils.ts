import avatarImageLibrary from '@/data/avatar-image-library.json';
import { 
  AvatarImageLibrary, 
  ImageSituation, 
  getImageSituationsByCategory,
  getImageSituationsByUseCase,
  getImageSituationsByEmotionalTone,
  getRecommendedImageForContent
} from '@/types/avatar-image-types';

// Type assertion for the imported JSON
const library = avatarImageLibrary as AvatarImageLibrary;

/**
 * Get all image situations for a specific category
 */
export function getImagesByCategory(category: keyof AvatarImageLibrary['image_categories']): ImageSituation[] {
  return getImageSituationsByCategory(library, category);
}

/**
 * Get image situations that match a specific use case
 */
export function getImagesByUseCase(useCase: string): ImageSituation[] {
  return getImageSituationsByUseCase(library, useCase);
}

/**
 * Get image situations that match a specific emotional tone
 */
export function getImagesByEmotionalTone(emotionalTone: string): ImageSituation[] {
  return getImageSituationsByEmotionalTone(library, emotionalTone);
}

/**
 * Get the recommended image situation for a specific content type
 */
export function getRecommendedImage(contentType: keyof AvatarImageLibrary['content_application']): string {
  return getRecommendedImageForContent(library, contentType);
}

/**
 * Get all available image categories
 */
export function getImageCategories(): string[] {
  return Object.keys(library.image_categories);
}

/**
 * Get all available use cases across all image situations
 */
export function getAllUseCases(): string[] {
  const useCases = new Set<string>();
  
  Object.values(library.image_categories).forEach(category => {
    category.situations.forEach(situation => {
      situation.use_cases.forEach(useCase => {
        useCases.add(useCase);
      });
    });
  });
  
  return Array.from(useCases);
}

/**
 * Get all available emotional tones
 */
export function getAllEmotionalTones(): string[] {
  const tones = new Set<string>();
  
  Object.values(library.image_categories).forEach(category => {
    category.situations.forEach(situation => {
      tones.add(situation.emotional_tone);
    });
  });
  
  return Array.from(tones);
}

/**
 * Search for image situations by keyword in title, description, or context
 */
export function searchImageSituations(keyword: string): ImageSituation[] {
  const results: ImageSituation[] = [];
  const searchTerm = keyword.toLowerCase();
  
  Object.values(library.image_categories).forEach(category => {
    category.situations.forEach(situation => {
      if (
        situation.title.toLowerCase().includes(searchTerm) ||
        situation.description.toLowerCase().includes(searchTerm) ||
        situation.context.toLowerCase().includes(searchTerm) ||
        situation.emotional_tone.toLowerCase().includes(searchTerm) ||
        situation.visual_elements.some(element => element.toLowerCase().includes(searchTerm))
      ) {
        results.push(situation);
      }
    });
  });
  
  return results;
}

/**
 * Get image situations that are suitable for a specific financial topic
 */
export function getImagesForFinancialTopic(topic: string): ImageSituation[] {
  const financialKeywords = [
    'retirement', 'annuity', 'investment', 'savings', 'pension', '401k', 'ira',
    'estate', 'will', 'trust', 'inheritance', 'tax', 'planning', 'advisor',
    'reverse mortgage', 'home equity', 'downsizing', 'long-term care', 'insurance'
  ];
  
  const topicLower = topic.toLowerCase();
  const matchingKeywords = financialKeywords.filter(keyword => 
    topicLower.includes(keyword) || keyword.includes(topicLower)
  );
  
  if (matchingKeywords.length === 0) {
    return getImagesByCategory('financial_planning');
  }
  
  const results: ImageSituation[] = [];
  
  Object.values(library.image_categories).forEach(category => {
    category.situations.forEach(situation => {
      const situationText = `${situation.title} ${situation.description} ${situation.context} ${situation.use_cases.join(' ')}`.toLowerCase();
      
      if (matchingKeywords.some(keyword => situationText.includes(keyword))) {
        results.push(situation);
      }
    });
  });
  
  return results;
}

/**
 * Get the avatar profile information
 */
export function getAvatarProfile() {
  return library.avatar_profile;
}

/**
 * Get visual style guidelines
 */
export function getVisualStyleGuidelines() {
  return library.visual_style_guidelines;
}

/**
 * Get regional considerations for Middle America
 */
export function getRegionalConsiderations() {
  return library.regional_considerations;
}

/**
 * Generate image brief for content creators
 */
export function generateImageBrief(situation: ImageSituation): string {
  return `
Image Brief: ${situation.title}

Description: ${situation.description}

Emotional Tone: ${situation.emotional_tone}

Context: ${situation.context}

Visual Elements to Include:
${situation.visual_elements.map(element => `- ${element}`).join('\n')}

Use Cases: ${situation.use_cases.join(', ')}

Style Guidelines:
- Lighting: ${library.visual_style_guidelines.photography_style.lighting}
- Color Palette: ${library.visual_style_guidelines.photography_style.color_palette}
- Composition: ${library.visual_style_guidelines.photography_style.composition}
- Authenticity: ${library.visual_style_guidelines.photography_style.authenticity}

Avoid: ${library.visual_style_guidelines.avoid_elements.join(', ')}

Preferred: ${library.visual_style_guidelines.preferred_elements.join(', ')}
  `.trim();
}

/**
 * Get random image situation for inspiration
 */
export function getRandomImageSituation(): ImageSituation {
  const allSituations: ImageSituation[] = [];
  
  Object.values(library.image_categories).forEach(category => {
    allSituations.push(...category.situations);
  });
  
  const randomIndex = Math.floor(Math.random() * allSituations.length);
  return allSituations[randomIndex];
}






