"""FastAPI wrapper around CareerBot.

Run:   uvicorn api:app --port 8000
Docs:  http://localhost:8000/docs   (built-in test page)
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from bot_core import CareerBot, looks_like_text_block, LOW_CONFIDENCE

app = FastAPI(title="CareerCraft ML Service")
bot = CareerBot()  # loads role_model.pkl and tfidf.pkl once at startup


class ResumeIn(BaseModel):
    resume_text: str


class MatchIn(BaseModel):
    resume_text: str
    job_description: str


def check(text: str, label: str):
    if not text or len(text.strip().split()) < 3:
        human_label = "Resume text" if label == "resume_text" else "Job description"
        raise HTTPException(status_code=400, detail=f"{human_label} is too short (please provide at least 3 words).")


def roles_to_json(roles):
    return [{"role": role, "confidence": round(p, 3)} for role, p in roles]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict-role")
def predict_role(body: ResumeIn):
    check(body.resume_text, "resume_text")
    roles = bot.top_roles(body.resume_text)
    return {"top_roles": roles_to_json(roles), "low_confidence": roles[0][1] < LOW_CONFIDENCE}


@app.post("/match")
def match(body: MatchIn):
    check(body.resume_text, "resume_text")
    check(body.job_description, "job_description")
    result = bot.compare(body.resume_text, body.job_description)
    # compare() returns (role, prob) tuples; convert to JSON-friendly dicts
    result["resume_roles"] = roles_to_json(result["resume_roles"])
    result["jd_roles"] = roles_to_json(result["jd_roles"])
    return result
