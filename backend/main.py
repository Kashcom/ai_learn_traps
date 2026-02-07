from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uuid
from sqlalchemy.orm import Session

from models import SessionLocal, Question as DBQuestion, User, init_db
import models
from ai_service import ai_service
from datetime import datetime

app = FastAPI(title="AI Learn Traps API")

# Initialize DB
init_db()

# Pydantic Models for API
class Option(BaseModel):
    id: str
    text: str
    isCorrect: bool = False
    isTrap: bool = False
    feedback: Optional[str] = None

class QuestionModel(BaseModel):
    id: Optional[str] = None
    text: str
    topic: str
    explanation: str
    options: List[Option]

class MistakeInput(BaseModel):
    questionText: str
    wrongAnswer: str
    correctAnswer: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Learn Traps API"}

@app.get("/questions", response_model=List[QuestionModel])
def get_questions(topic: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(DBQuestion)
    if topic:
        query = query.filter(DBQuestion.topic == topic)
    return query.all()

@app.post("/questions")
def create_question(q: QuestionModel, db: Session = Depends(get_db)):
    if not q.id:
        q.id = str(uuid.uuid4())
    
    # Auto-generate trap feedback if missing using AI
    for opt in q.options:
        if opt.isTrap and not opt.feedback:
            opt.feedback = ai_service.analyze_mistake(q.text, opt.text, [o.text for o in q.options if o.isCorrect][0])

    # Calculate fields for new schema
    correct_opt = next((o.text for o in q.options if o.isCorrect), "")
    wrong_opts = [o.text for o in q.options if not o.isCorrect]

    db_q = DBQuestion(
        id=q.id,
        text=q.text,
        topic=q.topic,
        explanation=q.explanation,
        options=[opt.dict() for opt in q.options],
        correct_option=correct_opt,
        wrong_options=wrong_opts,
        trap_type="Manual"
    )
    db.add(db_q)
    db.commit()
    return {"status": "created", "id": q.id}

class AnswerInput(BaseModel):
    user_id: str
    question_id: str
    selected_option_id: str
    is_correct: bool
    is_trap: bool

@app.post("/submit-answer")
def submit_answer(data: AnswerInput, db: Session = Depends(get_db)):
    # 1. Update/Create User
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        user = User(id=data.user_id, name="Student", xp=0, level=1)
        db.add(user)
    
    # 2. Record Response
    response = models.StudentResponse(
        id=str(uuid.uuid4()),
        user_id=data.user_id,
        question_id=data.question_id,
        selected_option=data.selected_option_id,
        trap_detected=data.is_trap,
        timestamp=datetime.utcnow().isoformat()
    )
    db.add(response)
    
    # 3. Update Stats (Simple Gamification)
    if data.is_correct:
        user.xp += 10
        # Simple Level Formula: Level = (XP / 100) + 1
        user.level = int((user.xp / 100) + 1)
        
    db.commit()
    return {"status": "recorded", "current_xp": user.xp, "level": user.level}

@app.get("/user-stats/{user_id}")
def get_stats(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"xp": 0, "level": 1, "traps_avoided": 0}
        
    # Count traps avoided (Questions answered correctly where a trap existed?) 
    # Or simple definition: Questions answered correctly.
    # Let's define "Traps Avoided" as correct answers on questions that HAD a trap option.
    # For simplicity, just return total correct.
    
    return {
        "xp": user.xp, 
        "level": user.level,
        "name": user.name
    }

@app.get("/generate-question/{topic}")
def generate_question_endpoint(topic: str):
    try:
        question_data = ai_service.generate_question(topic)
        return question_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Textbook Parsing Endpoints
from fastapi import UploadFile, File, Form
import shutil
import os
from textbook_processor import textbook_processor
from models import Textbook, Chapter, ExtractedQuestion

@app.post("/upload-textbook")
def upload_textbook(
    file: UploadFile = File(...),
    subject: str = Form(...),
    grade: str = Form(...),
    board: str = Form(...),
    db: Session = Depends(get_db)
):
    upload_dir = "uploaded_books"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_location = f"{upload_dir}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Create DB Entry
    book_id = str(uuid.uuid4())
    new_book = Textbook(
        id=book_id,
        title=file.filename,
        subject=subject,
        grade=grade,
        board=board,
        filename=file_location,
        uploaded_at=datetime.utcnow().isoformat()
    )
    db.add(new_book)
    db.commit()
    
    # Trigger Processing (Ideally Background Task)
    try:
        textbook_processor.process_pdf(file_location, book_id, db)
        return {"status": "success", "message": "Book uploaded and parsed successfully", "book_id": book_id}
    except Exception as e:
        return {"status": "partial_success", "message": f"Book uploaded but parsing failed: {str(e)}", "book_id": book_id}

@app.get("/textbooks/{book_id}/chapters")
def get_chapters(book_id: str, db: Session = Depends(get_db)):
    return db.query(Chapter).filter(Chapter.textbook_id == book_id).all()

@app.get("/chapters/{chapter_id}/questions")
def get_extracted_questions(chapter_id: str, db: Session = Depends(get_db)):
    return db.query(ExtractedQuestion).filter(ExtractedQuestion.chapter_id == chapter_id).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
