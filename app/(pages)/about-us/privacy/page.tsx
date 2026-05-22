

import Footer from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import Link from "next/link";


const PrivacyPage = () => {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: 2025</p>
          <div className="h-1 w-20 bg-red-600 mt-4"></div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            VeriProperty Nigeria respects your privacy and is committed to protecting the personal
            information of users who access and use our platform.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            This Privacy Policy explains how we collect, use, and safeguard your information when you
            use the VeriProperty Nigeria website and services.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By using the platform, you agree to the practices described in this policy.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Personal Information</h3>
            <p className="text-gray-700 mb-3">When you create an account or interact with the platform, we may collect:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Profile photo</li>
              <li>Business or agency information</li>
              <li>Identification documents for verification</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Property Listing Information</h3>
            <p className="text-gray-700 mb-3">Agents who list properties may provide:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Property descriptions</li>
              <li>Property images</li>
              <li>Property location details</li>
              <li>Property pricing information</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Usage Information</h3>
            <p className="text-gray-700">We may collect information about how users interact with the platform, including pages visited, features used, login activity, and device/browser type. This helps us improve the platform experience.</p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">VeriProperty Nigeria uses collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To create and manage user accounts</li>
              <li>To verify agent identities</li>
              <li>To publish and manage property listings</li>
              <li>To connect property agents with potential buyers or renters</li>
              <li>To communicate important platform updates</li>
              <li>To improve platform performance and security</li>
            </ul>
            <p className="text-gray-700 mt-4 font-semibold">We do not sell users&apos; personal information to third parties.</p>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Sharing of Information</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-2">With Other Platform Users</h3>
            <p className="text-gray-700 mb-4">Information in property listings may be visible to users browsing the platform.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">With Service Providers</h3>
            <p className="text-gray-700 mb-3">We may share information with trusted third-party service providers who help operate the platform, including:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>Payment processors</li>
              <li>Hosting providers</li>
              <li>Email service providers</li>
              <li>Analytics tools</li>
            </ul>
            <p className="text-gray-700">These providers are required to protect your information.</p>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Legal Requirements</h3>
            <p className="text-gray-700">We may disclose information if required by law or when necessary to protect the rights and safety of VeriProperty Nigeria or its users.</p>
          </div>

          {/* Section 4-9 - Add remaining sections similarly */}

          {/* Section 9 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or how your information is handled, you may contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@veripropertynigeria.com" className="text-red-600 hover:underline">
                  privacy@veripropertynigeria.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Or use our</strong>{" "}
                <Link href="/contact-us" className="text-red-600 hover:underline">
                  Contact Form
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer/>
    </>
  );
};

export default PrivacyPage;