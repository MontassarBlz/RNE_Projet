import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChatHeader from './ChatHeader';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import RNELogo from './RNELogo';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion'; // Pour les animations

interface MessageType {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: "Bonjour ! Je suis RNExpert, l'assistant virtuel du Registre National des Entreprises. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Liste de suggestions de questions
  const suggestions = [
    "Comment enregistrer une entreprise ?",
    "Quels sont les documents nécessaires pour une inscription ?",
    "Comment modifier les informations d'une entreprise ?",
    "Quels sont les frais d'inscription au RNE ?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Masquer les suggestions après l'envoi d'un message utilisateur
  useEffect(() => {
    if (messages.some((msg) => !msg.isBot)) {
      setShowSuggestions(false);
    }
  }, [messages]);

  const getBotResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage,
          lang: 'fr'
        })
      });

      if (!response.ok) throw new Error('Erreur réseau');

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: data.response,
        isBot: true,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (content: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    getBotResponse(content);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Card 
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse border-2 border-custom-primary"
          style={{ background: `linear-gradient(135deg, #35b3c0 0%, #7078ac 100%)` }}
          onClick={() => setIsMinimized(false)}
        >
          <RNELogo size="sm" />
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-80 sm:w-96 h-[500px] sm:h-[600px] flex flex-col animate-slide-in-bottom">
      <Card className="flex-1 flex flex-col shadow-2xl border-2 border-custom-primary/20 overflow-hidden bg-white">
        <ChatHeader 
          onMinimize={() => setIsMinimized(true)}
          onClose={() => setIsMinimized(true)}
        />
        
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gradient-to-br from-custom-primary/5 to-custom-secondary/5">
          {messages.map((message) => (
            <Message
              key={message.id}
              content={message.content}
              isBot={message.isBot}
              timestamp={message.timestamp}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Section pour les suggestions de questions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="p-3 sm:p-4 border-t border-gray-200 bg-white"
              role="region"
              aria-label="Suggestions de questions"
            >
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="text-sm text-custom-primary bg-custom-primary/5 hover:bg-custom-primary/20 border-custom-primary/30 rounded-full px-4 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isTyping}
                      aria-label={`Suggestion: ${suggestion}`}
                    >
                      {suggestion}
                    </Button>
                  </motion.div>
                ))}
              </div>
              {suggestions.length > 3 && (
                <Button
                  variant="ghost"
                  className="text-xs text-custom-primary mt-2 hover:underline"
                  onClick={() => setShowSuggestions(false)}
                  aria-label="Masquer les suggestions"
                >
                  Masquer les suggestions
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder="Posez votre question à RNExpert..."
        />
      </Card>
    </div>
  );
};

export default ChatInterface;