

import Footer from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import Link from "next/link";


const AcceptableUsePage = () => {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Acceptable Use Policy</h1>
          <p className="text-gray-600">Last Updated: 2025</p>
          <div className="h-1 w-20 bg-red-600 mt-4"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            This Acceptable Use Policy outlines the rules and guidelines for using the VeriProperty Nigeria platform.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            VeriProperty Nigeria is committed to maintaining a trusted marketplace for property agents,
            agencies, and property seekers across Nigeria. By using the platform, you agree to follow
            this policy.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
            Violation of this policy may result in content removal, account suspension, or permanent termination.
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Purpose of the Platform</h2>
            <p className="text-gray-700">
              VeriProperty Nigeria provides a digital marketplace where verified real estate agents and
              agencies can list and promote properties for sale or rent. Users must use the platform
              responsibly and in compliance with applicable laws.
            </p>
          </div>

          {/* Section 2 - Prohibited Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Prohibited Activities</h2>
            <p className="text-gray-700 mb-4">
              Users are strictly prohibited from engaging in activities that harm the platform or other users.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ Fraudulent Listings</h3>
                <p className="text-gray-700 mb-2">Users may not:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Post fake properties</li>
                  <li>List properties they are not authorized to represent</li>
                  <li>Misrepresent property ownership or details</li>
                  <li>Use misleading images or descriptions</li>
                </ul>
                <p className="text-gray-700 mt-2 font-medium">All listings must be truthful and legitimate.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ Misrepresentation</h3>
                <p className="text-gray-700 mb-2">Users may not:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Impersonate another person, agent, or company</li>
                  <li>Claim false professional credentials</li>
                  <li>Use stolen identities or documents</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ Illegal Activities</h3>
                <p className="text-gray-700 mb-2">Users may not use the platform to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Promote illegal property transactions</li>
                  <li>Conduct fraudulent activities</li>
                  <li>Engage in scams or deceptive practices</li>
                  <li>Violate local or national laws</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ Platform Abuse</h3>
                <p className="text-gray-700 mb-2">Users must not:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Attempt to hack or exploit the platform</li>
                  <li>Upload malicious software or harmful code</li>
                  <li>Interfere with platform security systems</li>
                  <li>Attempt to gain unauthorized access to other accounts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ Spam and Unsolicited Promotion</h3>
                <p className="text-gray-700 mb-2">Users may not:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Send spam messages through the platform</li>
                  <li>Post repetitive or irrelevant listings</li>
                  <li>Use automated bots to generate listings or interactions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sections 3-7 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Reporting Violations</h2>
            <p className="text-gray-700 mb-4">
              Users who encounter suspicious listings or activities are encouraged to report them through the platform.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>⚠️ To report a violation:</strong> Use the &quot;Report&quot; button on any listing or contact our support team directly through the{" "}
                <Link href="/contact-us" className="text-red-600 hover:underline font-medium">
                  Contact Page
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

export default AcceptableUsePage;