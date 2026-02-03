'use client';

import { useState } from "react";
import Link from 'next/link';
import { BookOpen, Clock, Users, Search, Filter } from "lucide-react";
import Footer from "../Footer";

const Guides = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const guides = [
    {
      id: 1,
      title: "Complete Guide to Indexed Annuities",
      description: "Learn how indexed annuities can protect your retirement savings while providing growth potential.",
      category: "Annuities",
      difficulty: "Beginner",
      readTime: "15 min",
      featured: true
    },
    {
      id: 2,
      title: "Medicare Enrollment Made Simple",
      description: "Navigate Medicare enrollment with confidence and avoid costly mistakes.",
      category: "Healthcare",
      difficulty: "Beginner",
      readTime: "12 min",
      featured: false
    },
    {
      id: 3,
      title: "Long-Term Care Planning Essentials",
      description: "Protect your assets and ensure quality care with proper long-term care planning.",
      category: "Care Planning",
      difficulty: "Intermediate",
      readTime: "20 min",
      featured: false
    },
    {
      id: 4,
      title: "Social Security Optimization Strategies",
      description: "Maximize your Social Security benefits with proven claiming strategies.",
      category: "Social Security",
      difficulty: "Advanced",
      readTime: "25 min",
      featured: true
    }
  ];

  const categories = ["All", "Annuities", "Healthcare", "Care Planning", "Social Security", "Estate Planning"];

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Expert Financial Guides
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Access our comprehensive library of retirement planning guides, written by financial experts 
            to help you make informed decisions about your future.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center text-yellow-400 mb-2">
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="font-semibold">Featured This Week</span>
            </div>
            <p className="text-sm opacity-90">
              Complete Guide to Indexed Annuities - Learn the secrets to protecting and growing your retirement savings
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${guide.featured ? 'ring-2 ring-[#36596A]' : ''}`}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {guide.featured && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs font-medium rounded-full">
                      {guide.category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {guide.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{guide.readTime}</span>
                    </div>
                    <Link href={`/guides/${guide.id}`}>
                      <button className="bg-[#36596A] hover:bg-[#2a4a5a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Read Guide
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No guides found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="h-16 w-16 mx-auto mb-6 text-blue-300" />
          <h2 className="text-3xl font-bold mb-4">
            Get Personalized Guidance
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Ready to take the next step? Schedule a free consultation with one of our retirement planning experts.
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

export default Guides;