
import React from 'react';

interface RNELogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
}

const RNELogo: React.FC<RNELogoProps> = ({ size = 'md', variant = 'light' }) => {
  const sizeClasses = {
    sm: 'w-8 h-6',
    md: 'w-12 h-9',
    lg: 'w-16 h-12',
    xl: 'w-24 h-18'
  };

  // Définir les couleurs selon le variant
  const colors = variant === 'light' ? {
    primary: '#ffffff',
    secondary: '#f0f0f0',
    accent: '#e0e0e0',
    text: '#ffffff'
  } : {
    primary: '#35b3c0',
    secondary: '#7078ac',
    accent: '#2b3051',
    text: '#666666'
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <svg 
        viewBox="0 0 200 120" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Carrés décoratifs à gauche */}
        <rect x="10" y="15" width="8" height="8" fill={colors.primary} />
        <rect x="20" y="15" width="8" height="8" fill={colors.secondary} />
        <rect x="30" y="15" width="8" height="8" fill={colors.accent} />
        
        <rect x="10" y="25" width="8" height="8" fill={colors.secondary} />
        <rect x="20" y="25" width="8" height="8" fill={colors.primary} />
        
        <rect x="10" y="35" width="8" height="8" fill={colors.accent} />
        <rect x="20" y="35" width="8" height="8" fill={colors.secondary} />
        
        {/* Pixels décoratifs */}
        <rect x="40" y="25" width="3" height="3" fill={colors.accent} />
        <rect x="44" y="25" width="3" height="3" fill={colors.accent} />
        <rect x="40" y="29" width="3" height="3" fill={colors.primary} />
        <rect x="44" y="29" width="3" height="3" fill={colors.secondary} />
        <rect x="40" y="33" width="3" height="3" fill={colors.accent} />
        <rect x="48" y="33" width="3" height="3" fill={colors.primary} />
        
        {/* Lettre R */}
        <path d="M52 15 L52 55 L56 55 L56 38 L68 38 C72 38 75 35 75 31 L75 22 C75 18 72 15 68 15 Z M56 19 L68 19 C70 19 71 20 71 22 L71 31 C71 33 70 34 68 34 L56 34 Z" fill={colors.text} />
        <path d="M65 38 L75 55 L80 55 L68 36" fill={colors.text} />
        
        {/* Lettre N */}
        <path d="M85 15 L85 55 L89 55 L89 24 L105 55 L110 55 L110 15 L106 15 L106 46 L90 15 Z" fill={colors.text} />
        
        {/* Lettre E */}
        <path d="M120 15 L120 55 L145 55 L145 51 L124 51 L124 37 L142 37 L142 33 L124 33 L124 19 L145 19 L145 15 Z" fill={colors.text} />
        
        {/* Carrés décoratifs à droite */}
        <rect x="155" y="15" width="8" height="8" fill={colors.secondary} />
        <rect x="165" y="15" width="8" height="8" fill={colors.primary} />
        <rect x="175" y="15" width="15" height="8" fill={colors.accent} />
        
        <rect x="155" y="25" width="15" height="8" fill={colors.accent} />
        <rect x="175" y="25" width="15" height="8" fill={colors.secondary} />
        
        <rect x="155" y="35" width="8" height="8" fill={colors.secondary} />
        <rect x="165" y="35" width="25" height="8" fill={colors.accent} />
        
        {/* Texte arabe */}
        <text x="100" y="75" textAnchor="middle" fontSize="10" fill={colors.text} fontFamily="Arial">السجل الوطني للمؤسسات</text>
        
        {/* Texte français */}
        <text x="100" y="90" textAnchor="middle" fontSize="8" fill={colors.text} fontFamily="Arial" fontWeight="500">REGISTRE NATIONAL DES ENTREPRISES</text>
      </svg>
    </div>
  );
};

export default RNELogo;
