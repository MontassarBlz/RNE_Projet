
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Tapez votre message..." 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="p-4 border-t border-rne-gray-light bg-white">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full resize-none rounded-xl border border-rne-gray-light px-4 py-3 pr-12 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-rne-navy focus:border-transparent",
              "placeholder:text-rne-text-light transition-all duration-200",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-rne-gray"
          >
            <Paperclip className="w-4 h-4 text-rne-text-light" />
          </Button>
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "rne-gradient h-12 w-12 rounded-xl flex items-center justify-center",
            "hover:shadow-lg transition-all duration-200 flex-shrink-0",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="w-5 h-5 text-white" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
