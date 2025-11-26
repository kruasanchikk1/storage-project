import { Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-primary">Storage</span>
            </h3>
            <p className="text-muted-foreground">
              Построй свою историю в легендарном мире
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Контакты</h4>
            <div className="space-y-2">
              <a
                href="mailto:info@storage-game.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@storage-game.com
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Discord сообщество
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">О команде</h4>
            <p className="text-muted-foreground text-sm">
              Мы — команда энтузиастов, объединённых любовью к мифам, легендам и интерактивным историям. 
              Наша цель — создать уникальный опыт культурного обмена через игру.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Storage Game. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
