
import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import RNELogo from './RNELogo';

interface MessageProps {
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const Message: React.FC<MessageProps> = ({ content, isBot, timestamp }) => {
  return (
    <div className={cn(
      "flex gap-3 mb-4 message-animation",
      isBot ? "justify-start" : "justify-end"
    )}>
      {isBot && (
        <RNELogo size="sm" />
      )}
      
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
        isBot 
          ? "bg-white border border-rne-gray-light text-rne-text" 
          : "rne-gradient-blue text-white"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        <p className={cn(
          "text-xs mt-2 opacity-70",
          isBot ? "text-rne-text-light" : "text-blue-100"
        )}>
          {timestamp.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rne-gradient-cyan rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default Message;
