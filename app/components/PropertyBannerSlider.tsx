// components/PropertyBannerSlider.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import BgImage1 from '@/public/banner-1.png';
import BgImage2 from '@/public/banner-2.png';
import BgImage3 from '@/public/banner-3.png';
import BgImage4 from '@/public/banner-4.png';
import BgImage5 from '@/public/banner-5.png';
import BgImage6 from '@/public/banner-6.png';
import BgImage7 from '@/public/banner-7.png';
import BgImage8 from '@/public/banner-8.png';

interface Banner {
  id: number;
  type: string;
  headline: string;
  subText: string;
  ctaText: string;
  ctaLink: string;
  bgImage: string | StaticImageData;
}

const banners: Banner[] = [
  {
    id: 1,
    type: 'BUY',
    headline: 'Buy Your Next Home With Confidence',
    subText: 'Verified properties. Trusted agents.',
    ctaText: 'Start Buying',
    ctaLink: '/buy',
    bgImage: BgImage1,
  },
  {
    id: 2,
    type: 'RENT',
    headline: 'Find the Perfect Place to Rent',
    subText: 'No scams. Only verified listings.',
    ctaText: 'Browse Rentals',
    ctaLink: '/rent',
    bgImage: BgImage2,
  },
  {
    id: 3,
    type: 'VERIFIED AGENTS',
    headline: 'Work With Trusted, Verified Agents',
    subText: 'Every agent completes KYC verification.',
    ctaText: 'Meet Agents',
    ctaLink: '#',
    bgImage: BgImage3,
  },
  {
    id: 4,
    type: 'VERIFIED LISTINGS',
    headline: 'Only Verified Properties. No Stories.',
    subText: 'Listings screened for authenticity.',
    ctaText: 'Explore Listings',
    ctaLink: '/properties/all-properties',
    bgImage: BgImage4,
  },
  {
    id: 5,
    type: 'LIST YOUR PROPERTY',
    headline: 'Sell or Rent Out Your Property Fast',
    subText: 'Reach serious buyers and verified agents.',
    ctaText: 'List Property',
    ctaLink: '/auth/login',
    bgImage: BgImage5,
  },
  {
    id: 6,
    type: 'PROPERTYGURU',
    headline: 'Nigeria\'s Most Trusted Real Estate Platform',
    subText: 'Safe. Verified. Transparent.',
    ctaText: 'Get Started',
    ctaLink: '/auth/register',
    bgImage: BgImage6,
  },
  {
    id: 7,
    type: 'AGENT BUSINESS TOOLS',
    headline: 'Grow Your Real Estate Business',
    subText: 'Smart tools. Verified leads.',
    ctaText: 'Upgrade Plan',
    ctaLink: '#',
    bgImage: BgImage7,
  },
  {
    id: 8,
    type: 'ZERO SCAMS',
    headline: 'We Protect Your Real Estate Experience',
    subText: 'Strict agent & property verification.',
    ctaText: 'Learn More',
    ctaLink: '/guide',
    bgImage: BgImage8,
  },
];

export default function PropertyBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState(1); // Start with 1 for SSR
  const [isClient, setIsClient] = useState(false); // Track if we're on client
  const sliderRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, banners.length - visibleCards);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, [visibleCards]);

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, banners.length - visibleCards);
      return prev === 0 ? maxIndex : prev - 1;
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Calculate visible cards based on screen size on client side
  useEffect(() => {
    if (!isClient) return;

    const updateVisibleCards = () => {
      const width = window.innerWidth;
      let cards = 1;
      if (width < 640) cards = 1; // Mobile: 1 card
      else if (width < 1024) cards = 2; // Tablet: 2 cards
      else cards = 3; // Desktop: 3 cards
      
      setVisibleCards(cards);
      
      // Reset current index if it's out of bounds with new card count
      const maxIndex = Math.max(0, banners.length - cards);
      if (currentIndex > maxIndex) {
        setCurrentIndex(maxIndex);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, [isClient, currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !isClient) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying, isClient]);

  // Calculate card width - use visibleCards only after hydration
  const cardWidth = isClient ? 100 / visibleCards : 100;

  // Calculate max index for navigation dots
  const maxIndex = Math.max(0, banners.length - visibleCards);
  const totalSlideGroups = Math.ceil(banners.length / visibleCards);

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 mt-15">
            Explore Real Estate Solutions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of verified real estate services
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Slider with Cards */}
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}%)`,
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="flex-shrink-0 px-3 transition-all duration-300"
                style={{ width: `${cardWidth}%` }}
              >
                <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 min-h-[320px] md:min-h-[380px]">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    {typeof banner.bgImage === 'string' ? (
                      <div 
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${banner.bgImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    ) : (
                      <Image
                        src={banner.bgImage}
                        alt={banner.type}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={banner.id <= 3}
                      />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 mt-25">
                    {/* Type Badge */}
                    <div className="mb-4">
                      <span className="inline-block bg-green-600 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                        {banner.type}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2">
                      {banner.headline}
                    </h3>

                    {/* Sub-text */}
                    <p className="text-gray-200 text-sm md:text-base mb-6 line-clamp-2">
                      {banner.subText}
                    </p>

                    {/* CTA Button - Changed to Green */}
                    <button 
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl text-sm md:text-base transition-all duration-200 transform group-hover:scale-105 w-full"
                      onClick={() => window.location.href = banner.ctaLink}
                    >
                      {banner.ctaText}
                    </button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>

          {isClient && maxIndex > 0 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/90 hover:bg-white text-gray-900 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-20"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/90 hover:bg-white text-gray-900 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-20"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Navigation Dots - Only show if there's more than 1 slide group */}
        {isClient && totalSlideGroups > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={prevSlide}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center md:hidden"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalSlideGroups }).map((_, index) => {
                const isActive = Math.floor(currentIndex / visibleCards) === index;
                return (
                  <button
                    key={index}
                    onClick={() => goToSlide(index * visibleCards)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'bg-green-600 w-6 md:w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide group ${index + 1}`}
                  />
                );
              })}
            </div>

            <button
              onClick={nextSlide}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center md:hidden"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}