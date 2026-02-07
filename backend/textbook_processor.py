import pdfplumber
import re
import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models import Textbook, Chapter, ExtractedQuestion
from datetime import datetime

class TextbookProcessor:
    def __init__(self):
        pass

    def process_pdf(self, file_path: str, textbook_id: str, db: Session):
        """
        Extracts content from PDF and populates the database.
        """
        extracted_text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        
        # Simple heuristic to find Chapters and Questions
        # In a production system, this would be a complex NLP pipeline or LLM call.
        
        # 1. Split by "Chapter"
        chapter_pattern = r"(Chapter\s+\d+|Unit\s+\d+).*?(\n|$)"
        chunks = re.split(chapter_pattern, extracted_text, flags=re.IGNORECASE)
        
        # Determine chapters
        current_chapter = None
        
        # Skip preamble if any (chunks[0])
        # The split returns [preamble, Chapter Marker, newline, Content, Chapter Marker, newline, Content...]
        
        # This regex split might be weird. Let's do a simpler line-by-line state machine.
        
        lines = extracted_text.split('\n')
        current_chapter_obj = None
        buffer_text = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Detect Chapter Header
            if re.match(r"^(Chapter|Unit)\s+\d+", line, re.IGNORECASE) and len(line) < 50:
                # Save previous
                if current_chapter_obj:
                    # Parse questions from buffer before saving
                    self._extract_questions_from_text(current_chapter_obj.id, "\n".join(buffer_text), db)
                    current_chapter_obj.content_summary = "\n".join(buffer_text[:500]) + "..." # Save truncated text
                    db.add(current_chapter_obj)
                    db.commit()
                
                # Start new
                chap_num = int(re.search(r"\d+", line).group())
                current_chapter_obj = Chapter(
                    id=str(uuid.uuid4()),
                    textbook_id=textbook_id,
                    chapter_number=chap_num,
                    title=line,
                    content_summary=""
                )
                buffer_text = []
            else:
                buffer_text.append(line)
        
        # Save last chapter
        if current_chapter_obj:
             self._extract_questions_from_text(current_chapter_obj.id, "\n".join(buffer_text), db)
             current_chapter_obj.content_summary = "\n".join(buffer_text[:500]) + "..."
             db.add(current_chapter_obj)
             db.commit()

    def _extract_questions_from_text(self, chapter_id: str, text: str, db: Session):
        """
        Heuristically finds MCQ, Short, Long questions in the text.
        """
        # Look for "Q1.", "1.", "(a)", etc.
        # This is a very naive implementation for demonstration.
        
        # Regex for questions usually found at end of chapter
        # Look for block starting with "Exercise" or "Questions"
        exercise_match = re.search(r"(Exercise|Questions|Assessment)\s*:?", text, re.IGNORECASE)
        if exercise_match:
            exercise_text = text[exercise_match.start():]
            
            # Find probable questions
            # Pattern: Number dot/paren text ?
            q_pattern = r"(\d+[\.\)]\s+.*?\?)"
            questions = re.findall(q_pattern, exercise_text, re.DOTALL)
            
            for q_text in questions:
                # Determine type
                q_type = "Short"
                if "explain" in q_text.lower() or "describe" in q_text.lower():
                    q_type = "Long"
                elif re.search(r"\([a-d]\)", q_text): # Has options (a) (b)...
                    q_type = "MCQ"
                
                clean_text = re.sub(r"^\d+[\.\)]\s+", "", q_text).strip()
                
                db_q = ExtractedQuestion(
                    id=str(uuid.uuid4()),
                    chapter_id=chapter_id,
                    question_type=q_type,
                    text=clean_text[:500], # Truncate if too long
                    answer="", # Extraction of answer key is much harder without LLM
                    difficulty="Medium"
                )
                db.add(db_q)

textbook_processor = TextbookProcessor()
