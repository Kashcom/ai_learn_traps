import spacy
from typing import List, Dict, Any
import random
import uuid

# Load English tokenizer
try:
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

# Knowledge Base of Concepts & Misconceptions
KNOWLEDGE_BASE = {
    "math": [
        {
            "concept": "Order of Operations",
            "misconception": "Processing left-to-right regardless of operators",
            "trap_pattern": "Linearity Bias",
            "template": "What is {a} + {b} x {c}?",
            "generator": lambda: (
                a := random.randint(2, 5), b := random.randint(2, 5), c := random.randint(2, 5),
                {
                    "text": f"What is {a} + {b} x {c}?",
                    "correct": str(a + (b * c)),
                    "trap": str((a + b) * c), # The trap answer
                    "feedback": "Remember PEMDAS! Multiplication happens before Addition."
                }
            )
        },
        {
            "concept": "Fractions",
            "misconception": "Adding numerators and denominators directly",
            "trap_pattern": "Simplification Fallacy",
            "template": "What is 1/{d} + 1/{d}?",
            "generator": lambda: (
                d := random.choice([2, 4, 8]),
                {
                    "text": f"What is 1/{d} + 1/{d}?",
                    "correct": f"2/{d}" if d != 2 else "1",
                    "trap": f"2/{d+d}", # e.g. 1/4 + 1/4 = 2/8
                    "feedback": "When adding fractions with the same denominator, you only add the numerators."
                }
            )
        }
    ],
    "cs": [
        {
            "concept": "Array Indexing",
            "misconception": "1-based indexing",
            "trap_pattern": "Off-by-one Error",
            "template": "Given list L = [{v1}, {v2}, {v3}], what is L[1]?",
            "generator": lambda: (
                vals := [random.randint(10, 99) for _ in range(3)],
                {
                    "text": f"Given list L = {vals}, what is L[1]?",
                    "correct": str(vals[1]),
                    "trap": str(vals[0]), # 1-based indexing expectation
                    "feedback": "Most programming languages (like Python, JS) use 0-based indexing. L[1] is the second element."
                }
            )
        }
    ]
}

class AIService:
    def __init__(self):
        self.nlp = nlp

    def generate_question(self, topic: str) -> Dict[str, Any]:
        """
        Generates a fully formed deceptive question based on the topic.
        """
        if topic not in KNOWLEDGE_BASE:
            topic = "math" # Default
        
        concept_data = random.choice(KNOWLEDGE_BASE[topic])
        
        # Run the generator lambda to get specific values
        # Note: generator returns a tuple, but the lambda logic inside KNOWLEDGE_BASE handles the logic
        # We need to refine the usage of lambda in the dictionary
        
        generator_func = concept_data["generator"]
        # The lambda implies internal logic, we invoke it
        # Actually, the lambda defined above returns a tuple of (vars, dict) or just a dict?
        # Let's check the lambda definitions above.
        # Python 3.8+ walrus operator (:=) makes it return the last expression in the tuple, which is the dict?
        # Wait, a lambda returning a tuple (a, b) returns a tuple.
        # The dictionary is the last element.
        
        result_tuple = generator_func()
        gen_data = result_tuple[-1] # Get the dict
        
        # Construct Options
        options = [
            {"id": str(uuid.uuid4()), "text": gen_data["correct"], "isCorrect": True, "isTrap": False},
            {"id": str(uuid.uuid4()), "text": gen_data["trap"], "isCorrect": False, "isTrap": True, "feedback": gen_data["feedback"]},
        ]
        
        # Add filler options
        correct_val = gen_data["correct"]
        try:
            val = float(correct_val)
            options.append({"id": str(uuid.uuid4()), "text": str(val + random.randint(1,5)), "isCorrect": False, "isTrap": False})
        except:
             options.append({"id": str(uuid.uuid4()), "text": "None of the above", "isCorrect": False, "isTrap": False})
             
        random.shuffle(options)
        
        return {
            "id": str(uuid.uuid4()),
            "text": gen_data["text"],
            "topic": topic,
            "explanation": f"Concept: {concept_data['concept']}. {gen_data['feedback']}",
            "options": options
        }

    def analyze_mistake(self, question_text: str, wrong_answer: str, correct_answer: str) -> str:
        """
        Analyzes why a student might have chosen the wrong answer.
        """
        if not self.nlp:
            return "Analysis: Check if you fell for a common misconception."

        doc_q = self.nlp(question_text)
        
        # Simple heuristic analysis
        if len(wrong_answer) > 0 and len(correct_answer) > 0:
            try:
                # Numeric analysis
                w = float(wrong_answer)
                c = float(correct_answer)
                if w == c * 10 or w == c / 10:
                    return "Analyzed: Use of correct digits but wrong magnitude (Order of Magnitude Trap)."
            except:
                pass
        
        return "Analyzed: This looks like a fundamental misunderstanding of the concept."

ai_service = AIService()
