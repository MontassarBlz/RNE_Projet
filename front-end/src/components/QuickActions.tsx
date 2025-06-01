
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Search, HelpCircle, Building2 } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions = [
    {
      icon: Search,
      label: "Rechercher une entreprise",
      action: "search_company"
    },
    {
      icon: FileText,
      label: "Créer un dossier",
      action: "create_file"
    },
    {
      icon: Building2,
      label: "Informations sur l'immatriculation",
      action: "registration_info"
    },
    {
      icon: HelpCircle,
      label: "Aide et support",
      action: "help"
    }
  ];

  return (
    <div className="p-4 border-t border-rne-gray-light">
      <p className="text-sm text-rne-text-light mb-3 font-medium">Actions rapides :</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.action}
            variant="outline"
            size="sm"
            onClick={() => onActionClick(action.action)}
            className="flex items-center gap-2 h-auto p-3 border-rne-gray-light hover:bg-rne-gray hover:border-rne-navy transition-all duration-200"
          >
            <action.icon className="w-4 h-4 text-rne-navy" />
            <span className="text-xs text-rne-text text-left leading-tight">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
