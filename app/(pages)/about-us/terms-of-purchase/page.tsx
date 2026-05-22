

import Footer from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import Link from "next/link";


const TermsOfPurchasePage = () => {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Terms of Purchase</h1>
          <p className="text-gray-600">Last Updated: 2025</p>
          <div className="h-1 w-20 bg-red-600 mt-4"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            These Terms of Purchase govern all payments, subscriptions, and billing transactions made
            on the VeriProperty Nigeria platform.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By purchasing any paid plan or service on VeriProperty Nigeria, you agree to the terms
            outlined in this policy.
          </p>
        </div>

        <div className="space-y-6">
          {/* Subscription Plans */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Subscription Plans</h2>
            <p className="text-gray-700 mb-3">
              VeriProperty Nigeria offers subscription plans that allow real estate agents and agencies to
              list and promote properties on the platform.
            </p>
            <p className="text-gray-700 mb-3">
              Each subscription plan provides different listing limits and platform features. Details of the
              available plans are displayed on the platform pricing page.
            </p>
            <p className="text-gray-700">
              Users may upgrade or change plans based on their business needs.
            </p>
          </div>

          {/* Free Trial */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Free Trial</h2>
            <p className="text-gray-700 mb-3">
              VeriProperty Nigeria may provide a <span className="font-bold">14-day free trial</span> that allows new users to explore the
              platform and list a limited number of properties.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-medium">During the free trial:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-blue-700">
                <li>Users may create listings up to the allowed limit</li>
                <li>Some premium features may not be available</li>
                <li>The trial may expire automatically after the specified period</li>
              </ul>
            </div>
            <p className="text-gray-700">
              VeriProperty Nigeria reserves the right to modify or discontinue the free trial offer at any time.
            </p>
          </div>

          {/* Payments */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Payments</h2>
            <p className="text-gray-700 mb-3">
              Payments for subscription plans are processed through secure third-party payment providers.
            </p>
            <p className="text-gray-700 mb-3">Users agree to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate billing information</li>
              <li>Use authorized payment methods</li>
              <li>Pay all applicable subscription fees</li>
            </ul>
            <p className="text-gray-700 mt-3">Failure to complete payment may result in restricted platform access.</p>
          </div>

          {/* Refund Policy */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Refund Policy</h2>
            <p className="text-gray-700 mb-3">
              Payments made for subscriptions are generally <span className="font-bold">non-refundable</span>.
            </p>
            <p className="text-gray-700 mb-3">However, refunds may be considered in exceptional circumstances such as:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Billing errors</li>
              <li>Duplicate payments</li>
              <li>Technical issues preventing service access</li>
            </ul>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Note:</strong> Refund decisions are made at the discretion of VeriProperty Nigeria.
              </p>
            </div>
          </div>

          {/* Cancellation */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Cancellation</h2>
            <p className="text-gray-700 mb-3">
              Users may cancel their subscription at any time through their account settings.
            </p>
            <p className="text-gray-700 mb-3">When a subscription is cancelled:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>The current subscription will remain active until the end of the billing period</li>
              <li>Access to paid features may end after the subscription expires</li>
              <li>No partial refunds will be issued for unused subscription periods</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact for Billing Issues</h2>
            <p className="text-gray-700 mb-4">
              Users experiencing billing issues may contact the VeriProperty Nigeria team:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a href="mailto:billing@veripropertynigeria.com" className="text-red-600 hover:underline">
                  billing@veripropertynigeria.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Support:</strong>{" "}
                <Link href="/contact-us" className="text-red-600 hover:underline">
                  Contact Support
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

export default TermsOfPurchasePage;