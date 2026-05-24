from app.services.nlp_features import tokenize


def simple_text_vector(text: str, vocabulary: list[str]) -> list[float]:
    tokens = tokenize(text)
    total = max(len(tokens), 1)
    return [tokens.count(term.lower()) / total for term in vocabulary]


def cosine_similarity(left: list[float], right: list[float]) -> float:
    if len(left) != len(right):
        raise ValueError("vectors must have the same length")

    dot = sum(a * b for a, b in zip(left, right))
    left_norm = sum(value * value for value in left) ** 0.5
    right_norm = sum(value * value for value in right) ** 0.5
    if left_norm == 0 or right_norm == 0:
        return 0.0
    return round(dot / (left_norm * right_norm), 4)
