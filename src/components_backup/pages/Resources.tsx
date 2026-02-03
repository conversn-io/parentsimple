import React from 'react';
import Link from 'next/link';
import { BookOpen, Calculator, FileText, Video, Download, ExternalLink } from 'lucide-react';
import Footer from '../Footer';

const Resources = () => {
  const resources = [
    {
      title: "Retirement Planning Calculator",
      description: "Calculate how much you need to save for a comfortable retirement.",
      type: "calculator",
      icon: Calculator,
      link: "/calculators/retirement",
      featured: true
    },
    {
      title: "Medicare Enrollment Guide",
      description: "Complete guide to understanding and enrolling in Medicare.",
      type: "guide",
      icon: BookOpen,
      link: "/guides/medicare-enrollment",
      featured: false
    },
    {
      title: "Social Security Optimization",
      description: "Learn when and how to claim Social Security for maximum benefits.",
      type: "guide",
      icon: FileText,
      link: "/guides/social-security",
      featured: true
    },
    {
      title: "Long-Term Care Planning",
      description: "Protect your assets with proper long-term care planning.",
      type: "guide",
      icon: FileText,
      link: "/guides/long-term-care",
      featured: false
    },
    {
      title: "Indexed Annuities Explained",
      description: "Video series explaining how indexed annuities work.",
      type: "video",
      icon: Video,
      link: "/videos/indexed-annuities",
      featured: false
    },
    {
      title: "Estate Planning Checklist",
      description: "Downloadable checklist for estate planning essentials.",
      type: "download",
      icon: Download,
      link: "/downloads/estate-planning-checklist.pdf",
      featured: false
    }
  ];

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'calculator': return 'bg-blue-100 text-blue-800';
      case 'guide': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'download': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'calculator': return 'Calculator';
      case 'guide': return 'Guide';
      case 'video': return 'Video';
      case 'download': return 'Download';
      default: return 'Resource';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Financial Resources
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Access our comprehensive library of retirement planning tools, guides, and calculators 
            to help you make informed financial decisions.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                    resource.featured ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {resource.featured && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getResourceTypeColor(resource.type)}`}>
                        {getResourceTypeLabel(resource.type)}
                      </span>
                    </div>
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    
                    <Link href={resource.link}>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        Access Resource
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Resource Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our resources by category to find exactly what you need for your financial planning journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Calculators', icon: Calculator, count: 8, color: 'blue' },
              { name: 'Guides', icon: BookOpen, count: 15, color: 'green' },
              { name: 'Videos', icon: Video, count: 12, color: 'purple' },
              { name: 'Downloads', icon: Download, count: 6, color: 'orange' }
            ].map((category) => (
              <div key={category.name} className="text-center p-6 bg-gray-50 rounded-lg">
                <category.icon className={`h-12 w-12 mx-auto mb-4 text-${category.color}-600`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.count} resources available</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Personalized Help?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            While our resources provide valuable information, sometimes you need personalized guidance. 
            Schedule a free consultation with one of our retirement planning experts.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-lg text-lg transition-colors">
            Schedule Free Consultation
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;