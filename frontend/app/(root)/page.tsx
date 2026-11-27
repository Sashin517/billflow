import Navbar from "@/features/landing/components/Navbar";
import HeroSection from "@/features/landing/components/HeroSection";
import FeaturesSection from "@/features/landing/components/FeaturesSection";
import ComplianceSection from "@/features/landing/components/ComplianceSection";
import StatusWorkflowSection from "@/features/landing/components/StatusWorkflowSection";
import CtaSection from "@/features/landing/components/CtaSection";
import Footer from "@/features/landing/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ComplianceSection/>
      <StatusWorkflowSection />
      <CtaSection />
      <Footer />
    </main>
  );
}