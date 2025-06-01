from typing import List, Dict, Any
import logging
from mistralai import Mistral

from .models import TextExtractionResult
from .utils import detect_language
from config.settings import settings

logger = logging.getLogger(__name__)

class LegalAssistant:
    """Classe pour gérer les interactions avec le modèle d'IA."""

    def __init__(self, api_key: str = settings.API_KEY, model: str = settings.MODEL):
        """
        Initialise le client Mistral pour les interactions IA.
        
        Args:
            api_key (str): Clé API Mistral.
            model (str): Nom du modèle Mistral à utiliser.
        """
        self.client = Mistral(api_key=api_key)
        self.model = model

    def answer_question(self, texts: TextExtractionResult, question: str) -> str:
        """
        Répond à une question en se basant sur les textes extraits.
        
        Args:
            texts (TextExtractionResult): Textes extraits des PDFs.
            question (str): Question posée par l'utilisateur.
            
        Returns:
            str: Réponse générée par l'IA.
        """
        lang = detect_language(question)
        logger.info(f"Langue détectée : {lang}")
        
        text_context = texts.get_text(lang)
        prompt = self._build_prompt(lang, text_context, question)

        try:
            response = self.client.chat.complete(
                model=self.model,
                messages=prompt,
                temperature=0.3,
                max_tokens=600
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Erreur lors de la génération de la réponse : {str(e)}")
            return f"❌ Erreur : {str(e)}"

    @staticmethod
    def _build_prompt(lang: str, context: str, question: str) -> List[Dict[str, Any]]:
        """
        Construit le prompt pour l'IA en fonction de la langue.
        
        Args:
            lang (str): Code de la langue (ar, fr, etc.).
            context (str): Texte contextuel extrait des PDFs.
            question (str): Question posée par l'utilisateur.
            
        Returns:
            List[Dict[str, Any]]: Liste des messages pour l'API Mistral.
        """
        language = "français" if lang == "fr" else "arabe"
        prompt_text = f"""
        Vous êtes un assistant juridique intelligent spécialisé dans le Registre National des Entreprises (RNE) en Tunisie.
        Votre rôle est strictement limité à fournir des informations précises et fiables concernant le RNE tunisien.
        donner la response plus precise possible et courte possible.

        Vous disposez des extraits suivants de documents légaux liés au RNE :
        {context if context else "Aucun extrait disponible."}

        Si la réponse à la question se trouve dans ces extraits, fournissez-la en mentionnant clairement sa source.
        Si la réponse ne figure pas dans les extraits, utilisez uniquement vos connaissances juridiques générales concernant le RNE en Tunisie pour répondre de manière claire et concise.
        Si vous ne disposez pas d’assez d’informations, indiquez-le explicitement.

        Répondez en {language}.

        Question : {question}
        """

        return [
            {"role": "system", "content": prompt_text[:500000]},
            {"role": "user", "content": question}
        ]