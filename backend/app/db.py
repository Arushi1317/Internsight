import os
from dataclasses import dataclass


@dataclass(frozen=True)
class DatabaseSettings:
    url: str
    vector_table: str = "internship_embeddings"


def get_database_settings() -> DatabaseSettings:
    return DatabaseSettings(
        url=os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/internsight"),
        vector_table=os.getenv("PGVECTOR_TABLE", "internship_embeddings"),
    )


def semantic_match_sql() -> str:
    return """
    SELECT
      internship_id,
      title,
      company,
      1 - (embedding <=> %(resume_embedding)s::vector) AS similarity
    FROM internship_embeddings
    ORDER BY embedding <=> %(resume_embedding)s::vector
    LIMIT %(limit)s;
    """.strip()
