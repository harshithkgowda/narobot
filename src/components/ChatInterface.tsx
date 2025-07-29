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
  Keyboard,
  Settings,
  History,
  Star,
  Trash2,
  Edit3,
  Plus,
  Search,
  Bell,
  Calendar,
  FileText,
  BarChart3,
  Zap,
  Shield,
  HelpCircle
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
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [conversations, setConversations] = useState([
    { id: 1, title: 'How to repair a bike', timestamp: '2 hours ago', starred: true },
    { id: 2, title: 'Car maintenance tips', timestamp: '1 day ago', starred: false },
    { id: 3, title: 'Computer troubleshooting', timestamp: '3 days ago', starred: false },
    { id: 4, title: 'Cooking pasta recipe', timestamp: '1 week ago', starred: true },
  ]);
  const [userProfile, setUserProfile] = useState({
    name: 'Narobot User',
    email: 'user@narobot.ai',
    plan: 'Pro',
    usage: '75%',
    totalQueries: 1247,
    savedConversations: 23
  });
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
      setActiveTab('chat');
    }
  };

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
    }, 3000);
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

  const renderHomeContent = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-4">
        <p className="text-emerald-400 text-sm mb-2">I can search new contacts</p>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 leading-tight">
        What Can I Do for<br />You Today?
      </h1>

      {/* Voice Animation Circle */}
      <div className="relative mb-12">
        <div className="w-32 h-32 relative">
          {/* Outer glow rings */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border-2 border-emerald-400/50 animate-ping delay-75"></div>
          <div className="absolute inset-4 rounded-full border-2 border-emerald-400/70 animate-ping delay-150"></div>
          
          {/* Main circle */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-2xl shadow-emerald-500/50 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
               onClick={startListening}>
            {isListening ? (
              <div className="flex space-x-1">
                <div className="w-1 h-6 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-8 bg-white rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-150"></div>
                <div className="w-1 h-7 bg-white rounded-full animate-pulse delay-225"></div>
              </div>
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Use Keyboard Button */}
      <button 
        onClick={() => setIsVoiceMode(false)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/30"
      >
        <Keyboard className="w-5 h-5 inline mr-2" />
        Use Keyboard
      </button>

      {/* Keyboard Input (when toggled) */}
      {!isVoiceMode && (
        <div className="mt-8 w-full max-w-md">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-black/30 backdrop-blur-sm border border-emerald-500/30 rounded-2xl px-6 py-4 text-white placeholder-emerald-300/70 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
        <button className="glass-panel p-4 rounded-xl text-left hover:bg-emerald-500/10 transition-all duration-300">
          <Zap className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="text-white font-medium">Quick Help</h3>
          <p className="text-emerald-300/70 text-sm">Get instant assistance</p>
        </button>
        <button className="glass-panel p-4 rounded-xl text-left hover:bg-emerald-500/10 transition-all duration-300">
          <History className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="text-white font-medium">Recent</h3>
          <p className="text-emerald-300/70 text-sm">View past conversations</p>
        </button>
      </div>
    </div>
  );

  const renderChatContent = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-emerald-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No conversations yet</h3>
            <p className="text-emerald-300/70">Start a conversation to see your chat history here</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="group">
              <div className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.type === 'user' ? (
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-white">
                      {message.type === 'user' ? 'You' : 'Narobot'}
                    </span>
                    <span className="text-xs text-emerald-300/70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className={`${
                    message.type === 'user' 
                      ? 'bg-emerald-500 text-white ml-auto max-w-fit px-4 py-3 rounded-2xl rounded-tr-md' 
                      : 'text-white'
                  }`}>
                    {message.content}
                  </div>
                  
                  {message.slideshow && message.slideshow.length > 0 && (
                    <div className="mt-6">
                      <SlideshowViewer slides={message.slideshow} autoStart={true} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-white">Narobot</span>
                <span className="text-xs text-emerald-300/70">now</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-300">
                <span>Thinking</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  const renderProfileContent = () => (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="glass-panel p-6 rounded-2xl mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{userProfile.name}</h2>
          <p className="text-emerald-300/70 mb-4">{userProfile.email}</p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full">
            <Star className="w-4 h-4" />
            <span className="font-medium">{userProfile.plan} Plan</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userProfile.totalQueries}</p>
                <p className="text-emerald-300/70 text-sm">Total Queries</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{userProfile.savedConversations}</p>
                <p className="text-emerald-300/70 text-sm">Saved Chats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="glass-panel p-6 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Monthly Usage</h3>
            <span className="text-emerald-400 font-medium">{userProfile.usage}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full" style={{ width: userProfile.usage }}></div>
          </div>
          <p className="text-emerald-300/70 text-sm mt-2">Resets in 12 days</p>
        </div>

        {/* Recent Conversations */}
        <div className="glass-panel p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Conversations</h3>
          <div className="space-y-3">
            {conversations.slice(0, 3).map((conv) => (
              <div key={conv.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-emerald-500/10 transition-colors">
                <div className="flex-1">
                  <p className="text-white font-medium">{conv.title}</p>
                  <p className="text-emerald-300/70 text-sm">{conv.timestamp}</p>
                </div>
                <button
                  onClick={() => toggleConversationStar(conv.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    conv.starred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-4 h-4" fill={conv.starred ? 'currentColor' : 'none'} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <button className="w-full glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-emerald-500/10 transition-colors">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Settings</span>
          </button>
          <button className="w-full glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-emerald-500/10 transition-colors">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Help & Support</span>
          </button>
          <button className="w-full glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-emerald-500/10 transition-colors">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Privacy & Security</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'chat':
        return renderChatContent();
      case 'profile':
        return renderProfileContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Additional floating orbs */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400/10 rounded-full blur-2xl animate-float delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {renderContent()}

        {/* Input Area (for chat mode) */}
        {activeTab === 'chat' && messages.length > 0 && (
          <div className="p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <div className="glass-panel border border-emerald-500/30 rounded-2xl flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask me anything... (Press Enter to send)"
                    className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white placeholder-emerald-300/70"
                    disabled={isLoading}
                  />
                  
                  <div className="flex items-center gap-2 pr-2">
                    <button type="button" className="p-2 text-emerald-300 hover:text-white transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-all duration-300 hover:scale-105"
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
                <p className="text-xs text-emerald-300/70">
                  ⚡ Powered by Gemini 1.5 Flash
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="relative z-20 p-4">
        <div className="flex justify-center">
          <div className="glass-panel rounded-2xl p-2 flex gap-2 border border-emerald-500/20">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-8 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'home' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-500/20'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center gap-1 px-8 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'chat' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-500/20'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">Chat</span>
              {messages.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{messages.length}</span>
                </div>
              )}
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-8 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'profile' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-500/20'
              }`}
            >
              <UserCircle className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};