import Footer from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";

export default function GuidesPage() {
  const buyingGuides = [
    {
      title: "First-Time Home Buyer's Guide",
      description: "Complete step-by-step process for first-time buyers",
      steps: [
        "Assess your budget and get pre-approved",
        "Understand mortgage options and rates",
        "Choose the right location and property type",
        "Work with a reliable real estate agent",
        "Conduct proper property inspection",
        "Make an offer and negotiate terms",
        "Complete legal documentation",
        "Finalize mortgage and closing"
      ],
      duration: "8-12 weeks",
      difficulty: "Beginner"
    },
    {
      title: "Property Investment Guide",
      description: "Strategies for building wealth through real estate",
      steps: [
        "Set investment goals and risk tolerance",
        "Research market trends and growth areas",
        "Analyze rental yields and capital growth",
        "Understand different investment strategies",
        "Calculate ROI and cash flow projections",
        "Build a diversified property portfolio",
        "Manage properties effectively",
        "Plan exit strategies"
      ],
      duration: "Ongoing",
      difficulty: "Intermediate"
    },
    {
      title: "Mortgage & Financing Guide",
      description: "Understanding financing options and requirements",
      steps: [
        "Check and improve your credit score",
        "Save for down payment and closing costs",
        "Compare mortgage lenders and rates",
        "Understand different mortgage types",
        "Get pre-approved before house hunting",
        "Calculate affordability and debt-to-income ratio",
        "Prepare required documentation",
        "Complete mortgage application process"
      ],
      duration: "4-6 weeks",
      difficulty: "Beginner"
    }
  ];

  const sellingGuides = [
    {
      title: "Home Selling Preparation Guide",
      description: "Get your property ready for maximum value",
      steps: [
        "Conduct pre-listing home inspection",
        "Make necessary repairs and improvements",
        "Stage your home for showings",
        "Professional photography and virtual tours",
        "Price competitively using market analysis",
        "Create compelling listing descriptions",
        "Market across multiple channels",
        "Prepare for open houses and viewings"
      ],
      duration: "2-4 weeks",
      difficulty: "Beginner"
    },
    {
      title: "Pricing Strategy Guide",
      description: "Set the right price to attract serious buyers",
      steps: [
        "Conduct comparative market analysis",
        "Consider property condition and upgrades",
        "Factor in market trends and seasonality",
        "Understand buyer psychology and pricing",
        "Set competitive but realistic price",
        "Plan price adjustment strategy",
        "Monitor market feedback",
        "Negotiate effectively with offers"
      ],
      duration: "1-2 weeks",
      difficulty: "Intermediate"
    },
    {
      title: "Closing Process Guide",
      description: "Navigate the final steps of property sale",
      steps: [
        "Review and respond to offers",
        "Negotiate terms and conditions",
        "Handle home inspection results",
        "Work with real estate attorney",
        "Prepare transfer documents",
        "Coordinate with buyer's lender",
        "Schedule closing date",
        "Transfer keys and possession"
      ],
      duration: "30-45 days",
      difficulty: "Intermediate"
    }
  ];

  const legalGuides = [
    {
      title: "Property Documentation Guide",
      description: "Essential documents for property transactions",
      steps: [
        "Title deed and ownership documents",
        "Survey plans and boundary documents",
        "Building approval and permits",
        "Tax clearance certificates",
        "Utility bills and service records",
        "Homeowners association documents",
        "Insurance policies and claims history",
        "Warranties and guarantee documents"
      ],
      duration: "2-3 weeks",
      difficulty: "Intermediate"
    },
    {
      title: "Legal Due Diligence Guide",
      description: "Ensure legal compliance and clear title",
      steps: [
        "Verify property title and ownership",
        "Check for liens and encumbrances",
        "Review zoning and land use regulations",
        "Confirm building code compliance",
        "Check for easements and rights of way",
        "Review environmental regulations",
        "Verify tax status and obligations",
        "Confirm no pending legal disputes"
      ],
      duration: "3-4 weeks",
      difficulty: "Advanced"
    }
  ];

  const maintenanceGuides = [
    {
      title: "Home Maintenance Checklist",
      description: "Regular maintenance to preserve property value",
      steps: [
        "Monthly: Check HVAC filters, test smoke detectors",
        "Quarterly: Clean gutters, inspect roof, check plumbing",
        "Semi-annual: Service HVAC systems, inspect foundation",
        "Annual: Paint touch-ups, deck maintenance, chimney cleaning",
        "Seasonal: Prepare for weather changes, landscape care",
        "5-year: Roof inspection, repainting, major system updates",
        "10-year: Replace major systems, upgrade fixtures",
        "Emergency: Know shut-off valves, emergency contacts"
      ],
      duration: "Ongoing",
      difficulty: "Beginner"
    },
    {
      title: "Energy Efficiency Guide",
      description: "Reduce costs and environmental impact",
      steps: [
        "Conduct energy audit and assessment",
        "Upgrade insulation and weather stripping",
        "Install energy-efficient windows",
        "Replace old HVAC systems",
        "Use LED lighting and smart thermostats",
        "Install solar panels or renewable energy",
        "Implement water-saving fixtures",
        "Monitor and track energy consumption"
      ],
      duration: "1-6 months",
      difficulty: "Intermediate"
    }
  ];

  type Guide = {
    title: string;
    description: string;
    steps: string[];
    duration: string;
    difficulty: string;
  };

  type ColorClass = { bg: string; border: string; text: string };

  type Color = "blue" | "green" | "purple" | "orange" | "red";

  type GuideSectionProps = {
    title: string;
    guides: Guide[];
    color?: Color;
  };

  const GuideSection = ({ title, guides, color = "blue" }: GuideSectionProps) => {
    const colorClasses: Record<Color, ColorClass> = {
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
      green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
      orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
      red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" }
    };

    const currentColor: ColorClass = colorClasses[color] || colorClasses.blue;

    return (
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {
            guides.map((guide: Guide, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg border ${currentColor.border} hover:shadow-xl transition-all duration-300`}
              >
                <div className="p-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentColor.bg} ${currentColor.text} mb-4`}>
                    {guide.duration} • {guide.difficulty}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {guide.description}
                  </p>
                  <div className="space-y-2">
                    {guide.steps.map((step: string, stepIndex: number) => (
                      <div key={stepIndex} className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full ${currentColor.bg} ${currentColor.text} text-xs flex items-center justify-center font-bold mt-0.5 mr-3`}>
                          {stepIndex + 1}
                        </div>
                        <span className="text-gray-700 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar/>
    <div className="min-h-screen bg-gray-50">
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Property Guides & Resources
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive guides, checklists, and expert advice for every stage of your property journey. 
              From buying your first home to advanced investment strategies.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">25+</div>
                <div className="text-gray-600 text-sm">Detailed Guides</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600 text-sm">Checklists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-gray-600 text-sm">Expert Tips</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600 text-sm">Updated Resources</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            {/* Buying Guides */}
            <GuideSection 
              title="🏠 Buying Guides" 
              guides={buyingGuides} 
              color="blue"
            />

            {/* Selling Guides */}
            <GuideSection 
              title="💰 Selling Guides" 
              guides={sellingGuides} 
              color="green"
            />

            {/* Legal & Documentation */}
            <GuideSection 
              title="⚖️ Legal & Documentation" 
              guides={legalGuides} 
              color="purple"
            />

            {/* Maintenance & Improvement */}
            <GuideSection 
              title="🔧 Maintenance & Improvement" 
              guides={maintenanceGuides} 
              color="orange"
            />

            {/* Additional Resources */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mt-16">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Need Personalized Guidance?
                </h2>
                <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
                  Our team of property experts is here to provide personalized advice 
                  and answer your specific questions about buying, selling, or investing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    Book Expert Consultation
                  </button>
                  <button className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors duration-200">
                    Download All Guides
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How much should I budget for my first home?
                  </h3>
                  <p className="text-gray-600">
                    Typically, budget 25-30% of your monthly income for housing costs, 
                    including mortgage, insurance, taxes, and maintenance. Save 20% for down payment 
                    and 3-5% for closing costs.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What is the best time to sell a property?
                  </h3>
                  <p className="text-gray-600">
                    Spring and early summer typically see higher buyer activity. However, 
                    local market conditions and your personal timeline are more important 
                    than seasonal trends.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How do I improve my propertys value?
                  </h3>
                  <p className="text-gray-600">
                    Focus on kitchen and bathroom updates, improve curb appeal, 
                    enhance energy efficiency, and ensure all systems are in good working order.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What documents do I need for property purchase?
                  </h3>
                  <p className="text-gray-600">
                    Essential documents include proof of income, tax returns, bank statements, 
                    identification, and for the property itself: title deed, survey plan, 
                    and building approvals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
      <Footer/>
    </>
  );
}