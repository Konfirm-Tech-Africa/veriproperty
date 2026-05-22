
import Footer from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import Link from "next/link";

const CookiePolicyPage = () => {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last Updated: 2025</p>
          <div className="h-1 w-20 bg-red-600 mt-4"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-gray-700 leading-relaxed">
            This Cookie Policy explains how VeriProperty Nigeria uses cookies and similar
            technologies when you visit or use our website and services.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            By continuing to use the VeriProperty Nigeria platform, you agree to the use of cookies as
            described in this policy.
          </p>
        </div>

        <div className="space-y-6">
          {/* What are Cookies */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-700 mb-3">
              Cookies are small text files that are stored on your device when you visit a website.
            </p>
            <p className="text-gray-700 mb-3">
              They help websites remember user actions and preferences over time, making the browsing
              experience smoother and more efficient.
            </p>
            <p className="text-gray-700">
              Cookies do not typically contain personal information but may be linked to data stored about
              your account.
            </p>
          </div>

          {/* How We Use Cookies */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Cookies</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Platform Functionality</h3>
                <p className="text-gray-700 mb-2">Cookies help the platform operate correctly by:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Keeping users logged in</li>
                  <li>Saving user session information</li>
                  <li>Maintaining account settings</li>
                </ul>
                <p className="text-gray-600 text-sm mt-1">These cookies are necessary for the website to function properly.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance and Analytics</h3>
                <p className="text-gray-700 mb-2">Cookies may also be used to understand how users interact with the platform. This may include:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Pages visited</li>
                  <li>Time spent on pages</li>
                  <li>Features used on the platform</li>
                </ul>
                <p className="text-gray-600 text-sm mt-1">This information helps us improve the user experience and optimize the platform.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Security</h3>
                <p className="text-gray-700">
                  Some cookies help us detect suspicious activity and protect user accounts from
                  unauthorized access. These cookies support the overall security of the platform.
                </p>
              </div>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-3">
              VeriProperty Nigeria may use third-party services that also place cookies on user devices.
            </p>
            <p className="text-gray-700 mb-3">These services may include:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Analytics providers (e.g., Google Analytics)</li>
              <li>Payment service providers</li>
              <li>Email and marketing tools</li>
            </ul>
            <p className="text-gray-700 mt-3">
              These third parties may collect certain usage data according to their own privacy policies.
            </p>
          </div>

          {/* Managing Cookies */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Managing Cookies</h2>
            <p className="text-gray-700 mb-3">
              Users can control or disable cookies through their web browser settings.
            </p>
            <p className="text-gray-700 mb-3">Most browsers allow users to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>View stored cookies</li>
              <li>Delete cookies</li>
              <li>Block certain cookies</li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-yellow-800">
                <strong>⚠️ Please note:</strong> Disabling cookies may affect some platform features and functionality.
              </p>
            </div>
          </div>

          {/* Cookie Preferences */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookie Preferences</h2>
            <p className="text-gray-700 mb-4">
              You can manage your cookie preferences at any time:
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Accept All Cookies
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Reject Non-Essential
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@veripropertynigeria.com" className="text-red-600 hover:underline">
                  privacy@veripropertynigeria.com
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
      </div>
    </main>
    <Footer/>
    </>
  );
};

export default CookiePolicyPage;