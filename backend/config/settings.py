import os
from dataclasses import dataclass

@dataclass
class Settings:
    API_KEY: str = os.getenv("MISTRAL_API_KEY", "pPUHAEXQFIxHlFfQOhlcqwmXjZi9Dmxh")
    MODEL: str = os.getenv("MISTRAL_MODEL", "mistral-large-latest")
    PDF_DIRECTORY: str = os.getenv("PDF_DIR", "pdfs")
    CACHE_DIR: str = os.getenv("CACHE_DIR", "cache")
    PDF_EXTRACTION_SETTINGS = {
        'max_pages': 100,  # Augmenter si nécessaire
        'timeout_per_page': 2.0,  # Timeout par page
        'max_text_length': 500000  # Limite absolue de caractères
    }

settings = Settings()