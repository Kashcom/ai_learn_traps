from sqlalchemy import create_engine, Column, String, Integer, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

SQLALCHEMY_DATABASE_URL = "sqlite:///./traps.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# --- Core Domain Models ---

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # UUID
    name = Column(String)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    
    # Relationships
    responses = relationship("StudentResponse", back_populates="user")

class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(String, primary_key=True, index=True)
    subject = Column(String) # Math, Physics, etc.
    topic_name = Column(String)
    
    concepts = relationship("Concept", back_populates="topic")
    misconceptions = relationship("Misconception", back_populates="topic")

class Concept(Base):
    __tablename__ = "concepts"
    
    id = Column(String, primary_key=True, index=True)
    topic_id = Column(String, ForeignKey("topics.id"))
    correct_concept = Column(String)
    
    topic = relationship("Topic", back_populates="concepts")

class Misconception(Base):
    __tablename__ = "misconceptions"
    
    id = Column(String, primary_key=True, index=True)
    topic_id = Column(String, ForeignKey("topics.id"))
    wrong_concept = Column(String)
    trap_type = Column(String) # e.g. "Linearity Bias"
    
    topic = relationship("Topic", back_populates="misconceptions")

class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, index=True)
    topic_id = Column(String, ForeignKey("topics.id"), nullable=True)
    topic = Column(String) # Denormalized for easier filtering
    
    text = Column(String) # question_text
    explanation = Column(String)
    
    # Storing options structure as JSON is flexible: [{id, text, isCorrect, isTrap, feedback}]
    options = Column(JSON) 
    
    # Specific columns requested
    correct_option = Column(String) # Text of correct option
    wrong_options = Column(JSON)    # List of strings
    trap_type = Column(String)      # Type of trap used in this question

    responses = relationship("StudentResponse", back_populates="question")

class StudentResponse(Base):
    __tablename__ = "student_responses"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    question_id = Column(String, ForeignKey("questions.id"))
    selected_option = Column(String)
    trap_detected = Column(Boolean) # Did they fall for the trap?
    timestamp = Column(String)
    
    user = relationship("User", back_populates="responses")
    question = relationship("Question", back_populates="responses")

# --- Textbook Processing Models (Preserved) ---

class Textbook(Base):
    __tablename__ = "textbooks"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    subject = Column(String)
    grade = Column(String)
    board = Column(String)
    filename = Column(String)
    uploaded_at = Column(String)

class Chapter(Base):
    __tablename__ = "chapters"
    
    id = Column(String, primary_key=True, index=True)
    textbook_id = Column(String, ForeignKey("textbooks.id"))
    chapter_number = Column(Integer)
    title = Column(String)
    content_summary = Column(String)

class ExtractedQuestion(Base):
    __tablename__ = "extracted_questions"
    
    id = Column(String, primary_key=True, index=True)
    chapter_id = Column(String, ForeignKey("chapters.id"))
    question_type = Column(String)
    text = Column(String)
    answer = Column(String)
    difficulty = Column(String)

def init_db():
    Base.metadata.create_all(bind=engine)
