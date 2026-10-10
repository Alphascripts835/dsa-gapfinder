from .questions import BY_ID, TOPICS
from .recommendations import RECS

THRESHOLDS = {"strong": 80, "developing": 60}  # configurable

def categorize(acc):
    if acc is None: return "Not Assessed"
    if acc >= THRESHOLDS["strong"]: return "Strong"
    if acc >= THRESHOLDS["developing"]: return "Developing"
    return "Needs Improvement"

def validate(answers):
    if not answers:
        raise ValueError("No answers submitted. Answer at least one question.")
    for qid, sel in answers.items():
        if qid not in BY_ID: raise ValueError(f"Unknown question id: {qid}")
        if not 0 <= sel < len(BY_ID[qid]["options"]):
            raise ValueError(f"Invalid option {sel} for question {qid}")

def analyze(answers):
    validate(answers)
    stats = {t: {"correct": 0, "attempted": 0} for t in TOPICS}
    review = []
    for qid, sel in answers.items():
        q = BY_ID[qid]; ok = sel == q["answer"]
        stats[q["topic"]]["attempted"] += 1
        stats[q["topic"]]["correct"] += int(ok)
        review.append({"id": qid, "topic": q["topic"], "question": q["question"], "options": q["options"],
                       "selected": sel, "correct_answer": q["answer"], "is_correct": ok,
                       "explanation": q["explanation"]})
    topics = []
    for t in TOPICS:
        s = stats[t]
        acc = round(s["correct"] / s["attempted"] * 100, 1) if s["attempted"] else None
        topics.append({"topic": t, "accuracy": acc, "correct": s["correct"],
                       "attempted": s["attempted"], "category": categorize(acc)})
    assessed = [t for t in topics if t["accuracy"] is not None]
    total = sum(t["attempted"] for t in topics); right = sum(t["correct"] for t in topics)
    weak = sorted([t for t in assessed if t["category"] == "Needs Improvement"], key=lambda t: t["accuracy"])
    return {
        "overall_accuracy": round(right / total * 100, 1), "attempted": total, "correct": right,
        "topics": topics,
        "strongest": max(assessed, key=lambda t: t["accuracy"])["topic"],
        "weakest": min(assessed, key=lambda t: t["accuracy"])["topic"],
        "weak_topics": [t["topic"] for t in weak],
        "explanations": {t["topic"]: f"You answered {t['correct']} of {t['attempted']} {t['topic']} questions correctly ({t['accuracy']}%)." for t in weak},
        "recommendations": {t["topic"]: RECS[t["topic"]] for t in weak},
        "analysis_type": "rule-based (no AI model used)",
        "disclaimer": "Your results reflect your performance on the diagnostic questions and should be used as a guide for further practice.",
        "review": review,
    }
