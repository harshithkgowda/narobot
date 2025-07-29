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
  Sun,
  Star,
  Trash2,
  Edit3,
  Keyboard,
  MicIcon
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
  const [activeTab, setActiveTab] = useState('chat');
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

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
    }, 3000);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {messages.length === 0 ? (
          /* Welcome Screen */
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
              onClick={toggleVoiceMode}
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
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
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
                      
                      {message.type === 'bot' && !isLoading && (
                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleCopyMessage(message.content)}
                            className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-300 hover:text-white"
                            title="Copy message"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-300 hover:text-white" title="Like">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-300 hover:text-white" title="Dislike">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-300 hover:text-white" title="Regenerate">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

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
        )}

        {/* Input Area (for chat mode) */}
        {messages.length > 0 && (
          <div className="p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <div className="bg-black/30 backdrop-blur-sm border border-emerald-500/30 rounded-2xl flex items-center">
                  <button type="button" className="p-3 text-emerald-300 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask me anything... (Press Enter to send)"
                    className="flex-1 bg-transparent border-none outline-none px-2 py-4 text-white placeholder-emerald-300/70"
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

      {/* Bottom Navigation */}
      <div className="relative z-20 p-4">
        <div className="flex justify-center">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-2 flex gap-2">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'home' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-500/20'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'chat' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-500/20'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">Chat</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === 'profile' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-500/20'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};