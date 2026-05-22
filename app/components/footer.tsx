"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/PropertyGuruLogo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export const VeriPropertyLogo = () => (
  <Link href="/" className="inline-block">
    <Image 
      src={logo} 
      alt="veri-property Nigeria" 
      className="h-auto w-auto bg-amber-50"
      priority={false}
    />
  </Link>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log("Newsletter subscription");
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Company Info */}
          <div className="lg:col-span-1">
            <VeriPropertyLogo />
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              Nigeria&apos;s leading real estate platform connecting property seekers with trusted agents.
            </p>
            <div className="flex gap-3 mt-4 lg:hidden">
              {/* Mobile Social Icons (optional) */}
              <SocialLinks />
            </div>
          </div>

          {/* Quick Links - Buy & Sell */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Buy & Sell</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/buy" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/buy" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Buy House
                </Link>
              </li>
              <li>
                <Link href="/buy" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Buy Land
                </Link>
              </li>
              <li>
                <Link href="/buy" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Commercial Property
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Sell Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Rent & Shortlet */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Rent & Shortlet</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/rent" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/rent" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Rent Apartment
                </Link>
              </li>
              <li>
                <Link href="/shortlet" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Shortlet Apartments
                </Link>
              </li>
              <li>
                <Link href="/shortlet" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Furnished Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Property Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Blog & News
                </Link>
              </li>
              <li>
                <Link href="/browse-questions" className="text-gray-400 hover:text-green-500 transition text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Auth */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              {/* <li>
                <Link href="/about-us" className="text-gray-400 hover:text-green-500 transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-400 hover:text-green-500 transition text-sm">
                  Contact Us
                </Link>
              </li> */}
              <li className="pt-4">
                <Link 
                  href="/auth/login" 
                  className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg inline-block text-sm font-medium transition w-full text-center"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  href="/auth/register" 
                  className="text-gray-400 hover:text-white border border-gray-700 hover:border-green-600 px-4 py-2 rounded-lg inline-block text-sm transition w-full text-center"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-semibold">Subscribe to our Newsletter</h4>
              <p className="text-gray-400 text-sm">Get the latest property updates and offers</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-600 w-full md:w-64"
                required
              />
              <button 
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-r-lg transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-950 py-6 px-6 md:px-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center text-sm text-white font-medium">
          {/* Policy Links */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 lg:mb-0 justify-center">
            <Link href="/about-us/acceptable-use" className="text-gray-400 hover:text-white transition text-xs">
              Acceptable Use
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link href="/about-us/terms" className="text-gray-400 hover:text-white transition text-xs">
              Terms
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition text-xs">
              Privacy
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link href="/about-us/terms-of-purchase" className="text-gray-400 hover:text-white transition text-xs">
              Purchase
            </Link>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <Link href="/about-us/cookie-policy" className="text-gray-400 hover:text-white transition text-xs">
              Cookies
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-3 mb-4 lg:mb-0">
            <SocialLinks />
          </div>

          {/* Copyright and Powered By */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="text-center lg:text-right">
              <p className="text-gray-400 text-xs">
                Powered by{" "}
                <a 
                  href="https://konfirmtechafrica.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-400 transition font-medium"
                >
                  KonfirmTech Africa
                </a>
              </p>
            </div>
            <div className="text-center lg:text-right mt-1">
              <p className="text-gray-500 text-xs">© {currentYear} Veri Property. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social Links Component (reusable)
const SocialLinks = () => (
  <>
    <a 
      href="https://facebook.com/veripropertyng" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300"
      aria-label="Facebook"
    >
      <FaFacebookF className="text-white text-xs" />
    </a>
    <a 
      href="https://x.com/VeriPropertyNG" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300"
      aria-label="X (Twitter)"
    >
      <FaTwitter className="text-white text-xs" />
    </a>
    <a 
      href="https://www.instagram.com/veripropertyng?igsh=MTZ4M3NnZ21jYmx2cg==" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300"
      aria-label="Instagram"
    >
      <FaInstagram className="text-white text-xs" />
    </a>
    <a 
      href="https://www.linkedin.com/company/veripropertyng" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300"
      aria-label="LinkedIn"
    >
      <FaLinkedinIn className="text-white text-xs" />
    </a>
    <a 
      href="https://www.youtube.com/@VeriPropertyNG" 
      target="_blank"
      rel="noopener noreferrer"
      className="w-7 h-7 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300"
      aria-label="YouTube"
    >
      <FaYoutube className="text-white text-xs" />
    </a>
  </>
);

export default Footer;