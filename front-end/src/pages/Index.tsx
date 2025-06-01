
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import RNELogo from '@/components/RNELogo';

const Index = () => {
  return (
    <div 
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundImage: "url('/lovable-uploads/31f541a8-7600-42a0-95a7-0ca92258c47f.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Header avec design en haut */}
      <header className="relative z-10 bg-custom-main/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              {/* Logo RNE au-dessus du drapeau Tunisie */}
              <div className="flex flex-col items-center space-y-2">
                <RNELogo size="lg" variant="light" />
                <img 
                  src="/lovable-uploads/2194744a-0a53-4558-a95b-47cd5f82509b.png" 
                  alt="Drapeau Tunisie" 
                  className="w-12 h-8 object-cover rounded-sm"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Registre National des Entreprises</h1>
                <p className="text-sm text-white/80">République Tunisienne</p>
              </div>
            </div>
            {/* Design décoratif */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-8 bg-custom-primary rounded-md opacity-80"></div>
                <div className="w-8 h-8 bg-custom-accent rounded-md opacity-60"></div>
                <div className="w-6 h-8 bg-custom-secondary rounded-md opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Bande décorative */}
        <div className="h-2 bg-gradient-to-r from-custom-primary via-custom-accent to-custom-secondary"></div>
      </header>

      {/* Contenu principal centré */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-custom-main mb-4">
                RNExpert - Assistant Virtuel
              </h3>
              <p className="text-custom-main/80 max-w-2xl mx-auto text-base sm:text-lg">
                Notre assistant intelligent est disponible pour répondre à vos questions et vous guider 
                dans vos démarches. Cliquez sur l'icône de chat en bas à droite pour commencer.
              </p>
            </div>
            
            {/* Section À propos */}
            <div className="bg-custom-primary/10 rounded-xl p-6 border border-custom-primary/20">
              <h4 className="text-xl font-bold text-custom-main mb-4">
                À propos
              </h4>
              <div className="text-custom-main/80 space-y-4 text-sm sm:text-base">
                <p>
                  Le Centre National du Registre des Entreprises (CRNE) est créé en vertu de l'article 4 de la loi n°2018-52 
                  du 29 novembre 2018, relative au registre national des entreprises et organisé en vertu du décret 2019-52 
                  relatif à l'organisation administrative et financière du centre national du registre des entreprises.
                </p>
                <p>
                  Le CRNE est un Etablissement Public Non Administratif (EPNA) doté de la personnalité morale et de l'autonomie 
                  financière et administrative sous tutelle de la Présidence du Gouvernement.
                </p>
                <div className="bg-white/50 rounded-lg p-4 mt-4">
                  <h5 className="font-semibold text-custom-main mb-2">Mission</h5>
                  <p>
                    Le Centre a pour mission de gérer le Registre National des Entreprises – RNE- étant « une base de données 
                    publique pour collecter les données et les informations relatives aux entreprises et leurs mises à disposition 
                    du public ainsi qu'aux institutions de l'État »
                  </p>
                  <p className="mt-2">
                    Il est le lieu ou sont immatriculées les entreprises (personnes morales et physiques) ainsi que leurs 
                    inscriptions modificatives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer avec design en bas */}
      <footer className="relative z-10 bg-custom-main/95 backdrop-blur-sm">
        {/* Bande décorative en haut du footer */}
        <div className="h-2 bg-gradient-to-r from-custom-secondary via-custom-accent to-custom-primary"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-white/90 text-sm sm:text-base text-center sm:text-left">
              © 2024 Registre National des Entreprises - République Tunisienne
            </p>
            {/* Design décoratif pour mobile */}
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <div className="w-8 h-4 bg-custom-primary rounded-sm opacity-80"></div>
              <div className="w-6 h-4 bg-custom-accent rounded-sm opacity-60"></div>
              <div className="w-4 h-4 bg-custom-secondary rounded-sm opacity-40"></div>
            </div>
          </div>
        </div>
      </footer>

      {/* Interface du chatbot */}
      <ChatInterface />
    </div>
  );
};

export default Index;
