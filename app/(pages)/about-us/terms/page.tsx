

import Footer from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import Link from "next/link";

const TermsPage = () => {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last Updated: 2025</p>
          <div className="h-1 w-20 bg-red-600 mt-4"></div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            Welcome to VeriProperty Nigeria, a digital marketplace that connects property agents,
            agencies, and property seekers across Nigeria.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By accessing or using the VeriProperty Nigeria platform, you agree to comply with and be
            bound by these Terms of Service. If you do not agree with these terms, you should not use
            the platform.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. About VeriProperty Nigeria</h2>
            <div className="space-y-3 text-gray-700">
              <p>VeriProperty Nigeria is an online platform that enables verified real estate agents and agencies to list and promote properties to potential buyers or renters.</p>
              <p>VeriProperty Nigeria provides the technology and infrastructure for property listings but does not own, sell, rent, or manage any properties listed on the platform.</p>
              <p>All property transactions occur directly between agents and buyers.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 mb-3">To use VeriProperty Nigeria, you must:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and truthful registration information</li>
              <li>Have the legal authority to represent the property you list</li>
            </ul>
            <p className="text-gray-700 mt-3">VeriProperty Nigeria reserves the right to refuse service or terminate accounts that violate these conditions.</p>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Account Registration</h2>
            <p className="text-gray-700 mb-3">Users must create an account to access certain features of the platform.</p>
            <p className="text-gray-700 mb-3">When creating an account, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate information</li>
              <li>Maintain the security of your login credentials</li>
              <li>Notify us immediately if unauthorized access occurs</li>
            </ul>
            <p className="text-gray-700 mt-3">Users are responsible for all activities conducted through their accounts.</p>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Agent Verification</h2>
            <p className="text-gray-700 mb-3">VeriProperty Nigeria may require agents to complete identity verification before listing properties.</p>
            <p className="text-gray-700 mb-3">Verification may include:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Government-issued identification</li>
              <li>Business registration documents</li>
              <li>Additional verification checks</li>
            </ul>
            <p className="text-gray-700 mt-3">Verification helps improve trust and transparency on the platform.</p>
            <p className="text-gray-700 mt-3">VeriProperty Nigeria reserves the right to approve, reject, or revoke verification status at its discretion.</p>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Property Listings</h2>
            <p className="text-gray-700 mb-3">Agents and agencies are responsible for ensuring that all property listings are:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Accurate</li>
              <li>Truthful</li>
              <li>Not misleading</li>
              <li>Legally authorized for listing</li>
            </ul>
            <p className="text-gray-700 mt-3">Listings must include correct information such as:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Property location</li>
              <li>Price</li>
              <li>Description</li>
              <li>Images</li>
            </ul>
            <p className="text-gray-700 mt-3">VeriProperty Nigeria reserves the right to remove listings that violate platform standards.</p>
          </div>

          {/* Continue with remaining sections... */}
          {/* Section 6-12 similar structure */}

          {/* Section 12 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions regarding these Terms of Service, you may contact the VeriProperty Nigeria team:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a href="mailto:legal@veripropertynigeria.com" className="text-red-600 hover:underline">
                  legal@veripropertynigeria.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Or visit our</strong>{" "}
                <Link href="/contact-us" className="text-red-600 hover:underline">
                  Contact Page
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Acceptance Bar */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            By using VeriProperty Nigeria, you acknowledge that you have read and understood these Terms of Service.
          </p>
        </div>
      </div>
    </main>
    <Footer/>
    </>
  );
};

export default TermsPage;