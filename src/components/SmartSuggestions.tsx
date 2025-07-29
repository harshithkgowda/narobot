import React from 'react';
import { Lightbulb, TrendingUp, Brain, Target, Zap, BookOpen } from 'lucide-react';

interface SmartSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  language: string;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  onSuggestionClick,
  language
}) => {
  const suggestions = {
    en: [
      {
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Data Analysis',
        description: 'Analyze this data for insights',
        prompt: 'Help me analyze this data and provide actionable insights',
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        icon: <Target className="w-5 h-5" />,
        title: 'Business Strategy',
        description: 'Create a business plan',
        prompt: 'Help me create a comprehensive business strategy',
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Creative Ideas',
        description: 'Brainstorm innovative solutions',
        prompt: 'Help me brainstorm creative solutions for my project',
        gradient: 'from-orange-500 to-red-500'
      },
      {
        icon: <Brain className="w-5 h-5" />,
        title: 'Learning',
        description: 'Explain complex concepts',
        prompt: 'Explain this concept in simple terms with examples',
        gradient: 'from-green-500 to-teal-500'
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: 'Quick Help',
        description: 'Get instant assistance',
        prompt: 'I need quick help with',
        gradient: 'from-yellow-500 to-orange-500'
      },
      {
        icon: <BookOpen className="w-5 h-5" />,
        title: 'Research',
        description: 'Deep dive into topics',
        prompt: 'Help me research and understand',
        gradient: 'from-indigo-500 to-purple-500'
      }
    ],
    es: [
      {
        icon: <TrendingUp className="w-5 h-5" />,
        title: 'Análisis de Datos',
        description: 'Analizar datos para obtener información',
        prompt: 'Ayúdame a analizar estos datos y proporcionar información útil',
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        icon: <Target className="w-5 h-5" />,
        title: 'Estrategia Empresarial',
        description: 'Crear un plan de negocio',
        prompt: 'Ayúdame a crear una estrategia empresarial integral',
        gradient: 'from-purple-500 to-pink-500'
      }
    ]
  };

  const currentSuggestions = suggestions[language as keyof typeof suggestions] || suggestions.en;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
      {currentSuggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion.prompt)}
          className={`p-6 rounded-xl bg-gradient-to-br ${suggestion.gradient} text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-left group`}
        >
          <div className="flex items-center gap-3 mb-3">
            {suggestion.icon}
            <h3 className="font-semibold">{suggestion.title}</h3>
          </div>
          <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
            {suggestion.description}
          </p>
        </button>
      ))}
    </div>
  );
};