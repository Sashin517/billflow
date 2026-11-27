import Navbar from "@/features/landing/components/Navbar";
import HeroSection from "@/features/landing/components/HeroSection";
import FeaturesSection from "@/features/landing/components/FeaturesSection";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}