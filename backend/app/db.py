import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env")

# .env.example 기준: sqlite:///../data/app.db (backend/ 기준 상대 경로)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///../data/app.db")

if DATABASE_URL.startswith("sqlite:///") and not DATABASE_URL.startswith("sqlite:////"):
    # 상대 경로를 backend/ 기준 절대 경로로 고정 (실행 위치에 영향받지 않게)
    rel = DATABASE_URL[len("sqlite:///"):]
    db_path = (BACKEND_DIR / rel).resolve()
    db_path.parent.mkdir(parents=True, exist_ok=True)
    DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    """앱 시작 시 create_all. Alembic은 도입하지 않는다 (CLAUDE.md 5항)."""
    from app import models  # noqa: F401  모델 등록

    Base.metadata.create_all(bind=engine)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
