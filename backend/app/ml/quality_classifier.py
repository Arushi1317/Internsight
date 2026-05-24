from dataclasses import dataclass

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


@dataclass(frozen=True)
class QualityPrediction:
    label: str
    confidence: float


def build_quality_classifier() -> Pipeline:
    return Pipeline(
        steps=[
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_features=5000)),
            ("model", LogisticRegression(max_iter=1000)),
        ]
    )


def train_quality_classifier(texts: list[str], labels: list[str]) -> Pipeline:
    if len(texts) != len(labels):
        raise ValueError("texts and labels must have the same length")
    if not texts:
        raise ValueError("at least one training example is required")

    model = build_quality_classifier()
    model.fit(texts, labels)
    return model


def predict_quality(model: Pipeline, text: str) -> QualityPrediction:
    label = str(model.predict([text])[0])
    confidence = 0.0

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba([text])[0]
        confidence = float(max(probabilities))

    return QualityPrediction(label=label, confidence=round(confidence, 3))
