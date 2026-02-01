import { useMemo } from 'react';
import {
  getImagesByCategory,
  getImagesByUseCase,
  getImagesByEmotionalTone,
  getRecommendedImage,
  getImagesForFinancialTopic,
  searchImageSituations,
  generateImageBrief,
  getRandomImageSituation,
  getAllUseCases,
  getAllEmotionalTones,
  getImageCategories
} from '@/utils/avatar-image-utils';
import { ImageSituation } from '@/types/avatar-image-types';

export function useAvatarImages() {
  const imageCategories = useMemo(() => getImageCategories(), []);
  const allUseCases = useMemo(() => getAllUseCases(), []);
  const allEmotionalTones = useMemo(() => getAllEmotionalTones(), []);

  return {
    // Get images by category
    getFinancialPlanningImages: () => getImagesByCategory('financial_planning'),
    getHomeAndHousingImages: () => getImagesByCategory('home_and_housing'),
    getHealthAndWellnessImages: () => getImagesByCategory('health_and_wellness'),
    getFamilyAndLegacyImages: () => getImagesByCategory('family_and_legacy'),
    getRetirementLifestyleImages: () => getImagesByCategory('retirement_lifestyle'),
    getTechnologyImages: () => getImagesByCategory('technology_and_modern_life'),
    getConcernsAndChallengesImages: () => getImagesByCategory('concerns_and_challenges'),

    // Get images by use case
    getImagesByUseCase,

    // Get images by emotional tone
    getImagesByEmotionalTone,

    // Get recommended images for content types
    getHomepageHeroImage: () => getRecommendedImage('homepage_hero'),
    getServicePageImage: () => getRecommendedImage('service_pages'),
    getBlogArticleImage: () => getRecommendedImage('blog_articles'),
    getSocialMediaImage: () => getRecommendedImage('social_media'),
    getEmailCampaignImage: () => getRecommendedImage('email_campaigns'),
    getLandingPageImage: () => getRecommendedImage('landing_pages'),

    // Get images for specific financial topics
    getImagesForFinancialTopic,

    // Search functionality
    searchImageSituations,

    // Utility functions
    generateImageBrief,
    getRandomImageSituation,

    // Available options
    imageCategories,
    allUseCases,
    allEmotionalTones
  };
}

// Specialized hooks for specific use cases
export function useFinancialImages() {
  return useMemo(() => ({
    getRetirementPlanningImages: () => getImagesByUseCase('Retirement planning articles'),
    getEstatePlanningImages: () => getImagesByUseCase('Estate planning'),
    getInvestmentImages: () => getImagesByUseCase('Investment guidance'),
    getTaxPlanningImages: () => getImagesByUseCase('Tax planning content'),
    getReverseMortgageImages: () => getImagesByUseCase('Reverse mortgage education'),
    getAnnuityImages: () => getImagesByUseCase('Annuity content'),
    getLongTermCareImages: () => getImagesByUseCase('Long-term care planning')
  }), []);
}

export function useLifestyleImages() {
  return useMemo(() => ({
    getActiveAgingImages: () => getImagesByUseCase('Active aging'),
    getFamilyConnectionImages: () => getImagesByUseCase('Family connection'),
    getCommunityImages: () => getImagesByUseCase('Community involvement'),
    getTravelImages: () => getImagesByUseCase('Travel and leisure'),
    getHobbyImages: () => getImagesByUseCase('Hobbies and interests'),
    getVolunteerImages: () => getImagesByUseCase('Volunteer opportunities')
  }), []);
}

export function useConcernImages() {
  return useMemo(() => ({
    getHealthcareConcernImages: () => getImagesByUseCase('Healthcare planning'),
    getMarketVolatilityImages: () => getImagesByUseCase('Market volatility'),
    getInflationConcernImages: () => getImagesByUseCase('Inflation impact'),
    getLongevityRiskImages: () => getImagesByUseCase('Longevity risk'),
    getEstateTaxImages: () => getImagesByUseCase('Estate tax planning')
  }), []);
}

// Hook for content creators and marketers
export function useContentCreationImages() {
  const avatarImages = useAvatarImages();
  
  return useMemo(() => ({
    // Get images for specific content types
    getHeroImages: () => avatarImages.getImagesByEmotionalTone('hopeful'),
    getProblemImages: () => avatarImages.getImagesByEmotionalTone('concerned'),
    getSolutionImages: () => avatarImages.getImagesByEmotionalTone('confident'),
    getTestimonialImages: () => avatarImages.getImagesByEmotionalTone('satisfied'),
    getProcessImages: () => avatarImages.getImagesByEmotionalTone('professional'),
    
    // Get images for specific emotions
    getTrustImages: () => avatarImages.getImagesByEmotionalTone('trustworthy'),
    getSecurityImages: () => avatarImages.getImagesByEmotionalTone('secure'),
    getFamilyImages: () => avatarImages.getImagesByEmotionalTone('family-focused'),
    getIndependentImages: () => avatarImages.getImagesByEmotionalTone('independent'),
    
    // Generate image briefs
    generateBrief: generateImageBrief,
    
    // Get random inspiration
    getRandomInspiration: getRandomImageSituation
  }), [avatarImages]);
}






