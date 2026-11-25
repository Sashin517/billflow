import Navbar from "@/features/landing/components/Navbar";
import HeroSection from "@/features/landing/components/HeroSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
    </main>
  );
}