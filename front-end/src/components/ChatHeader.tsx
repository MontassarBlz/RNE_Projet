
import React from 'react';
import { MessageCircle, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RNELogo from './RNELogo';

interface ChatHeaderProps {
  onMinimize?: () => void;
  onClose?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onMinimize, onClose }) => {
  return (
    <div className="rne-gradient text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <RNELogo size="md" />
          <div>
            <h2 className="text-base sm:text-lg font-semibold">RNExpert</h2>
            <p className="text-blue-100 text-xs sm:text-sm">Assistant Virtuel RNE</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-2 sm:mt-3">
        <div className="w-2 h-2 bg-rne-cyan rounded-full animate-pulse"></div>
        <span className="text-blue-100 text-xs">En ligne</span>
      </div>
    </div>
  );
};

export default ChatHeader;
