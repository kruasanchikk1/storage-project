import { MessageCircle, Globe, Zap, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: MessageCircle,
    title: "Живое общение",
    description: "Голосовой чат создаёт атмосферу настоящего приключения с друзьями",
  },
  {
    icon: Globe,
    title: "Культурный обмен",
    description: "Узнайте о легендах и традициях разных народов мира",
  },
  {
    icon: Zap,
    title: "Захватывающий сюжет",
    description: "Каждая игра уникальна благодаря вашим решениям и взаимодействию",
  },
  {
    icon: Palette,
    title: "Уникальный стиль",
    description: "Яркая стилизованная графика погружает в атмосферу мифов",
  },
];

const WhyPlay = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-space-deep/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Почему стоит <span className="text-primary">играть</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border hover:border-primary transition-all group"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30">
            <h3 className="text-3xl font-bold">Готовы начать своё приключение?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Присоединяйтесь к тысячам игроков, которые уже исследуют легендарные миры
            </p>
            <Button variant="hero" size="lg" className="text-lg px-10 py-6 h-auto" asChild>
              <Link to="/play">
                Попробовать сейчас
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPlay;
