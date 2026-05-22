import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { 
  HiOutlineUserGroup, 
  HiOutlineShieldCheck, 
  HiOutlineLightBulb,
  HiOutlineChartBar 
} from "react-icons/hi";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Navbar } from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import louis from "@/public/louis.png";
import olorunda from "@/public/olorunda.png"

export const metadata: Metadata = {
  title: "About Us | Veri Property",
  description: "Learn about Veri Property - modern real estate platform connecting property seekers with trusted agents across Nigeria.",
};

const teamMembers = [
  {
    name: "Olorunda Francis Monday",
    role: "CEO / Founder",
    description: "Leading the vision and operations for the platform with over 15 years in real estate tech. A visionary leader committed to transforming Nigeria's real estate landscape through technology and innovation.",
    image: olorunda,
    socials: {
      website: "https://sites.google.com/view/biography-of-olorunda-francis/home?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcAQosOhleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAac0IfXJ79vE-2XdXQVezHDFN0ySSHQ9vD21CxNsHc7vRSePKw-tIMShCZcXAQ_aem_WUha9PpQipyN5f6cLlVgrA",
      instagram: "https://www.instagram.com/hercules1512?igsh=aHJtcGZuazY3emFq",
      facebook: "https://www.facebook.com/share/17o7os2avr/",
      linkedin: "https://www.linkedin.com/in/francis-olorunda-b6433a194?utm_source=share_via&utm_content=profile&utm_medium=member_android"
    }
  },
  {
    name: "Olorunda Louis Lucky",
    role: "Co-Founder",
    description: "Co-founder and strategic leader driving innovation and growth. Passionate about creating meaningful connections between property seekers and verified agents.",
    image: louis,
    socials: {
      instagram: "https://www.instagram.com/louisolorunda?igsh=MXM0ZGxkOGgzMXN4ZQ==",
      facebook: "https://www.facebook.com/share/188pPhp2rj/",
      linkedin: "https://www.linkedin.com/in/pveema?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      twitter: "https://x.com/louis670421"
    }
  }
];

const features = [
  {
    icon: HiOutlineShieldCheck,
    title: "Verified Agents & Listings",
    description: "All property information is accurate and trustworthy through our verification process.",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Seamless Experience",
    description: "User-friendly interface for both agents and property seekers to navigate easily.",
  },
  {
    icon: HiOutlineChartBar,
    title: "Value for Agents",
    description: "Subscription plans designed to boost visibility, credibility, and lead conversion.",
  },
  {
    icon: HiOutlineLightBulb,
    title: "Fully Supported Platform",
    description: "With KonfirmTech Africa managing tech, marketing, and operations for optimal performance.",
  },
];

const AboutPage = () => {
  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Veri Property
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl leading-relaxed">
            A modern real estate platform designed to connect property seekers
            with trusted agents across the country.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Powered by our strategic partner, <span className="font-semibold text-red-600"><a href="https://konfirmtechafrica.com/" target="_blank" rel="noopener noreferrer">Konfirm Tech Africa</a></span>, 
              the platform is built for speed, reliability, and growth, providing agents and users
              a seamless experience while ensuring everything behind the scenes is expertly managed.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our mission is to make property listing, searching, and verification simple, transparent, and
              trustworthy.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* For Agents */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">For Agents</h3>
              <p className="text-gray-600">
                Create a verified profile, list properties, manage leads, and gain visibility with our
                subscription plans.
              </p>
            </div>

            {/* For Users */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">For Users</h3>
              <p className="text-gray-600">
                Search, filter, and explore properties with confidence, knowing every listing is
                verified and up-to-date.
              </p>
            </div>

            {/* Trust & Transparency */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trust & Transparency</h3>
              <p className="text-gray-600">
                Our platform prioritizes secure communication, verified listings, and reliable property
                information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 md:px-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Meet the Team</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Dedicated professionals working to transform Nigeria&apos;s real estate landscape
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300">
                <div className="relative h-80 bg-gradient-to-br from-red-100 to-red-200">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiOutlineUserGroup className="w-24 h-24 text-red-400" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.description}</p>
                  
                  {/* Social Media Links */}
                  <div className="flex gap-3 pt-3 border-t border-gray-100">
                    {member.socials.website && (
                      <a
                        href={member.socials.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="Website"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </a>
                    )}
                    {member.socials.instagram && (
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="Instagram"
                      >
                        <FaInstagram className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.facebook && (
                      <a
                        href={member.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="Facebook"
                      >
                        <FaFacebook className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a
                        href={member.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="Twitter"
                      >
                        <FaTwitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-16 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">Our Strategic Partner</h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  <span className="font-bold text-white">KonfirmTech Africa</span> – The technology, marketing, and management partner behind
                  VeriProperty Nigeria.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Our team powers everything from platform development, continuous updates, and security, 
                  to marketing, growth strategy, and operational support. With KonfirmTech Africa handling 
                  these critical aspects, VeriProperty Nigeria can focus on its mission to serve agents and 
                  property seekers effectively.
                </p>
              </div>
              <div className="md:w-64">
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="font-semibold mb-2">Powered by</h3>
                  <a href="https://konfirmtechafrica.com/" target="_blank" rel="noopener noreferrer">
                    <p className="text-2xl font-bold text-red-400">Konfirm Tech Africa</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 md:px-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Why Choose Veri Property
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <feature.icon className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-red-100">
            Explore or list your property on the platform that&apos;s transforming real estate in Nigeria.
          </p>
          <Link 
            href="/auth/register" 
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </main>
    <Footer/>
</>
  );
};

export default AboutPage;