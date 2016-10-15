from sqlalchemy import create_engine
from smoke_signal.database.models import Base


def init(path):
    engine = create_engine(path)
    if not engine.dialect.has_table(engine.connect(), "feed"):
        Base.metadata.create_all(engine)
    return engine


def init_memory():
    return create_engine("sqlite:///:memory", echo=True)
