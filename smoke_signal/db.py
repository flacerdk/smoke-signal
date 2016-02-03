from sqlalchemy import create_engine


def init(path):
    return create_engine(path)


def init_memory():
    return create_engine("sqlite:///:memory", echo=True)
