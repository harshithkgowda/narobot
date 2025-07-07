import React from 'react';
import { ChatInterface } from './components/ChatInterface';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <ChatInterface
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;