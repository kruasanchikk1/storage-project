import { Sparkles, Users, BookOpen } from "lucide-react";

const About = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            О игре <span className="text-primary">Storage</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Storage — это уникальная мультиплеерная игра, где каждое решение влияет на ход истории. 
            Погрузитесь в мир легенд и мифов разных культур, выбирайте роль персонажа и вместе 
            с другими игроками создавайте незабываемые приключения через голосовой чат.
          </p>

          <div className="grid md:grid-cols-3 gap-8 pt-8">
            <div className="space-y-4 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Branching Narrative</h3>
              <p className="text-muted-foreground">
                Ваши выборы определяют развитие сюжета и приводят к различным концовкам
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Кооперативное прохождение</h3>
              <p className="text-muted-foreground">
                Работайте в команде, общайтесь голосом и решайте задачи вместе
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Мифы и легенды</h3>
              <p className="text-muted-foreground">
                Исследуйте богатую культуру разных народов через интерактивные истории
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
