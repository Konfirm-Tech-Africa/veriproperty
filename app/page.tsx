import { Navbar } from "@/app/components/navbar";
import Hero from "./components/Hero";
import BottomContainer from "./components/BottomContainer";
import PropertyList from "./components/property/PropertyList";
import Footer from "./components/footer";
import PropertyBannerSlider from "./components/PropertyBannerSlider";
import TestimonialsSection from "./components/property/TestimonialsSection";
import StatsSection from "./components/property/StatsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <Navbar />
      <Hero />
      <PropertyBannerSlider />
      <PropertyList />
      <StatsSection />
      <TestimonialsSection />
      <BottomContainer />
       <Footer />
    </div>
  );
}
