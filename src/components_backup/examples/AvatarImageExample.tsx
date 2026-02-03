import React from 'react';
import { useAvatarImages, useFinancialImages, useContentCreationImages } from '@/hooks/useAvatarImages';

/**
 * Example component demonstrating how to use the Avatar Image Library
 * This shows various ways to access and use the image situations for content creation
 */
export default function AvatarImageExample() {
  const avatarImages = useAvatarImages();
  const financialImages = useFinancialImages();
  const contentImages = useContentCreationImages();

  // Example: Get images for different content types
  const retirementImages = avatarImages.getFinancialPlanningImages();
  const familyImages = avatarImages.getFamilyAndLegacyImages();
  const housingImages = avatarImages.getHomeAndHousingImages();

  // Example: Get images for specific financial topics
  const estatePlanningImages = financialImages.getEstatePlanningImages();
  const reverseMortgageImages = financialImages.getReverseMortgageImages();

  // Example: Get images for content creation
  const heroImages = contentImages.getHeroImages();
  const problemImages = contentImages.getProblemImages();

  // Example: Get recommended images for specific content types
  const homepageHero = avatarImages.getHomepageHeroImage();
  const servicePageImage = avatarImages.getServicePageImage();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#36596A] mb-8">
        Avatar Image Library Examples
      </h1>

      {/* Financial Planning Images */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
          Financial Planning Images
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {retirementImages.slice(0, 2).map((image, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
              <p className="text-gray-600 mb-2">{image.description}</p>
              <p className="text-sm text-blue-600 mb-2">
                <strong>Emotional Tone:</strong> {image.emotional_tone}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Use Cases:</strong> {image.use_cases.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Family and Legacy Images */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
          Family and Legacy Images
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {familyImages.slice(0, 2).map((image, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
              <p className="text-gray-600 mb-2">{image.description}</p>
              <p className="text-sm text-blue-600 mb-2">
                <strong>Emotional Tone:</strong> {image.emotional_tone}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Use Cases:</strong> {image.use_cases.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Housing Images */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
          Housing Images
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {housingImages.slice(0, 2).map((image, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
              <p className="text-gray-600 mb-2">{image.description}</p>
              <p className="text-sm text-blue-600 mb-2">
                <strong>Emotional Tone:</strong> {image.emotional_tone}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Use Cases:</strong> {image.use_cases.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Creation Examples */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
          Content Creation Examples
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Recommended Images for Content Types:</h3>
          <ul className="space-y-2">
            <li><strong>Homepage Hero:</strong> {homepageHero}</li>
            <li><strong>Service Pages:</strong> {servicePageImage}</li>
            <li><strong>Blog Articles:</strong> {avatarImages.getBlogArticleImage()}</li>
            <li><strong>Social Media:</strong> {avatarImages.getSocialMediaImage()}</li>
            <li><strong>Email Campaigns:</strong> {avatarImages.getEmailCampaignImage()}</li>
            <li><strong>Landing Pages:</strong> {avatarImages.getLandingPageImage()}</li>
          </ul>
        </div>
      </section>

      {/* Available Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
          Available Image Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {avatarImages.imageCategories.map((category, index) => (
            <div key={index} className="bg-blue-50 p-3 rounded text-center">
              <span className="text-sm font-medium text-blue-800">
                {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Available Use Cases */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
          Available Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {avatarImages.allUseCases.slice(0, 10).map((useCase, index) => (
            <div key={index} className="bg-green-50 p-2 rounded text-sm">
              <span className="text-green-800">{useCase}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Showing 10 of {avatarImages.allUseCases.length} available use cases
        </p>
      </section>

      {/* Available Emotional Tones */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
          Available Emotional Tones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {avatarImages.allEmotionalTones.map((tone, index) => (
            <div key={index} className="bg-purple-50 p-2 rounded text-sm">
              <span className="text-purple-800">{tone}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}






