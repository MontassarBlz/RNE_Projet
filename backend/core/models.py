from dataclasses import dataclass
from typing import Dict

@dataclass
class TextExtractionResult:
    """Classe pour stocker les textes extraits par langue."""
    texts: Dict[str, str]
    
    def get_text(self, lang: str) -> str:
        """Retourne le texte pour une langue donnée avec fallback sur le français."""
        return self.texts.get(lang, self.texts.get("fr", ""))