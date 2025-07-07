import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageCircle, 
  Plus, 
  Settings, 
  Archive, 
  MoreHorizontal, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  RotateCcw, 
  Share, 
  Paperclip, 
  Mic,
  Home,
  ChevronLeft,
  Moon,
  Sun
} from 'lucide-react';
import { ChatMessage } from '../types';
import { SlideshowViewer } from './SlideshowViewer';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const suggestedPrompts = [
    {
      icon: "📊",
      text: "Data Analysis",
      description: "Analyze this data for insights"
    },
    {
      icon: "💼",
      text: "Business Strategy", 
      description: "Help me write a professional report"
    },
    {
      icon: "💡",
      text: "Creative Ideas",
      description: "Brainstorm solutions for this problem"
    },
    {
      icon: "📚",
      text: "Learning",
      description: "Explain this concept in detail"
    }
  ];

  const recentConversations = [
    {
      title: "Project Requirements Analysis",
      subtitle: "Let's analyze the technical requirements...",
      time: "2 min ago",
      starred: true
    },
    {
      title: "Code Review Discussion", 
      subtitle: "The implementation looks solid, but...",
      time: "1 hour ago",
      starred: false
    }
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-full w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Sidebar */}
        <div className={`sidebar-container ${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0`}>
          <div className="h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Narobot</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AI Assistant</p>
                </div>
              </div>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg text-white dark:text-black text-sm font-medium transition-all duration-200 hover:scale-[1.02]">
                <Plus className="w-4 h-4" />
                New Conversation
              </button>
            </div>

            {/* Navigation */}
            <div className="p-4 space-y-2">
              <div className="nav-item active">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <div className="nav-item">
                <MessageCircle className="w-4 h-4" />
                <span>Conversations</span>
                <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">12</span>
              </div>
              <div className="nav-item">
                <Bot className="w-4 h-4" />
                <span>AI Assistant</span>
              </div>
              <div className="nav-item">
                <Archive className="w-4 h-4" />
                <span>Archive</span>
              </div>
              <div className="nav-item">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Recent Conversations</h3>
                <div className="space-y-2">
                  {recentConversations.map((conv, index) => (
                    <div key={index} className="conversation-item group">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {conv.starred && <span className="text-yellow-500">⭐</span>}
                            <h4 className="text-sm font-medium truncate">{conv.title}</h4>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">{conv.subtitle}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{conv.time}</p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="header-bar">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">Narobot</h1>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">⚡ Powered by Gemini 1.5 Flash</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="icon-button"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button className="icon-button">
                  <Share className="w-4 h-4" />
                </button>
                <button className="icon-button">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 py-6">
              {messages.length === 0 && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-8 h-8 text-white dark:text-black" />
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">Welcome to Narobot</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                    Get intelligent assistance for your work, research, and creative projects. Ask questions, analyze data, or brainstorm ideas.
                  </p>
                  
                  {/* Suggested Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => setInputText(prompt.description)}
                        className="suggestion-card group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{prompt.icon}</span>
                          <span className="font-medium">{prompt.text}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                          {prompt.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className="message-container group">
                  <div className={`message ${message.type === 'user' ? 'message-user' : 'message-assistant'}`}>
                    <div className="message-avatar">
                      {message.type === 'user' ? (
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white dark:text-black" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white dark:text-black" />
                        </div>
                      )}
                    </div>
                    
                    <div className="message-content">
                      <div className="message-header">
                        <span className="font-medium">
                          {message.type === 'user' ? 'You' : 'Narobot'}
                        </span>
                        <span className="message-time">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="message-text">
                        {message.content}
                      </div>
                      
                      {message.slideshow && message.slideshow.length > 0 && (
                        <div className="mt-6">
                          <SlideshowViewer slides={message.slideshow} autoStart={true} />
                        </div>
                      )}
                      
                      {message.type === 'bot' && !isLoading && (
                        <div className="message-actions">
                          <button className="action-button">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="action-button">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="action-button">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button className="action-button">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message-container">
                  <div className="message message-assistant">
                    <div className="message-avatar">
                      <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white dark:text-black" />
                      </div>
                    </div>
                    
                    <div className="message-content">
                      <div className="message-header">
                        <span className="font-medium">Narobot</span>
                        <span className="message-time">now</span>
                      </div>
                      
                      <div className="thinking-indicator">
                        <span>Thinking</span>
                        <div className="thinking-dots">
                          <div className="thinking-dot"></div>
                          <div className="thinking-dot"></div>
                          <div className="thinking-dot"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="input-container">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <form onSubmit={handleSubmit} className="relative">
                <div className="input-wrapper">
                  <button type="button" className="input-attachment-button">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask me anything... (Press Enter to send, Shift+Enter for new line)"
                    className="chat-input"
                    disabled={isLoading}
                  />
                  
                  <div className="input-actions">
                    <button type="button" className="input-action-button">
                      <Mic className="w-4 h-4" />
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      className="send-button"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="input-footer">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ⚡ Powered by Gemini 1.5 Flash
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};