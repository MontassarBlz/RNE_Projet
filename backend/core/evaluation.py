from dataclasses import dataclass
from typing import List, Dict, Optional
import json
from pathlib import Path
import logging
from core.models import TextExtractionResult  # Import ajouté

logger = logging.getLogger(__name__)

@dataclass
class EvaluationResult:
    question: str
    expected_answer: str
    model_answer: str
    similarity_score: float
    is_correct: bool
    error: Optional[str] = None  # Champ ajouté pour suivre les erreurs

class ModelEvaluator:
    def __init__(self, test_cases_path: str = "data/test_cases.json"):
        self.test_cases_path = Path(test_cases_path)
        self.test_cases = self._load_test_cases()

    def _load_test_cases(self) -> List[Dict]:
        """Charge les cas de test pour l'évaluation"""
        try:
            with open(self.test_cases_path, 'r', encoding='utf-8') as f:
                test_cases = json.load(f)
                if not isinstance(test_cases, list):
                    logger.error("Le fichier de test cases doit contenir une liste")
                    return []
                return test_cases
        except FileNotFoundError:
            logger.warning(f"Fichier de test cases introuvable : {self.test_cases_path}")
            return []
        except json.JSONDecodeError:
            logger.error(f"Fichier JSON invalide : {self.test_cases_path}")
            return []
    
    def _calculate_similarity(self, answer: str, case: dict) -> float:
        """Version améliorée avec matching flexible"""
        import re
        answer = answer.lower()
        expected_keywords = case.get("expected_keywords", [])
        required_count = case.get("required_keywords", len(expected_keywords))
        
        found = 0
        for keyword_pattern in expected_keywords:
            if re.search(keyword_pattern.lower(), answer):
                found += 1
        
        return min(1.0, found / required_count)
    def evaluate_model(self, assistant, extractor) -> List[EvaluationResult]:
        """Version avec debug complet"""
        results = []
        
        for case in self.test_cases:
            try:
                print(f"\n=== Test: {case['question']} ===")
                
                # Chargement du contexte
                texts = TextExtractionResult(texts={"fr": "", "ar": ""})
                if case.get("context_file"):
                    print(f"Chargement du PDF: {case['context_file']}")
                    try:
                        texts = extractor.process_pdf_directory(case["context_file"])
                        print("PDF chargé avec succès")
                    except Exception as e:
                        print(f"❌ Erreur chargement PDF: {str(e)}")
                        continue

                # Génération de la réponse
                print("\nGénération de la réponse...")
                answer = assistant.answer_question(texts, case["question"])
                print(f"Réponse obtenue:\n{answer[:500]}...")  # Affiche les 500 premiers caractères

                # Évaluation
                similarity = self._calculate_similarity(answer, case)
                is_correct = similarity >= 0.7
                
                print(f"\nMots-clés recherchés: {case.get('expected_keywords')}")
                print(f"Similarité calculée: {similarity:.2f}")
                print(f"Résultat: {'✅ PASS' if is_correct else '❌ FAIL'}")

                results.append(EvaluationResult(
                    question=case["question"],
                    expected_answer=str(case.get("expected_keywords")),
                    model_answer=answer,
                    similarity_score=similarity,
                    is_correct=is_correct
                ))

            except Exception as e:
                print(f"⚠️ Erreur lors du test: {str(e)}")
                continue
        
        return results
    def generate_report(self, results: List[EvaluationResult], output_path: str = "results/evaluation_report.json"):
        """Génère un rapport d'évaluation complet"""
        # Création du répertoire si nécessaire
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        # Calcul des métriques
        total_cases = len(results)
        correct_answers = sum(1 for r in results if r.is_correct and not r.error)
        failed_cases = [r for r in results if r.error]
        
        report = {
            "summary": {
                "total_cases": total_cases,
                "correct_answers": correct_answers,
                "accuracy": correct_answers / total_cases if total_cases else 0,
                "failed_cases": len(failed_cases),
                "average_similarity": sum(r.similarity_score for r in results) / total_cases if total_cases else 0
            },
            "details": [{
                "question": r.question,
                "expected": r.expected_answer,
                "actual": r.model_answer,
                "similarity": round(r.similarity_score, 2),
                "is_correct": r.is_correct,
                "error": r.error if r.error else None
            } for r in results]
        }

        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            logger.info(f"Rapport d'évaluation généré : {output_path}")
        except Exception as e:
            logger.error(f"Erreur lors de la génération du rapport : {str(e)}")
            raise

        return report