import Hero from "@/components/Hero";
import About from "@/components/About";
import HowToPlay from "@/components/HowToPlay";
import Characters from "@/components/Characters";
import WhyPlay from "@/components/WhyPlay";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <HowToPlay />
      <Characters />
      <WhyPlay />
      <Footer />
    </div>
  );
};

export default Index;
