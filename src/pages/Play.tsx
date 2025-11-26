import heroBackground from "@/assets/hero-background.jpg";
import characterOne from "@/assets/character-1.png";
import characterTwo from "@/assets/character-2.png";
import characterThree from "@/assets/character-3.png";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  Globe,
  Languages,
  Loader2,
  MessageSquare,
  Mic,
  MicOff,
  Sparkles,
  Users,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

type CharacterCard = {
  id: string;
  name: string;
  image: string;
};

type Session = {
  id: string;
  legendId: string;
  legendName: string;
  players: number;
  capacity: number;
  status: "open" | "in-progress";
};

type StoryOption = {
  id: string;
  label: string;
  description: string;
  next: string;
  progressDelta: number;
};

type StoryNode = {
  id: string;
  text: string;
  requiresExchange?: boolean;
  options: StoryOption[];
};

type ChatMessage = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
};

const characters: CharacterCard[] = [
  {
    id: "narrator-1",
    name: "Россия",
    image: characterOne,
  },
  {
    id: "narrator-2",
    name: "Мексика",
    image: characterTwo,
  },
  {
    id: "narrator-3",
    name: "ЮАР",
    image: characterThree,
  },
];

const legendCatalog = [
  { id: "yakutia-chingis", name: "РФ - Якутия - Легенда о Чынгыс Хане и Ледяном Великане" },
  { id: "dagestan-eagle", name: "РФ - Дагестан - Легенда о Горном Орле и Драгоценном камне" },
  { id: "karelia-vainamoinen", name: "РФ - Карелия - Легенда о Вяйнямёйнене и Сампо" },
  { id: "uzbekistan-nasreddin", name: "Узбекистан - Легенда о Ходже Насреддине и Волшебном Ишачке" },
  { id: "tajikistan-rudaki", name: "Таджикистан - Легенда о Рудаки и Потерянной Поэме" },
];

const initialSessions: Session[] = [
  {
    id: "session-alpha",
    legendId: "yakutia-chingis",
    legendName: "РФ - Якутия - Легенда о Чынгыс Хане и Ледяном Великане",
    players: 1,
    capacity: 2,
    status: "open",
  },
  {
    id: "session-beta",
    legendId: "dagestan-eagle",
    legendName: "РФ - Дагестан - Легенда о Горном Орле и Драгоценном камне",
    players: 2,
    capacity: 2,
    status: "in-progress",
  },
];

const storyNodes: Record<string, StoryNode> = {
  dawn: {
    id: "dawn",
    requiresExchange: true,
    text: "Лес шепчет глухим эхом. Два луча луны падают на рунический круг, приглашая к совместному решению.",
    options: [
      {
        id: "trace",
        label: "Сканировать поле рун",
        description: "Найти слабую точку завесы и безопасно войти.",
        next: "roots",
        progressDelta: 20,
      },
      {
        id: "breach",
        label: "Прорыв силой",
        description: "Задействовать тотемы титана и растолкать ветви.",
        next: "river",
        progressDelta: 25,
      },
    ],
  },
  roots: {
    id: "roots",
    text: "Под корнями спрятан архив духов. Они соглашаются вести вас дальше, если голоса команды звучат в унисон.",
    options: [
      {
        id: "archive",
        label: "Запросить хроники",
        description: "Узнать о слабостях грядущего стража.",
        next: "grove",
        progressDelta: 20,
      },
      {
        id: "gift",
        label: "Принести подношение",
        description: "Пожертвовать часть энергии ради благословения.",
        next: "grove",
        progressDelta: 15,
      },
    ],
  },
  river: {
    id: "river",
    requiresExchange: true,
    text: "Река из света бурлит голосами. Течением управляют моменты обмена — синхронизируйте решения.",
    options: [
      {
        id: "tune",
        label: "Настроиться на поток",
        description: "Слушать шёпот воды и плыть вместе.",
        next: "grove",
        progressDelta: 25,
      },
      {
        id: "split",
        label: "Разделиться",
        description: "Отправить одного вперёд, другого в обход.",
        next: "grove",
        progressDelta: 10,
      },
    ],
  },
  grove: {
    id: "grove",
    text: "Вы достигли Сердца Легенды. Лес затихает, руны светятся мягким светом. Страж склоняет голову в знак уважения к вашему совместному путешествию.",
    options: [
      {
        id: "seal",
        label: "Завершить легенду",
        description: "Стабилизировать лес и зафиксировать исход вашего приключения.",
        next: "ending",
        progressDelta: 35,
      },
      {
        id: "extend",
        label: "Продолжить исследование",
        description: "Открыть новую ветвь истории, вернуться к началу приключения.",
        next: "dawn",
        progressDelta: 15,
      },
    ],
  },
  ending: {
    id: "ending",
    text: "Легенда завершена. Лес благословляет вас за совместное прохождение. Вы преодолели все испытания вместе, и теперь эта история навсегда останется в вашей памяти.",
    options: [],
  },
};

const trackEvent = (name: string, payload?: Record<string, unknown>) => {
  console.info(`[analytics] ${name}`, payload);
};

const useTypewriter = (text: string, speed = 28) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text || text.length === 0) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        const char = text.charAt(i);
        setDisplayed((prev) => {
          const newText = prev + char;
          return newText;
        });
        i += 1;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
};

const mockSupabase = {
  async createSession(session: Omit<Session, "id" | "players" | "status">) {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return {
      id: `session-${Math.random().toString(36).slice(2, 7)}`,
      players: 1,
      status: "open" as const,
      ...session,
    };
  },
  async joinSession(sessionId: string) {
    await new Promise((resolve) => setTimeout(resolve, 320));
    return { sessionId };
  },
};

const Play = () => {
  const { toast } = useToast();
  const [guestName, setGuestName] = useState(
    () => `Гость-${Math.floor(Math.random() * 900 + 100)}`
  );
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterCard | null>(
    null
  );
  const [sessions, setSessions] = useState(initialSessions);
  const [creating, setCreating] = useState(false);
  const [newLegendId, setNewLegendId] = useState(legendCatalog[0].id);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<keyof typeof storyNodes>("dawn");
  const [progress, setProgress] = useState(15);
  const [exchangeTimeLeft, setExchangeTimeLeft] = useState(0);
  const [voiceConnected, setVoiceConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [dispute, setDispute] = useState<{
    active: boolean;
    timer: number;
    playerChoice?: StoryOption;
    teammateChoice?: StoryOption;
  }>({ active: false, timer: 0 });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      author: "Система",
      content: "Добро пожаловать в легенду Storage. Дождитесь напарника.",
      timestamp: "00:00",
    },
  ]);
  const [chatDraft, setChatDraft] = useState("");
  const [translatorEnabled, setTranslatorEnabled] = useState(false);
  const [currentSubtitles, setCurrentSubtitles] = useState("");
  const [showResults, setShowResults] = useState(false);

  const currentNode = storyNodes[currentNodeId];
  const typedText = useTypewriter(currentNode.text);

  useEffect(() => {
    let robotsTag = document.querySelector<HTMLMetaElement>('meta[name="robots"][data-storage-play="true"]');
    if (!robotsTag) {
      robotsTag = document.createElement("meta");
      robotsTag.name = "robots";
      robotsTag.dataset.storagePlay = "true";
      document.head.appendChild(robotsTag);
    }
    robotsTag.content = "noindex, nofollow";
    return () => {
      if (robotsTag?.parentElement) {
        document.head.removeChild(robotsTag);
      }
    };
  }, []);


  useEffect(() => {
    if (storyNodes[currentNodeId].requiresExchange) {
      setExchangeTimeLeft(15);
    } else {
      setExchangeTimeLeft(0);
    }
  }, [currentNodeId]);

  useEffect(() => {
    if (exchangeTimeLeft <= 0) {
      setCurrentSubtitles("");
      return;
    }
    const interval = setInterval(() => {
      setExchangeTimeLeft((prev) => Math.max(prev - 1, 0));
      // Симуляция субтитров при разговоре
      if (translatorEnabled && voiceConnected && micEnabled && Math.random() > 0.6) {
        setCurrentSubtitles("Вы говорите: 'Давайте выберем этот вариант вместе.'");
      } else {
        setCurrentSubtitles("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [exchangeTimeLeft, translatorEnabled, voiceConnected, micEnabled]);

  useEffect(() => {
    if (!dispute.active || dispute.timer <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setDispute((prev) => ({
        ...prev,
        timer: Math.max(prev.timer - 1, 0),
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [dispute.active, dispute.timer]);

  const advanceStory = useCallback((option: StoryOption) => {
    if (option.next === "ending") {
      setShowResults(true);
    }
    setCurrentNodeId(option.next as keyof typeof storyNodes);
    setProgress((prev) => Math.min(prev + option.progressDelta, 100));
    trackEvent("advance_story", { optionId: option.id, nextNode: option.next });
  }, []);

  const resolveDispute = useCallback(
    (preferred?: "player" | "teammate") => {
      setDispute((prev) => {
        const winner =
          preferred === "player"
            ? prev.playerChoice
            : preferred === "teammate"
            ? prev.teammateChoice
            : Math.random() > 0.5
            ? prev.playerChoice
            : prev.teammateChoice;
        if (winner) {
          advanceStory(winner);
        }
        return { active: false, timer: 0 };
      });
    },
    [advanceStory]
  );

  useEffect(() => {
    if (dispute.active && dispute.timer === 0) {
      resolveDispute();
    }
  }, [dispute.active, dispute.timer, resolveDispute]);

  const handleCharacterSelect = (card: CharacterCard) => {
    setSelectedCharacter(card);
    trackEvent("select_character", { hero: card.id });
  };

  const handleCreateSession = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const legend = legendCatalog.find((item) => item.id === newLegendId);
      if (!legend) {
        throw new Error("Легенда не найдена");
      }
      const created = await mockSupabase.createSession({
        legendId: legend.id,
        legendName: legend.name,
        capacity: 2,
      });
      setSessions((prev) => [created, ...prev]);
      setActiveSessionId(created.id);
      trackEvent("create_session", { legendId: legend.id, capacity: 2 });
      toast({
        title: "Сессия создана",
        description: `Легенда: ${legend.name}`,
      });
    } catch (error) {
      toast({
        title: "Не удалось создать сессию",
        description: error instanceof Error ? error.message : "Попробуйте ещё раз",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;
    if (!selectedCharacter) {
      toast({
        title: "Выберите персонажа",
        description: "Нужно выбрать героя прежде чем присоединяться.",
      });
      return;
    }
    if (session.players >= session.capacity) {
      toast({
        title: "Сессия заполнена",
        description: "Выберите другую легенду или создайте новую.",
        variant: "destructive",
      });
      return;
    }
    await mockSupabase.joinSession(sessionId);
    setSessions((prev) =>
      prev.map((item) =>
        item.id === sessionId
          ? { ...item, players: Math.min(item.players + 1, item.capacity) }
          : item
      )
    );
    setActiveSessionId(sessionId);
    trackEvent("join_session", { sessionId, hero: selectedCharacter.id });
    appendChatMessage("Система", `${guestName} вошёл в сессию ${session.legendName}`);
  };

  const appendChatMessage = (author: string, content: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        author,
        content,
        timestamp: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!chatDraft.trim()) return;
    const message = chatDraft.trim();
    appendChatMessage(guestName, message);
    if (translatorEnabled) {
      // Симуляция перевода сообщения
      setTimeout(() => {
        appendChatMessage("Переводчик", `[Переведено] ${message}`);
      }, 500);
    }
    setChatDraft("");
  };

  const simulateTeammateChoice = (options: StoryOption[], playerChoice: StoryOption) => {
    if (!options.length) return playerChoice;
    const disagree = Math.random() > 0.6;
    if (!disagree) return playerChoice;
    const alternatives = options.filter((opt) => opt.id !== playerChoice.id);
    return alternatives[Math.floor(Math.random() * alternatives.length)] ?? playerChoice;
  };

  const handleOptionSelect = (option: StoryOption) => {
    if (dispute.active) return;
    const teammateChoice = simulateTeammateChoice(currentNode.options, option);
    if (teammateChoice.id !== option.id) {
      setDispute({
        active: true,
        timer: 5,
        playerChoice: option,
        teammateChoice,
      });
      trackEvent("disagreement", {
        chosen: option.id,
        teammate: teammateChoice.id,
      });
      return;
    }
    advanceStory(option);
  };

  const handleNewStory = () => {
    setShowResults(false);
    setCurrentNodeId("dawn");
    setProgress(15);
    setActiveSessionId(null);
    trackEvent("start_new_story");
  };

  const handleReplayQuest = () => {
    setShowResults(false);
    setCurrentNodeId("dawn");
    setProgress(15);
    trackEvent("replay_quest", { legendId: activeSession?.legendId });
  };

  const activeSession = sessions.find((session) => session.id === activeSessionId);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(31,203,195,0.08), rgba(39,49,138,0.5)), url(${heroBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className="min-h-screen bg-[#050918] text-white"
      style={backgroundStyle}
    >
      <div className="min-h-screen backdrop-blur-xl bg-black/60">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="rounded-full bg-[#1FCBC3]/10 p-1.5 sm:p-2">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-[#1FCBC3]" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60">
                  Storage
                </p>
                <p className="text-base sm:text-xl font-semibold">Интерактивная легенда</p>
              </div>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 sm:px-4 py-1.5 sm:py-2">
              <p className="text-[10px] sm:text-xs text-white/60">Гостевой ник</p>
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="bg-transparent font-semibold outline-none text-sm sm:text-base w-full sm:w-auto"
              />
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 transition hover:text-white">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Вернуться на лендинг</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8 lg:gap-10 px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#11183b]/90 to-[#051b1d]/90 p-4 sm:p-6 shadow-2xl shadow-[#1FCBC3]/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold uppercase tracking-widest text-[#1FCBC3]">
                  Выбор персонажа
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Персонаж нужен для зачитывания истории как участник/зритель рассказа
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {characters.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCharacterSelect(card)}
                  className={cn(
                    "group rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 transition hover:border-[#1FCBC3]/60 hover:bg-[#1FCBC3]/5 text-left",
                    selectedCharacter?.id === card.id && "border-[#1FCBC3] bg-[#1FCBC3]/10"
                  )}
                >
                  <div className="aspect-video overflow-hidden rounded-xl bg-black/30">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <h3 className="text-base sm:text-lg font-bold">{card.name}</h3>
                    {selectedCharacter?.id === card.id && (
                      <p className="text-xs sm:text-sm text-[#1FCBC3] mt-1">Выбран</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#0b132d]/90 p-4 sm:p-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold uppercase tracking-widest text-[#1FCBC3]">
                    Лобби легенд
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">
                    Доступные сессии обновляются в реальном времени (2 игрока)
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <select
                    value={newLegendId}
                    onChange={(event) => setNewLegendId(event.target.value)}
                    className="flex-1 sm:flex-none sm:min-w-[200px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  >
                    {legendCatalog.map((legend) => (
                      <option key={legend.id} value={legend.id} className="bg-[#0b132d] text-white">
                        {legend.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleCreateSession}
                    disabled={creating}
                    className="bg-[#1FCBC3] text-[#03191a] transition hover:bg-[#27318A] whitespace-nowrap"
                  >
                    {creating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Создать сессию"
                    )}
                  </Button>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold break-words">{session.legendName}</p>
                      <p className="text-xs uppercase tracking-widest text-white/50 mt-1">
                        {session.status === "open" ? "Открыта" : "В процессе"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-[#1FCBC3] flex-shrink-0" />
                        <span>{session.players}/{session.capacity}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleJoinSession(session.id)}
                        disabled={session.status !== "open"}
                        className={cn(
                          "border-[#1FCBC3]/60 text-[#1FCBC3] hover:bg-[#1FCBC3]/10 whitespace-nowrap",
                          session.status !== "open" && "opacity-50"
                        )}
                      >
                        Присоединиться
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#041f21]/90 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-[#1FCBC3]">Голосовой чат</h3>
                  <button
                    onClick={() => {
                      setTranslatorEnabled((prev) => !prev);
                      trackEvent("translator_toggle", { enabled: !translatorEnabled });
                    }}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] transition",
                      translatorEnabled
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/10"
                    )}
                    title="Переводчик переводит сообщения и аудио в субтитры"
                  >
                    <Languages className="h-3 w-3" />
                    Переводчик
                  </button>
                </div>
                {exchangeTimeLeft > 0 && (
                  <div className="flex items-center gap-2 rounded-full bg-[#1FCBC3]/10 px-3 py-1 text-xs text-[#1FCBC3] self-start sm:self-auto">
                    <Clock className="h-4 w-4" />
                    Момент обмена: {exchangeTimeLeft}s
                  </div>
                )}
              </div>
              {translatorEnabled && currentSubtitles && exchangeTimeLeft > 0 && (
                <div className="mt-3 rounded-lg border border-green-500/30 bg-green-500/10 p-2">
                  <p className="text-xs text-green-300 break-words">{currentSubtitles}</p>
                </div>
              )}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
                <div>
                  <p className="text-xs uppercase text-white/50">Статус</p>
                  <p className="text-sm sm:text-base font-semibold capitalize">
                    {voiceConnected ? (micEnabled ? "активен" : "микрофон выключен") : "отключен"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setVoiceConnected((prev) => !prev)}
                    variant="outline"
                    size="sm"
                    className="border-[#1FCBC3]/60 text-[#1FCBC3] hover:bg-[#1FCBC3]/10 text-xs sm:text-sm"
                  >
                    {voiceConnected ? "Отключить" : "Подключить"}
                  </Button>
                  <Button
                    onClick={() => setMicEnabled((prev) => !prev)}
                    variant="outline"
                    size="sm"
                    disabled={!voiceConnected}
                    className="border-[#1FCBC3]/60 text-[#1FCBC3] hover:bg-[#1FCBC3]/10 disabled:opacity-40"
                  >
                    {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-white/5 bg-black/20 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{guestName}</p>
                    <p className="text-xs text-white/50">
                      {voiceConnected && micEnabled ? "Говорит" : "Ожидает"}
                    </p>
                  </div>
                  <Volume2
                    className={cn(
                      "h-5 w-5 transition",
                      voiceConnected && micEnabled ? "text-[#1FCBC3]" : "text-white/30"
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-[#040c1a]/90 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#1FCBC3]">
                    Сценарий Storage
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1 break-words">
                    Ветка: {activeSession?.legendName ?? "ожидание выбора"}
                  </p>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[200px]">
                  <p className="text-xs uppercase text-white/50">Прогресс легенды</p>
                  <Progress value={progress} className="mt-2 bg-white/10" />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-[#101b3a] to-[#031b1e] p-4 sm:p-6">
                <p className="text-xs uppercase text-[#1FCBC3]">Текущая сцена</p>
                <div className="mt-3 sm:mt-4 min-h-[60px] sm:min-h-[80px]">
                  <p className="font-mono text-sm sm:text-base lg:text-lg leading-relaxed text-white break-words whitespace-pre-wrap" style={{ textIndent: 0, paddingLeft: 0 }}>
                    <span>{typedText}</span>
                    {typedText.length > 0 && (
                      <span className="ml-1 animate-pulse text-[#1FCBC3] inline-block">▋</span>
                    )}
                  </p>
                </div>
              </div>
              {showResults && currentNodeId === "ending" ? (
                <div className="mt-4 sm:mt-6 rounded-2xl border border-green-400/40 bg-gradient-to-br from-green-500/20 to-[#1FCBC3]/20 p-6 sm:p-8 text-center">
                  <div className="mb-6">
                    <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-[#1FCBC3] mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Поздравляем!
                    </h3>
                    <p className="text-base sm:text-lg text-white/80">
                      Вы успешно прошли легенду!
                    </p>
                    <p className="text-sm text-white/60 mt-2">
                      Прогресс: {progress}%
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button
                      onClick={handleNewStory}
                      className="bg-[#1FCBC3] text-[#03191a] hover:bg-[#27318A] text-base px-6 py-3"
                    >
                      Выбрать новую историю
                    </Button>
                    <Button
                      onClick={handleReplayQuest}
                      variant="outline"
                      className="border-[#1FCBC3]/60 text-[#1FCBC3] hover:bg-[#1FCBC3]/10 text-base px-6 py-3"
                    >
                      Переиграть текущий квест
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {dispute.active && (
                    <div className="mt-4 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold uppercase tracking-wide">
                          Момент спора
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {dispute.timer}s
                        </div>
                      </div>
                      <p className="mt-2 text-white/80">
                        Вы выбрали «{dispute.playerChoice?.label}», напарник склоняется к «
                        {dispute.teammateChoice?.label}».
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveDispute("player")}
                          className="border-[#1FCBC3]/60 text-[#1FCBC3] hover:bg-[#1FCBC3]/10"
                        >
                          Отстоять решение
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveDispute("teammate")}
                          className="border-white/40 text-white/80 hover:bg-white/10"
                        >
                          Уступить
                        </Button>
                      </div>
                    </div>
                  )}
                  {currentNode.options.length > 0 && (
                    <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                      {currentNode.options.map((option, index) => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option)}
                          className={cn(
                            "rounded-2xl border border-[#1FCBC3]/40 bg-[#1FCBC3]/10 p-3 sm:p-4 text-left text-white transition focus:outline-none",
                            "hover:-translate-y-1 hover:bg-[#27318A]/40 hover:shadow-lg hover:shadow-[#1FCBC3]/20 active:scale-95",
                            dispute.active && "pointer-events-none opacity-60"
                          )}
                          style={{ animationDelay: `${index * 80}ms` }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-base sm:text-lg font-semibold break-words">{option.label}</p>
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#1FCBC3] flex-shrink-0" />
                          </div>
                          <p className="mt-2 text-xs sm:text-sm text-white/70 break-words">{option.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-[#1FCBC3]" />
                  <p className="text-sm text-white/70">
                    Варианты действий синхронизируются для двух игроков. При конфликте запускается таймер спора.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <AlertCircle className="h-4 w-4 text-[#1FCBC3]" />
                  Голосовой чат активируется автоматически в «Момент обмена».
                </div>
              </div>
              <div className="mt-4 sm:mt-6 rounded-2xl border border-white/10 bg-black/30 p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase text-white/50">Текстовый чат</p>
                  <button
                    onClick={() => {
                      setTranslatorEnabled((prev) => !prev);
                      trackEvent("translator_toggle", { enabled: !translatorEnabled });
                    }}
                    className={cn(
                      "flex items-center gap-1 text-xs transition",
                      translatorEnabled
                        ? "text-green-400 hover:text-green-300"
                        : "text-[#1FCBC3] hover:text-[#27318A]"
                    )}
                  >
                    <Globe className="h-3 w-3" />
                    {translatorEnabled ? "Переводчик вкл" : "Переводчик выкл"}
                  </button>
                </div>
                <div className="mt-3 h-32 sm:h-40 space-y-2 sm:space-y-3 overflow-y-auto rounded-xl bg-black/40 p-2 sm:p-3">
                  {chatMessages.map((message) => (
                    <div key={message.id}>
                      <p className="text-xs text-white/50 break-words">
                        {message.author} · {message.timestamp}
                      </p>
                      <p className="text-xs sm:text-sm break-words">{message.content}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2 sm:gap-3">
                  <input
                    value={chatDraft}
                    onChange={(event) => setChatDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Напишите сообщение..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-2 sm:px-3 py-2 text-xs sm:text-sm outline-none"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-[#1FCBC3] text-[#03191a] transition hover:bg-[#27318A] whitespace-nowrap text-xs sm:text-sm"
                  >
                    Отправить
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#041f21]/80 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#1FCBC3]">Сводка сессии</h3>
                <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/70">
                  <p className="break-words">
                    Активная легенда: {activeSession?.legendName ?? "не выбрана"}
                  </p>
                  <p>
                    Персонаж:{" "}
                    {selectedCharacter ? (
                      <span className="text-[#1FCBC3]">{selectedCharacter.name}</span>
                    ) : (
                      "не выбран"
                    )}
                  </p>
                  {translatorEnabled && (
                    <p>
                      Переводчик: <span className="text-green-400">активен</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-4 sm:px-6 py-4 sm:py-6 lg:py-8 text-center text-xs sm:text-sm text-white/60">
          Storage · Кооперативные легенды · <Link to="/" className="text-[#1FCBC3] hover:underline">Вернуться</Link>
        </footer>
      </div>
    </div>
  );
};

export default Play;

