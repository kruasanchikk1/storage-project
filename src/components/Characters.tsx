import character1 from "@/assets/character-1.png";
import character2 from "@/assets/character-2.png";
import character3 from "@/assets/character-3.png";

const characters = [
  {
    image: character1,
    name: "Россия",
    culture: "Россия",
  },
  {
    image: character2,
    name: "Мексика",
    culture: "Мексика",
  },
  {
    image: character3,
    name: "ЮАР",
    culture: "ЮАР",
  },
];

const Characters = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Уникальные <span className="text-primary">персонажи</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите персонажа для зачитывания истории как участник или зритель рассказа
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {characters.map((character, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-card to-background">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-contain object-bottom group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              </div>
              
              <div className="p-6 space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-2">
                  {character.culture}
                </div>
                <h3 className="text-2xl font-bold">{character.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Characters;
