import React from 'react';
import { X, BarChart3, MessageCircle, Clock, TrendingUp, Globe, Star } from 'lucide-react';
import { ChatMessage } from '../types';

interface ConversationAnalyticsProps {
  messages: ChatMessage[];
  conversations: any[];
  onClose: () => void;
}

export const ConversationAnalytics: React.FC<ConversationAnalyticsProps> = ({
  messages,
  conversations,
  onClose
}) => {
  const totalMessages = messages.length;
  const userMessages = messages.filter(m => m.type === 'user').length;
  const botMessages = messages.filter(m => m.type === 'bot').length;
  const starredConversations = conversations.filter(c => c.starred).length;
  
  const languageStats = conversations.reduce((acc, conv) => {
    acc[conv.language] = (acc[conv.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgResponseTime = 2.3; // Mock data
  const satisfactionRate = 94; // Mock data

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Conversation Analytics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMessages}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{conversations.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conversations</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgResponseTime}s</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{satisfactionRate}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Distribution */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Message Distribution
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">User Messages</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{userMessages}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalMessages > 0 ? (userMessages / totalMessages) * 100 : 0}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bot Responses</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{botMessages}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalMessages > 0 ? (botMessages / totalMessages) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Language Usage */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Language Usage
            </h3>
            <div className="space-y-3">
              {Object.entries(languageStats).map(([lang, count]) => (
                <div key={lang} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white uppercase">
                      {lang}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(count / conversations.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {conversations.slice(0, 5).map((conv) => (
                <div key={conv.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {conv.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {conv.starred && <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {conv.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};