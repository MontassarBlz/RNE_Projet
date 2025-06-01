import pdfplumber
from pathlib import Path
import logging
import re
from typing import Optional, Dict, List
import concurrent.futures
import time

from .models import TextExtractionResult
from .utils import reshape_arabic_text

logger = logging.getLogger(__name__)

class PDFExtractor:
    """Classe optimisée pour l'extraction de texte à partir de PDFs volumineux."""

    def __init__(self):
        self.max_pages = 50  # Limite de pages à traiter
        self.max_workers = 4  # Nombre de threads pour le traitement parallèle
        self.text_cache: Dict[str, str] = {}  # Cache des fichiers déjà traités

    def _extract_page_text(self, page) -> str:
        """Méthode optimisée pour l'extraction d'une seule page"""
        try:
            text = page.extract_text(
                x_tolerance=1,
                y_tolerance=1,
                keep_blank_chars=False,
                use_text_flow=False
            )
            return text.strip() if text else ""
        except Exception as e:
            logger.warning(f"Erreur extraction page: {str(e)}")
            return ""

    def extract_text_from_pdf(self, pdf_path: str) -> Optional[str]:
        """
        Extrait le texte d'un fichier PDF avec gestion des fichiers volumineux.
        
        Args:
            pdf_path: Chemin vers le fichier PDF
            
        Returns:
            Texte extrait ou None si erreur
        """
        cache_key = str(Path(pdf_path).resolve())
        if cache_key in self.text_cache:
            return self.text_cache[cache_key]

        try:
            start_time = time.time()
            text_parts = []
            total_pages = 0

            with pdfplumber.open(pdf_path) as pdf:
                total_pages = len(pdf.pages)
                if total_pages > self.max_pages:
                    logger.warning(f"PDF trop volumineux ({total_pages} pages), extraction partielle")

                # Traitement parallèle des pages
                with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                    futures = []
                    for i, page in enumerate(pdf.pages[:self.max_pages]):
                        futures.append(executor.submit(self._extract_page_text, page))

                    for future in concurrent.futures.as_completed(futures):
                        page_text = future.result()
                        if page_text:
                            text_parts.append(page_text)

            result = "\n".join(text_parts) if text_parts else None
            self.text_cache[cache_key] = result
            
            logger.info(f"Extraction terminée en {time.time()-start_time:.2f}s - {total_pages} pages - {len(result or '')} caractères")
            return result
            
        except Exception as e:
            logger.error(f"Erreur extraction {pdf_path}: {str(e)}")
            return None

    def _preprocess_text(self, text: str, lang: str) -> str:
        """Nettoyage et optimisation du texte extrait"""
        if not text:
            return ""
            
        # Suppression des en-têtes/pieds de page répétitifs
        lines = text.split('\n')
        unique_lines = []
        seen_lines = set()
        
        for line in lines:
            clean_line = re.sub(r'\s+', ' ', line).strip()
            if clean_line and clean_line not in seen_lines:
                seen_lines.add(clean_line)
                unique_lines.append(clean_line)
                
        text = '\n'.join(unique_lines)
        
        # Suppression des caractères spéciaux inutiles
        text = re.sub(r'[\x00-\x1F\x7F-\x9F]', '', text)
        
        return reshape_arabic_text(text) if lang == "ar" else text

    def process_pdf_directory(self, directory: str) -> TextExtractionResult:
        """
        Traitement optimisé d'un dossier de PDFs.
        
        Args:
            directory: Chemin du dossier contenant les PDFs
            
        Returns:
            TextExtractionResult avec les textes organisés par langue
        """
        start_time = time.time()
        directory_path = Path(directory)
        if not directory_path.exists():
            raise FileNotFoundError(f"Dossier introuvable: {directory}")

        # Traitement parallèle des fichiers PDF
        pdf_files = list(directory_path.glob("*.pdf"))
        if not pdf_files:
            logger.warning(f"Aucun PDF trouvé dans {directory}")
            return TextExtractionResult({"ar": "", "fr": ""})

        results = {"ar": [], "fr": []}
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            future_to_file = {
                executor.submit(self.extract_text_from_pdf, str(file)): file 
                for file in pdf_files
            }
            
            for future in concurrent.futures.as_completed(future_to_file):
                file = future_to_file[future]
                try:
                    text = future.result()
                    if text:
                        lang = "ar" if "ar" in file.name.lower() else "fr"
                        processed_text = self._preprocess_text(text, lang)
                        results[lang].append(processed_text)
                except Exception as e:
                    logger.error(f"Erreur traitement {file.name}: {str(e)}")

        # Fusion et nettoyage final
        final_texts = {
            "ar": "\n\n".join(results["ar"]),
            "fr": "\n\n".join(results["fr"])
        }
        
        logger.info(f"Traitement terminé en {time.time()-start_time:.2f}s - "
                   f"{len(pdf_files)} fichiers - "
                   f"{len(final_texts['ar'])} car. arabe - "
                   f"{len(final_texts['fr'])} car. français")
                   
        return TextExtractionResult(final_texts)