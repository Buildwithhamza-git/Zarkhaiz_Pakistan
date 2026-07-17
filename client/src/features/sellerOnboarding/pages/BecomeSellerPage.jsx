import Navbar from "../../Home/components/Navbar/Navbar";
import BenefitsSection from "../components/BenefitsSection";
import CTASection from "../components/CTASection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Statistics from "../components/Statistics";

export default function BecomeSellerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <HowItWorks />
        <Statistics />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
