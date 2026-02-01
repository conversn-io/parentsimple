import React from 'react';
import Footer from '../Footer';

const PhotoGalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Photo Gallery
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Browse our collection of photos and images for retirement planning and financial guidance
          </p>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#36596A] mb-4">Photo Gallery</h2>
            <p className="text-gray-600 mb-6">
              Our photo gallery is coming soon. Check back for inspiring images related to retirement planning and financial guidance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                  <span className="text-gray-500">Photo {item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PhotoGalleryPage;
