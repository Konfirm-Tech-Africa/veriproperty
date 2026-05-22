"use client";

import DashboardPropertyLists from "@/app/components/dashboard/Cards/DashboardPropertyLists";
import Footer from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import { useUser } from "@/app/context/UserContext";

export default function ShortletPage() {
  const { user } = useUser();
  const loggedInAgentId = user?.id && user?.role === "agent" ? user.id : undefined;
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Shortlet Apartments
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover premium short-term rentals across Nigeria. Perfect for business trips, 
                vacations, and temporary stays. Fully furnished and ready to move in.
              </p>
              <div className="flex justify-center gap-4">
                <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                  Browse Shortlets
                </button>
                <button className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition">
                  List Your Shortlet
                </button>
              </div>
            </div>

            {/* Property Listings */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Shortlets</h2>
              <DashboardPropertyLists
                landlordId={loggedInAgentId} 
                listingType="shortlet" 
              />
            </div>

            {/* Shortlet Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Luxury Shortlets
                </h3>
                <p className="text-gray-600 mb-4">
                  Premium apartments in prime locations with high-end furnishings and amenities
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Executive apartments
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Penthouses
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Serviced apartments
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Holiday Homes
                </h3>
                <p className="text-gray-600 mb-4">
                  Cozy homes perfect for vacations, family gatherings, and weekend getaways
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Beach houses
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Mountain retreats
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Countryside villas
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Corporate Shortlets
                </h3>
                <p className="text-gray-600 mb-4">
                  Business-ready accommodations for executives and corporate travelers
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Executive suites
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Staff housing
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Project-based stays
                  </li>
                </ul>
              </div>
            </div>

            {/* Why Choose Shortlets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Why Choose Shortlets?
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-lg mr-4 mt-1">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Flexible Duration</h4>
                      <p className="text-gray-600">Stay for days, weeks, or months - no long-term commitment required</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-lg mr-4 mt-1">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Fully Furnished</h4>
                      <p className="text-gray-600">All properties come fully equipped with modern furniture and appliances</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 rounded-lg mr-4 mt-1">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Prime Locations</h4>
                      <p className="text-gray-600">Properties in the best neighborhoods, close to amenities and attractions</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">List Your Shortlet</h3>
                <p className="text-red-100 mb-6">
                  Earn more from your property by listing it as a shortlet. Join hundreds of hosts earning steady income.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Higher returns than long-term rentals</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Verified guests for secure stays</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span>Flexible pricing & availability control</span>
                  </div>
                </div>
                <button className="bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition w-full">
                  Start Earning Today
                </button>
              </div>
            </div>

            {/* Popular Shortlet Locations */}
            <div className="bg-white rounded-2xl p-8 mt-16 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Popular Shortlet Locations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition">
                  <p className="font-semibold text-gray-900">Lagos</p>
                  <p className="text-sm text-gray-500">VI, Ikoyi, Lekki</p>
                </div>
                <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition">
                  <p className="font-semibold text-gray-900">Abuja</p>
                  <p className="text-sm text-gray-500">Maitama, Wuse, Asokoro</p>
                </div>
                <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition">
                  <p className="font-semibold text-gray-900">Port Harcourt</p>
                  <p className="text-sm text-gray-500">GRA, Old GRA</p>
                </div>
                <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition">
                  <p className="font-semibold text-gray-900">Calabar</p>
                  <p className="text-sm text-gray-500">State Housing</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mt-16 text-white">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">1,500+</div>
                  <div className="text-gray-300">Active Shortlets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">5,000+</div>
                  <div className="text-gray-300">Happy Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">500+</div>
                  <div className="text-gray-300">Verified Hosts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">15+</div>
                  <div className="text-gray-300">Cities Covered</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}