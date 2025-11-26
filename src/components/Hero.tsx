import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";
import charactersGroup from "@/assets/characters-group.jpg";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Mythical landscape"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-bg via-transparent to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_50%)] animate-glow-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-primary">Построй свою историю</span>
            <br />
            <span className="text-foreground">в легендарном мире</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Играйте за уникальных персонажей, исследуйте мифы и создавайте свою неповторимую концовку
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button variant="hero" size="lg" className="text-lg px-10 py-6 h-auto" asChild>
              <Link to="/play">
                Попробовать сейчас
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>

          {/* Characters Preview */}
          <div className="mt-12 animate-float">
            <img
              src={charactersGroup}
              alt="Storage game characters"
              className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-glow-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
