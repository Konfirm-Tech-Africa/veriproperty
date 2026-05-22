"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/app/components/navbar";
import Footer from "@/app/components/footer";

interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  answers: Answer[];
  upvotes: number;
  views: number;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  upvotes: number;
  isExpert: boolean;
}

const BrowseQuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'buying', label: 'Buying' },
    { value: 'renting/shortlet', label: 'Renting' },
    { value: 'legal', label: 'Legal' },
    { value: 'financing', label: 'Financing' },
    { value: 'investment', label: 'Investment' },
    { value: 'selling', label: 'Selling' },
  ];

  // Mock data with 10 different questions from various users
  const mockQuestions: Question[] = [
    {
      id: '1',
      title: 'What is the average cost of a 3-bedroom apartment in Lagos?',
      content: 'I\'m looking to rent a 3-bedroom apartment in Lagos. What should I expect to pay in areas like Lekki, Victoria Island, and Ikeja? Also, what are the typical security deposits and agency fees?',
      category: 'renting',
      author: 'John D.',
      createdAt: '2024-01-15',
      upvotes: 24,
      views: 156,
      answers: [
        {
          id: '1-1',
          content: 'In Lekki, expect to pay between ₦3-₦6 million per annum depending on the exact location and amenities. Victoria Island is more expensive, ranging from ₦4-₦8 million. Ikeja offers more affordable options at ₦2-₦4 million. Security deposits are typically 1-2 months rent.',
          author: 'Sarah M. - Property Expert',
          createdAt: '2024-01-16',
          upvotes: 12,
          isExpert: true
        }
      ]
    },
    {
      id: '2',
      title: 'How do I verify property documents in Nigeria?',
      content: 'I\'m about to purchase a property and want to make sure all documents are genuine. What steps should I take to verify property documents? Are there specific government offices I need to visit?',
      category: 'legal',
      author: 'Michael T.',
      createdAt: '2024-01-14',
      upvotes: 18,
      views: 89,
      answers: [
        {
          id: '2-1',
          content: 'Always verify with the Land Registry in the state where the property is located. Check for Certificate of Occupancy, Governor\'s Consent, and conduct a search at the appropriate lands office. I recommend hiring a lawyer specializing in property law.',
          author: 'David L. - Legal Expert',
          createdAt: '2024-01-15',
          upvotes: 15,
          isExpert: true
        }
      ]
    },
    {
      id: '3',
      title: 'Best areas for family living in Abuja?',
      content: 'Looking for family-friendly neighborhoods in Abuja with good schools, security, and amenities. Any recommendations for areas with reliable power supply and good road networks?',
      category: 'buying',
      author: 'Grace K.',
      createdAt: '2024-01-13',
      upvotes: 31,
      views: 203,
      answers: [
        {
          id: '3-1',
          content: 'Maitama and Asokoro are excellent but expensive. For more affordable family-friendly areas, consider Gwarinpa, Jabi, or Katampe. These areas have good schools, shopping centers, and proper security.',
          author: 'Veri Property Team',
          createdAt: '2024-01-14',
          upvotes: 20,
          isExpert: true
        }
      ]
    },
    {
      id: '4',
      title: 'What are the current mortgage interest rates in Nigeria?',
      content: 'I\'m planning to buy my first home and considering a mortgage. What are the current interest rates from major banks? Are there any government programs for first-time home buyers?',
      category: 'financing',
      author: 'Chinedu O.',
      createdAt: '2024-01-12',
      upvotes: 42,
      views: 187,
      answers: [
        {
          id: '4-1',
          content: 'Current mortgage rates range from 18% to 25% depending on the bank and loan duration. The Federal Mortgage Bank of Nigeria offers the National Housing Fund (NHF) scheme with lower rates around 6% for qualified applicants.',
          author: 'Financial Advisor Pro',
          createdAt: '2024-01-13',
          upvotes: 28,
          isExpert: true
        }
      ]
    },
    {
      id: '5',
      title: 'Is real estate still a good investment in Lagos?',
      content: 'With the current economic situation, is real estate in Lagos still a viable investment? Which areas are showing the best returns? Should I consider commercial or residential properties?',
      category: 'investment',
      author: 'Aisha B.',
      createdAt: '2024-01-11',
      upvotes: 37,
      views: 245,
      answers: [
        {
          id: '5-1',
          content: 'Real estate in Lagos remains a solid investment. Areas like Lekki Phase 1, Ikoyi, and Victoria Island continue to appreciate. Commercial properties offer better returns but require more capital. Consider REITs for smaller investments.',
          author: 'Investment Specialist',
          createdAt: '2024-01-12',
          upvotes: 22,
          isExpert: true
        }
      ]
    },
    {
      id: '6',
      title: 'How to negotiate property prices in a slow market?',
      content: 'I\'ve noticed some properties staying on the market longer. What negotiation strategies work best in a slow real estate market? How much below asking price is reasonable to offer?',
      category: 'buying',
      author: 'Emeka N.',
      createdAt: '2024-01-10',
      upvotes: 29,
      views: 134,
      answers: [
        {
          id: '6-1',
          content: 'In slow markets, start with 15-20% below asking price. Research comparable properties, point out needed repairs, and be prepared to walk away. Cash offers have more negotiating power.',
          author: 'Negotiation Expert',
          createdAt: '2024-01-11',
          upvotes: 18,
          isExpert: true
        }
      ]
    },
    {
      id: '7',
      title: 'What are the hidden costs of buying property in Nigeria?',
      content: 'Besides the purchase price, what other costs should I budget for when buying property? I want to avoid surprises during the purchasing process.',
      category: 'buying',
      author: 'Fatima A.',
      createdAt: '2024-01-09',
      upvotes: 45,
      views: 198,
      answers: [
        {
          id: '7-1',
          content: 'Budget for legal fees (3-5%), survey fees, stamp duties, registration fees, and agency commission (5-10%). Also consider building inspection costs and potential renovation expenses.',
          author: 'Real Estate Consultant',
          createdAt: '2024-01-10',
          upvotes: 31,
          isExpert: true
        }
      ]
    },
    {
      id: '8',
      title: 'How to handle problematic tenants as a landlord?',
      content: 'I\'m having issues with tenants not paying rent on time and causing property damage. What are my legal rights as a landlord? What\'s the proper eviction process in Lagos?',
      category: 'renting',
      author: 'Mr. Johnson',
      createdAt: '2024-01-08',
      upvotes: 33,
      views: 167,
      answers: [
        {
          id: '8-1',
          content: 'Serve proper notice, document all communications, and follow the Tenancy Law of Lagos State. For eviction, you must obtain a court order. Consider using a property management company.',
          author: 'Legal Property Expert',
          createdAt: '2024-01-09',
          upvotes: 25,
          isExpert: true
        }
      ]
    },
    {
      id: '9',
      title: 'Best way to stage a home for quick sale in Abuja?',
      content: 'I need to sell my 4-bedroom duplex quickly. What staging techniques work best in the Abuja market? Should I invest in professional staging or can I do it myself?',
      category: 'selling',
      author: 'Mrs. Adebayo',
      createdAt: '2024-01-07',
      upvotes: 27,
      views: 123,
      answers: [
        {
          id: '9-1',
          content: 'Focus on decluttering, deep cleaning, and neutral decor. Professional photos are essential. In Abuja market, emphasize security features and power backup systems. Professional staging can increase sale price by 5-10%.',
          author: 'Home Staging Pro',
          createdAt: '2024-01-08',
          upvotes: 19,
          isExpert: true
        }
      ]
    },
    {
      id: '10',
      title: 'Are short-term rentals profitable in Port Harcourt?',
      content: 'I\'m considering buying a property for short-term rentals in Port Harcourt. Is there enough demand from oil company workers and business travelers? What are the occupancy rates like?',
      category: 'investment',
      author: 'Bisi R.',
      createdAt: '2024-01-06',
      upvotes: 38,
      views: 176,
      answers: [
        {
          id: '10-1',
          content: 'Short-term rentals in GRA and Old GRA areas have good demand from oil company expats. Occupancy rates average 60-70%. Focus on furnished apartments with reliable internet and power backup.',
          author: 'Hospitality Expert',
          createdAt: '2024-01-07',
          upvotes: 26,
          isExpert: true
        }
      ]
    },
    {
      id: '11',
      title: 'How to check land ownership before purchase?',
      content: 'I found a land I want to buy but I\'m concerned about multiple ownership claims. What due diligence should I perform to verify the true owner?',
      category: 'legal',
      author: 'Tunde M.',
      createdAt: '2024-01-05',
      upvotes: 41,
      views: 189,
      answers: [
        {
          id: '11-1',
          content: 'Conduct a search at the Land Registry, verify the Certificate of Occupancy, check for any encumbrances or court cases, and physically inspect the land with local residents.',
          author: 'Land Verification Expert',
          createdAt: '2024-01-06',
          upvotes: 32,
          isExpert: true
        }
      ]
    },
    {
      id: '12',
      title: 'What insurance is required for rental properties?',
      content: 'I own several rental properties in Ibadan. What type of insurance coverage is essential? Are landlords required to have any specific insurance by law?',
      category: 'renting',
      author: 'Landlord Pro',
      createdAt: '2024-01-04',
      upvotes: 23,
      views: 145,
      answers: [
        {
          id: '12-1',
          content: 'Essential coverage includes building insurance, public liability insurance, and rent guarantee insurance. While not legally required, they protect your investment from damages and tenant defaults.',
          author: 'Insurance Specialist',
          createdAt: '2024-01-05',
          upvotes: 17,
          isExpert: true
        }
      ]
    }
  ];

  useEffect(() => {
    setQuestions(mockQuestions);
  }, []);

  const filteredQuestions = questions
    .filter(q => selectedCategory === 'all' || q.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.upvotes - a.upvotes;
        case 'most-answered':
          return b.answers.length - a.answers.length;
        default:
          return 0;
      }
    });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Property Questions & Answers
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse {questions.length} questions from our community and get insights from property experts
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="most-answered">Most Answered</option>
              </select>
            </div>

            <Link
              href="/contact-us"
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Ask a Question
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
              <div className="text-gray-600">Total Questions</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div className="text-2xl font-bold text-gray-900">
                {questions.reduce((acc, q) => acc + q.answers.length, 0)}
              </div>
              <div className="text-gray-600">Expert Answers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div className="text-2xl font-bold text-gray-900">
                {questions.reduce((acc, q) => acc + q.views, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Views</div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {filteredQuestions.map(question => (
              <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-800 flex-1 pr-4">
                    <Link href={`/questions/${question.id}`} className="hover:text-red-600 transition-colors">
                      {question.title}
                    </Link>
                  </h2>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize">
                    {question.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {question.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>By {question.author}</span>
                    <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" />
                      </svg>
                      {question.answers.length} answers
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {question.upvotes} upvotes
                    </span>
                    <span>{question.views} views</span>
                  </div>
                </div>

                {/* Expert Answers Preview */}
                {question.answers.some(answer => answer.isExpert) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800 text-sm font-medium mb-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Expert Answer Available
                    </div>
                    <p className="text-green-700 text-sm line-clamp-2">
                      {question.answers.find(answer => answer.isExpert)?.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">❓</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
              <p className="text-gray-500 mb-6">Try selecting a different category or be the first to ask a question!</p>
              <Link
                href="/ask-question"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Ask the First Question
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default BrowseQuestionsPage;