import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Strategies from "@/components/Strategies";
import AdaptationPreview from "@/components/AdaptationPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Strategies />
      <AdaptationPreview />
      <Footer />
    </div>
  );
};

export default Index;
