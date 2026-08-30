import { ShieldCheck, Sparkles, Heart } from "lucide-react";

const pillars = [
  {
    title: "Verified Agents",
    description: "Every agent on VeriProperty goes through a verification process before publishing listings.",
    icon: ShieldCheck,
  },
  {
    title: "Powered by Veri",
    description: "Describe what you're looking for in your own words and let Veri recommend suitable properties.",
    icon: Sparkles,
  },
  {
    title: "Built Around Trust",
    description: "Our mission isn't to show you the most properties. It's to help you make better property decisions.",
    icon: Heart,
  },
];

export default function TrustSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Why Choose VeriProperty?
          </h2>
          <p className="text-gray-500 mt-2">The values that set us apart.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {pillars.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-700 mb-4">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 max-w-xs">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
