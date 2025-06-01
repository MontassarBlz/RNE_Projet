from flask import Flask, request, jsonify
from flask_cors import CORS
from core.extractor import PDFExtractor
from core.assistant import LegalAssistant
from config.settings import settings
from config.logging import configure_logging
import logging

# Configuration initiale
configure_logging()
logger = logging.getLogger(__name__)

# Initialisation Flask
app = Flask(__name__)
CORS(app)  # Autorise les requêtes cross-origin

# Variables globales (chargées une fois au démarrage)
assistant = None
texts = None

def initialize_app():
    """Charge les PDFs et initialise l'assistant une seule fois"""
    global assistant, texts
    
    logger.info("Démarrage de l'initialisation...")
    
    # Extraction des PDFs
    try:
        logger.info("Extraction des PDFs en cours...")
        extractor = PDFExtractor()
        texts = extractor.process_pdf_directory(settings.PDF_DIRECTORY)
        logger.info(f"Extraction terminée - {len(texts.texts['fr'])} caractères en français")
        logger.info(f"Extraction terminée - {len(texts.texts['ar'])} caractères en arabe")
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction des PDFs : {str(e)}")
        raise

    # Initialisation de l'assistant
    assistant = LegalAssistant()
    logger.info("Assistant juridique initialisé avec succès")

@app.route('/api/ask', methods=['POST'])
def ask_question():
    """Endpoint pour poser des questions"""
    if not assistant or not texts:
        return jsonify({"error": "Service non initialisé"}), 500
    
    data = request.json
    print(f"Requête reçue : {data}")
    question = data.get('question')
    
    if not question:
        return jsonify({"error": "Le paramètre 'question' est requis"}), 400
    
    try:
        logger.info(f"Question reçue : {question[:100]}...")
        response = assistant.answer_question(texts, question)
        logger.info(f"Réponse générée : {response[:100]}...")
        
        return jsonify({
            "question": question,
            "response": response,
            "status": "success"
        })
    except Exception as e:
        logger.error(f"Erreur traitement question : {str(e)}")
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint de vérification de santé"""
    return jsonify({
        "status": "healthy" if assistant and texts else "initializing",
        "service": "RNE Legal Assistant API"
    })

if __name__ == '__main__':
    try:
        initialize_app()
        app.run(host='0.0.0.0', port=5000, debug=False)
    except Exception as e:
        logger.critical(f"Échec du démarrage : {str(e)}")