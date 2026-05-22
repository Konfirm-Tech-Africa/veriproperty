export default function NewProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              New Projects
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover the latest property developments and upcoming launches
            </p>

            <div className="bg-gray-800 text-white p-4 rounded-lg mb-8">
              <h2 className="text-lg font-semibold">New Property Launches</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Projects by Completion
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg text-left">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Upcoming Projects
                    </h4>
                    <p className="text-gray-600">
                      Browse new developments launching soon
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-left">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Completed Projects
                    </h4>
                    <p className="text-gray-600">
                      Explore recently completed developments
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Featured Projects
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Premium Developments
                    </h4>
                    <p className="text-gray-600">
                      Luxury condominiums and exclusive properties
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Affordable Housing
                    </h4>
                    <p className="text-gray-600">
                      Budget-friendly new launches and BTO projects
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
