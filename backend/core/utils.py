import arabic_reshaper
from bidi.algorithm import get_display
from langdetect import detect, LangDetectException

def detect_language(text: str, default: str = "fr") -> str:
    """Détecte la langue d'un texte."""
    try:
        return detect(text)[:2]
    except LangDetectException:
        return default

def reshape_arabic_text(text: str) -> str:
    """Reformate le texte arabe pour un affichage correct."""
    if not text:
        return ""
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)