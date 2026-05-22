export default function MorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              More Services
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Additional tools and resources to help with your property journey
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Agent
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg text-left">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Login to AgentNet
                    </h4>
                    <p className="text-gray-600">
                      Access your agent dashboard and tools
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-left">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Agent Offering
                    </h4>
                    <p className="text-gray-600">
                      Explore our services for property agents
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Commercial Properties
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg text-left">
                    <h4 className="font-medium text-gray-900 mb-2">
                      CommercialGuru
                    </h4>
                    <p className="text-gray-600">
                      Find office spaces, retail units, and commercial
                      properties
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                  <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-2">🏢</div>
                      <p className="text-sm">Commercial Properties</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Help Resources
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg text-left">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Find an Agent
                    </h4>
                    <p className="text-gray-600">
                      Connect with qualified property agents
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-left">
                    <h4 className="font-medium text-gray-900 mb-2">AskGuru</h4>
                    <p className="text-gray-600">
                      Get answers to your property questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
