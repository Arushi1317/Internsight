import re
from collections import Counter

TOKEN_RE = re.compile(r"[a-zA-Z][a-zA-Z+#.-]*")

RISK_TERMS = {
    "unpaid",
    "performance",
    "commission",
    "urgent",
    "immediate",
    "deposit",
    "fee",
    "training fee",
    "certificate only",
    "exposure",
    "flexible stipend",
}

QUALITY_TERMS = {
    "mentor",
    "mentorship",
    "review",
    "deliverable",
    "project",
    "portfolio",
    "learning",
    "weekly",
    "code review",
    "model",
    "api",
    "dashboard",
}


def normalize(text: str) -> str:
    return text.lower().strip()


def tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_RE.findall(text)]


def keyword_hits(text: str, keywords: set[str]) -> list[str]:
    lowered = normalize(text)
    return sorted(keyword for keyword in keywords if keyword in lowered)


def overlap_score(left: list[str], right: list[str]) -> tuple[int, list[str]]:
    left_tokens = set(tokenize(" ".join(left)))
    right_tokens = set(tokenize(" ".join(right)))
    if not right_tokens:
        return 50, []

    overlap = sorted(left_tokens & right_tokens)
    score = min(100, round((len(overlap) / max(len(right_tokens), 1)) * 100))
    return score, overlap


def top_terms(text: str, limit: int = 8) -> list[str]:
    stopwords = {"and", "the", "for", "with", "into", "this", "that", "will", "you", "your", "role"}
    counts = Counter(token for token in tokenize(text) if token not in stopwords and len(token) > 2)
    return [term for term, _ in counts.most_common(limit)]
