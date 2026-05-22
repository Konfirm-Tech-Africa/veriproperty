"use client";
import Image from "next/image";
import { useState } from "react";

// Define image URLs at the top
const IMAGE_URLS = {
  mostProperties:
    "https://cdn.pgimgs.com/hive-ui/static/v0.1.3/images/most-properties-red.svg",
  userReviews:
    "https://cdn.pgimgs.com/hive-ui/static/v0.1.3/images/user-reviews-red.svg",
  latestLaunches:
    "https://cdn.pgimgs.com/hive-ui/static/v0.1.3/images/latest-launches-red.svg",
  rentalProperties:
    "https://cdn.pgimgs.com/hive-ui/static/v0.1.3/images/overseas-property-red.svg",
};

// Define SEO cards data as an array
const SEO_CARDS = [
  {
    title: "Most Properties",
    description:
      'Find your dream home with the most comprehensive <a href="/property-for-sale" class="text-green-600 hover:underline">resale property</a> database, discover <a href="/apartment-condo-for-sale" class="text-green-600 hover:underline">high-rise properties</a> such as <a href="/hdb-for-sale" class="text-green-600 hover:underline">HDB</a>, <a href="/condo-for-sale" class="text-green-600 hover:underline">condo</a> and <a href="/apartment-for-sale" class="text-green-600 hover:underline">apartment</a> or <a href="/landed-house-for-sale" class="text-green-600 hover:underline">landed property</a> for sale in Nigeria.',
    imageUrl: IMAGE_URLS.mostProperties,
  },
  {
    title: "User Reviews",
    description:
      'On our <a href="/condo-directory" class="text-green-600 hover:underline">Condo directory</a>, you can find Nigeria\'s most popular condominiums reviewed and rated by our users.',
    imageUrl: IMAGE_URLS.userReviews,
  },
  {
    title: "Latest Launches",
    description:
      'We provide comprehensive detail and our own <a href="/new-project-launch/reviews" class="text-green-600 hover:underline">property reviews</a> on <a href="/new-project-launch" class="text-green-600 hover:underline">new condo launches</a>, <a href="/Nigeria-property-resources/Nigeria-condo-guides/executive-condominiums-in-Nigeria" class="text-green-600 hover:underline">Executive Condominiums (EC)</a>, <a href="/hdb/bto-launches" class="text-green-600 hover:underline">HDB BTO (Build-To-Order)</a> and new homes in and around Nigeria.',
    imageUrl: IMAGE_URLS.latestLaunches,
  },
  {
    title: "Rental Properties",
    description:
      'Make Nigeria your home with most <a href="/property-for-rent" class="text-green-600 hover:underline">rental properties</a> database, discover <a href="/apartment-condo-for-rent" class="text-green-600 hover:underline">high-rise properties</a> such as <a href="/hdb-for-rent" class="text-green-600 hover:underline">HDB</a>, <a href="/condo-for-rent" class="text-green-600 hover:underline">condo</a> and <a href="/apartment-for-rent" class="text-green-600 hover:underline">apartment</a>, <a href="/landed-house-for-rent" class="text-green-600 hover:underline">landed property</a> for rent or <a href="/property-for-rent/room-rental" class="text-green-600 hover:underline">room rental</a> in Nigeria.',
    imageUrl: IMAGE_URLS.rentalProperties,
  },
];

const BottomContainer = () => {
  const handleBrowseQuestions = () => {
    window.location.href = "/browse-questions";
  }

  const handleAskQuestion = () => {
    window.location.href = "/contact-us";
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Ask Guru Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-16">
        {/* Left Side - Ask Guru */}
        <div className="lg:w-1/2 flex flex-col items-center p-8 bg-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
          <Image
            src="https://cdn.pgimgs.com/hive-ui/static/v0.2.4/images/ask-guru.svg"
            alt="Ask Guru"
            className="w-20 h-20 mb-4"
            width={100}
            height={100}
          />
          <h4 className="text-2xl font-bold text-gray-800 mb-3">AskGuru</h4>
          <p className="text-gray-600 text-center mb-6 max-w-xs">
            Make confident property decisions with advice from our Veri Property
            community of experts
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleAskQuestion}
              className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              Ask a Question
            </button>
            <button
              onClick={handleBrowseQuestions}              
              className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
              Browse Questions
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm font-medium text-gray-600 mb-3 block">
              Trending Categories
            </span>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { name: "Home Buying", href: "/home-buying" },
                { name: "Condo Questions", href: "/condo-questions" },
                { name: "HDB Questions", href: "/hdb-questions" },
                { name: "Home Selling", href: "/home-selling" },
              ].map((category) => (
                <a
                  key={category.name}
                  href={category.href}
                  className="text-green-600 hover:text-green-800 transition-colors flex items-center gap-1"
                >
                  {category.name} →
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Ad Carousel */}
        <div className="lg:w-1/2 relative">
          <div className="overflow-hidden rounded-xl shadow-sm">
              <div
                 key="ad2"
                >
                 <AdSlotsSection />
              </div>
          </div>
        </div>
      </div>

      {/* SEO Cards Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SEO_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4">
                <Image
                  width={100}
                  height={100}
                  src={card.imageUrl}
                  alt={`${card.title} icon`}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">{card.title}</h3>
              <div
                className="text-sm text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: card.description }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BottomContainer;


const AdSlotsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const adSlides = [
    <div
      key="ad1"
      className="bg-gradient-to-br from-green-50 to-green-100 h-64 flex flex-col items-center justify-center text-green-700 rounded-xl border-2 border-dashed border-green-200"
    >
      <div className="text-4xl mb-2">🏢</div>
      <p className="font-semibold">Premium Property Listing</p>
      <p className="text-sm text-green-600 mt-1">Reach thousands of buyers</p>
    </div>,
    <div
      key="ad2"
      className="bg-gradient-to-br from-green-50 to-green-100 h-64 flex flex-col items-center justify-center text-green-700 rounded-xl border-2 border-dashed border-green-200"
    >
      <div className="text-4xl mb-2">⭐</div>
      <p className="font-semibold">Featured Agent Spot</p>
      <p className="text-sm text-green-600 mt-1">Get more visibility</p>
    </div>,
    <div
      key="ad3"
      className="bg-gradient-to-br from-green-50 to-green-100 h-64 flex flex-col items-center justify-center text-green-700 rounded-xl border-2 border-dashed border-green-200"
    >
      <div className="text-4xl mb-2">🎯</div>
      <p className="font-semibold">Targeted Advertising</p>
      <p className="text-sm text-green-600 mt-1">Reach your ideal audience</p>
    </div>,
  ];

  return (
    <div className="h-full">
      <div className="overflow-hidden rounded-xl shadow-sm h-full">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {adSlides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation and Indicators */}
      <div className="flex flex-col items-center justify-between mt-4 mb-6 p-6">
        <div className="flex gap-1">
          {adSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="flex gap-2 mt-5">
          <button
            onClick={() => setCurrentSlide((prev) => 
              prev === 0 ? adSlides.length - 1 : prev - 1
            )}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => 
              prev === adSlides.length - 1 ? 0 : prev + 1
            )}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};