import { UserCircle, Mic, Target, Users as UsersIcon, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserCircle,
    title: "Выберите персонажа и миф",
    description: "Создайте уникального героя и выберите легенду для исследования",
  },
  {
    icon: Mic,
    title: "Подключите голосовой чат",
    description: "Общайтесь с командой в реальном времени для лучшей координации",
  },
  {
    icon: Target,
    title: "Выполняйте задания",
    description: "Раскрывайте тайны, решайте головоломки и принимайте важные решения",
  },
  {
    icon: UsersIcon,
    title: "Играйте в команде",
    description: "Сотрудничайте с другими игроками для достижения общих целей",
  },
  {
    icon: Trophy,
    title: "Откройте свою концовку",
    description: "Ваш уникальный путь приведёт к одной из множества концовок",
  },
];

const HowToPlay = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Как <span className="text-primary">играть</span>
          </h2>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-6 items-start p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border hover:border-primary transition-all hover:translate-x-2"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary font-bold text-lg">Шаг {index + 1}</span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToPlay;
