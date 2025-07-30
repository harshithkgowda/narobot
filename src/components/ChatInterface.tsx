import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageCircle, 
  Home,
  UserCircle,
  Mic,
  Settings,
  History,
  Star,
  Trash2,
  Plus,
  Search,
  Globe,
  Volume2,
  VolumeX,
  Palette,
  Brain,
  Zap,
  Languages,
  Headphones,
  Eye,
  Moon,
  Sun,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Share,
  Menu,
  X,
  Bookmark,
  Download,
  Upload,
  Camera,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Filter,
  Sparkles,
  CreditCard,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { ChatMessage } from '../types';
import { SlideshowViewer } from './SlideshowViewer';
import { LanguageSelector } from './LanguageSelector';
import { VoiceSettings } from './VoiceSettings';
import { ThemeCustomizer } from './ThemeCustomizer';
import { SmartSuggestions } from './SmartSuggestions';
import { ConversationAnalytics } from './ConversationAnalytics';
import { SubscriptionPlans } from './SubscriptionPlans';
import { DocumentationPage } from './DocumentationPage';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [conversations, setConversations] = useState([
    { id: 1, title: 'How to repair a bike', timestamp: '2 hours ago', starred: true, language: 'en' },
    { id: 2, title: 'Car maintenance tips', timestamp: '1 day ago', starred: false, language: 'es' },
    { id: 3, title: 'Computer troubleshooting', timestamp: '3 days ago', starred: false, language: 'fr' },
    { id: 4, title: 'Cooking pasta recipe', timestamp: '1 week ago', starred: true, language: 'de' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [customTheme, setCustomTheme] = useState({
    primary: '#3b82f6',
    secondary: '#1e40af',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  // Language translations
  const translations = {
    en: {
      welcome: 'Welcome to Narobot',
      subtitle: 'Get intelligent assistance for your work, research, and creative projects. Ask questions, analyze data, or brainstorm ideas.',
      askAnything: 'Ask me anything... (Press Enter to send)',
      newConversation: 'New Conversation',
      conversations: 'Conversations',
      aiAssistant: 'AI Assistant',
      archive: 'Archive',
      settings: 'Settings',
      subscription: 'Subscription',
      documentation: 'Documentation',
      recentConversations: 'Recent Conversations',
      searchConversations: 'Search conversations...',
      thinking: 'Thinking',
      poweredBy: 'Powered by Gemini 1.5 Flash',
      dataAnalysis: 'Data Analysis',
      businessStrategy: 'Business Strategy',
      analyzeData: 'Analyze this data for insights',
      writeReport: 'Help me write a professional report',
      brainstormSolutions: 'Brainstorm solutions for this problem',
      explainConcept: 'Explain this concept in detail'
    },
    es: {
      welcome: 'Bienvenido a Narobot',
      subtitle: 'Obtén asistencia inteligente para tu trabajo, investigación y proyectos creativos. Haz preguntas, analiza datos o genera ideas.',
      askAnything: 'Pregúntame cualquier cosa... (Presiona Enter para enviar)',
      newConversation: 'Nueva Conversación',
      conversations: 'Conversaciones',
      aiAssistant: 'Asistente IA',
      archive: 'Archivo',
      settings: 'Configuración',
      subscription: 'Suscripción',
      documentation: 'Documentación',
      recentConversations: 'Conversaciones Recientes',
      searchConversations: 'Buscar conversaciones...',
      thinking: 'Pensando',
      poweredBy: 'Impulsado por Gemini 1.5 Flash',
      dataAnalysis: 'Análisis de Datos',
      businessStrategy: 'Estrategia Empresarial',
      analyzeData: 'Analizar estos datos para obtener información',
      writeReport: 'Ayúdame a escribir un informe profesional',
      brainstormSolutions: 'Generar soluciones para este problema',
      explainConcept: 'Explicar este concepto en detalle'
    },
    fr: {
      welcome: 'Bienvenue sur Narobot',
      subtitle: 'Obtenez une assistance intelligente pour votre travail, vos recherches et vos projets créatifs. Posez des questions, analysez des données ou générez des idées.',
      askAnything: 'Demandez-moi n\'importe quoi... (Appuyez sur Entrée pour envoyer)',
      newConversation: 'Nouvelle Conversation',
      conversations: 'Conversations',
      aiAssistant: 'Assistant IA',
      archive: 'Archive',
      settings: 'Paramètres',
      subscription: 'Abonnement',
      documentation: 'Documentation',
      recentConversations: 'Conversations Récentes',
      searchConversations: 'Rechercher des conversations...',
      thinking: 'Réflexion',
      poweredBy: 'Alimenté par Gemini 1.5 Flash',
      dataAnalysis: 'Analyse de Données',
      businessStrategy: 'Stratégie d\'Entreprise',
      analyzeData: 'Analyser ces données pour des insights',
      writeReport: 'Aidez-moi à rédiger un rapport professionnel',
      brainstormSolutions: 'Générer des solutions pour ce problème',
      explainConcept: 'Expliquer ce concept en détail'
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  // Apply custom theme to document root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', customTheme.primary);
    root.style.setProperty('--color-secondary', customTheme.secondary);
    root.style.setProperty('--color-accent', customTheme.accent);
    root.style.setProperty('--color-background', customTheme.background);
    root.style.setProperty('--color-surface', customTheme.surface);
  }, [customTheme]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = selectedLanguage;

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [selectedLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const toggleConversationStar = (id: number) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, starred: !conv.starred } : conv
      )
    );
  };

  const deleteConversation = (id: number) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const exportConversation = () => {
    const conversationData = {
      messages,
      timestamp: new Date().toISOString(),
      language: selectedLanguage
    };
    const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narobot-conversation-${Date.now()}.json`;
    a.click();
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || conv.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  const suggestionCards = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: t.dataAnalysis,
      description: t.analyzeData,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: t.businessStrategy,
      description: t.writeReport,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Creative Ideas',
      description: t.brainstormSolutions,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: 'Learning',
      description: t.explainConcept,
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className={`h-screen flex transition-colors duration-300`} style={{ 
      backgroundColor: darkMode ? '#111827' : customTheme.background,
      color: darkMode ? '#ffffff' : '#111827'
    }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r`} style={{
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        backgroundColor: darkMode ? '#1f2937' : customTheme.surface
      }}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: customTheme.primary }}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Narobot</h1>
                <p className="text-xs opacity-60">AI Assistant</p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2 text-white"
              style={{ backgroundColor: customTheme.primary }}
            >
              <Plus className="w-4 h-4" />
              {t.newConversation}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60" />
              <input
                type="text"
                placeholder={t.searchConversations}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: darkMode ? '#374151' : '#d1d5db',
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  focusRingColor: customTheme.primary
                }}
              />
            </div>
            
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: darkMode ? '#374151' : '#d1d5db',
                backgroundColor: darkMode ? '#374151' : '#ffffff'
              }}
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors">
              <Home className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{t.conversations}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full opacity-60" style={{ backgroundColor: darkMode ? '#374151' : '#e5e7eb' }}>
                {conversations.length}
              </span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors">
              <Bot className="w-4 h-4" />
              <span className="text-sm">{t.aiAssistant}</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors">
              <FileText className="w-4 h-4" />
              <span className="text-sm">{t.archive}</span>
            </div>
            <div 
              onClick={() => setShowSubscription(true)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">{t.subscription}</span>
              <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: currentPlan === 'free' ? '#ef4444' : '#10b981' }}>
                {currentPlan.toUpperCase()}
              </span>
            </div>
            <div 
              onClick={() => setShowDocumentation(true)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{t.documentation}</span>
            </div>
            <div 
              onClick={() => setShowAnalytics(true)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Analytics</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm">{t.settings}</span>
            </div>
          </nav>

          {/* Recent Conversations */}
          <div className="flex-1 overflow-y-auto px-4 mt-6">
            <h3 className="text-xs font-medium opacity-60 uppercase tracking-wider mb-3">
              {t.recentConversations}
            </h3>
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <div key={conv.id} className="group flex items-start gap-3 p-3 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg cursor-pointer transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs opacity-60 mt-1">
                      {conv.timestamp} • {conv.language.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleConversationStar(conv.id);
                      }}
                      className={`p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${
                        conv.starred ? 'text-yellow-500' : 'opacity-60'
                      }`}
                    >
                      <Star className="w-3 h-3" fill={conv.starred ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 opacity-60 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b px-4 py-3" style={{
          borderColor: darkMode ? '#374151' : '#e5e7eb',
          backgroundColor: darkMode ? '#1f2937' : customTheme.surface
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: customTheme.primary }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold">Narobot</h1>
                  <p className="text-xs opacity-60 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {t.poweredBy}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLanguageSelector(true)}
                className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
                title="Language Settings"
              >
                <Languages className="w-5 h-5 opacity-60" />
              </button>
              <button
                onClick={() => setShowVoiceSettings(true)}
                className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
                title="Voice Settings"
              >
                <Headphones className="w-5 h-5 opacity-60" />
              </button>
              <button
                onClick={() => setShowThemeCustomizer(true)}
                className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
                title="Theme Customizer"
              >
                <Palette className="w-5 h-5 opacity-60" />
              </button>
              <button
                onClick={exportConversation}
                className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
                title="Export Conversation"
              >
                <Download className="w-5 h-5 opacity-60" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5 opacity-60" /> : <Moon className="w-5 h-5 opacity-60" />}
              </button>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-6 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style={{ backgroundColor: customTheme.primary }}>
                <Bot className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">
                {t.welcome}
              </h1>
              
              <p className="text-lg opacity-70 mb-8 max-w-2xl leading-relaxed">
                {t.subtitle}
              </p>

              {/* Smart Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-8">
                {suggestionCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(card.description)}
                    className={`p-6 rounded-xl bg-gradient-to-br ${card.gradient} text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-left group`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {card.icon}
                      <h3 className="font-semibold">{card.title}</h3>
                    </div>
                    <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                      {card.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="group">
                  <div className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.type === 'user' ? (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: customTheme.primary }}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: customTheme.primary }}>
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">
                          {message.type === 'user' ? 'You' : 'Narobot'}
                        </span>
                        <span className="text-xs opacity-60">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className={`${
                        message.type === 'user' 
                          ? 'text-white ml-auto max-w-fit px-4 py-3 rounded-2xl rounded-tr-md' 
                          : ''
                      }`} style={message.type === 'user' ? { backgroundColor: customTheme.primary } : {}}>
                        {message.content}
                      </div>
                      
                      {/* Message Actions */}
                      {message.type === 'bot' && (
                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="p-1.5 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors"
                            title="Copy"
                          >
                            <Copy className="w-4 h-4 opacity-60" />
                          </button>
                          <button className="p-1.5 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors" title="Like">
                            <ThumbsUp className="w-4 h-4 opacity-60" />
                          </button>
                          <button className="p-1.5 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors" title="Dislike">
                            <ThumbsDown className="w-4 h-4 opacity-60" />
                          </button>
                          <button className="p-1.5 hover:bg-opacity-10 hover:bg-gray-500 rounded-lg transition-colors" title="Regenerate">
                            <RotateCcw className="w-4 h-4 opacity-60" />
                          </button>
                        </div>
                      )}
                      
                      {message.slideshow && message.slideshow.length > 0 && (
                        <div className="mt-6">
                          <SlideshowViewer slides={message.slideshow} autoStart={true} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: customTheme.primary }}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Narobot</span>
                      <span className="text-xs opacity-60">now</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-70">
                      <span>{t.thinking}</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-75"></div>
                        <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4" style={{
          borderColor: darkMode ? '#374151' : '#e5e7eb',
          backgroundColor: darkMode ? '#1f2937' : customTheme.surface
        }}>
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end gap-3 rounded-2xl border focus-within:ring-2 transition-all" style={{
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                borderColor: darkMode ? '#4b5563' : '#d1d5db',
                focusWithinRingColor: customTheme.primary
              }}>
                <div className="flex-1 min-h-[44px] max-h-32">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.askAnything}
                    className="w-full bg-transparent border-none outline-none px-4 py-3 placeholder-opacity-60 resize-none"
                    rows={1}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-2 p-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-opacity-20 hover:bg-gray-500 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Camera className="w-5 h-5 opacity-60" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white' 
                        : 'hover:bg-opacity-20 hover:bg-gray-500 opacity-60'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="text-white p-2 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: customTheme.primary }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            <div className="text-center mt-3">
              <p className="text-xs opacity-60 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                {t.poweredBy}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLanguageSelector && (
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onClose={() => setShowLanguageSelector(false)}
        />
      )}

      {showVoiceSettings && (
        <VoiceSettings
          voiceEnabled={voiceEnabled}
          voiceSpeed={voiceSpeed}
          selectedVoice={selectedVoice}
          onVoiceEnabledChange={setVoiceEnabled}
          onVoiceSpeedChange={setVoiceSpeed}
          onVoiceChange={setSelectedVoice}
          onClose={() => setShowVoiceSettings(false)}
        />
      )}

      {showThemeCustomizer && (
        <ThemeCustomizer
          theme={customTheme}
          onThemeChange={setCustomTheme}
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}

      {showAnalytics && (
        <ConversationAnalytics
          messages={messages}
          conversations={conversations}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showSubscription && (
        <SubscriptionPlans
          currentPlan={currentPlan}
          onPlanChange={setCurrentPlan}
          onClose={() => setShowSubscription(false)}
        />
      )}

      {showDocumentation && (
        <DocumentationPage
          onClose={() => setShowDocumentation(false)}
        />
      )}
    </div>
  );
};