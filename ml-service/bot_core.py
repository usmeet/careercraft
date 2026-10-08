"""Model logic for the CareerCraft bot: cleaning, prediction, resume vs job description comparison."""
import re
import numpy as np
import joblib

from skills import SKILLS

LOW_CONFIDENCE = 0.30      # below this the role prediction is basically a guess
CONF_SCALE = 5.0           # sharpens SVM scores so the softmax looks like a rough confidence

# Job-posting filler: keywords containing any of these words are not real skills.
FILLER = {
    "job", "description", "ideal", "key", "responsibilities", "responsibility", "hybrid", "remote",
    "provide", "exceptional", "internal", "looking", "required", "requirements", "requirement",
    "experience", "experienced", "skills", "skill", "strong", "ability", "work", "working", "team",
    "candidate", "role", "position", "company", "join", "opportunity", "preferred", "plus", "years",
    "year", "excellent", "knowledge", "including", "etc", "equal", "employer", "benefits", "salary",
    "apply", "ensure", "support", "manage", "managing", "responsible", "duties", "qualifications",
    "qualification", "seeking", "professional", "must", "will", "good", "understanding", "familiarity",
}


# ---------- text helpers ----------
def clean_text(text):
    """Same cleaning as the notebook (Step 3)."""
    text = str(text).lower()
    text = re.sub(r"http\S+|\S+@\S+", " ", text)
    text = re.sub(r"[^a-z+#\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def stem(word):
    """Tiny suffix stemmer (no downloads needed): databases->database, administrator->administr."""
    w = word
    for suf in ("ators", "ator", "ations", "ation", "ments", "ment", "ings", "ing", "ies", "ers", "er", "ed", "es", "s"):
        if w.endswith(suf) and len(w) - len(suf) >= 3:
            w = w[: -len(suf)]
            break
    if w.endswith("y") and len(w) > 4:
        w = w[:-1] + "i"
    elif w.endswith("e") and len(w) > 4:
        w = w[:-1]          # database / databases -> databas
    return w


def stems_of(text):
    return [stem(w) for w in clean_text(text).split()]


FILLER_STEMS = {stem(w) for w in FILLER}


def _phrase_present(phrase, token_stems_joined):
    """True if the phrase (as stems) appears in the stemmed text as consecutive words."""
    p = " ".join(stem(w) for w in clean_text(phrase).split())
    return f" {p} " in f" {token_stems_joined} " if p else False


# ---------- the bot ----------
class CareerBot:
    def __init__(self, model_path="role_model.pkl", tfidf_path="tfidf.pkl"):
        self.model = joblib.load(model_path)
        self.tfidf = joblib.load(tfidf_path)
        self.names = self.tfidf.get_feature_names_out()

    # --- role prediction ---
    def top_roles(self, text, k=3):
        vec = self.tfidf.transform([clean_text(text)])
        scores = self.model.decision_function(vec)[0] * CONF_SCALE
        e = np.exp(scores - scores.max())
        probs = e / e.sum()
        order = probs.argsort()[::-1][:k]
        return [(str(self.model.classes_[i]), float(probs[i])) for i in order]

    # --- skills ---
    @staticmethod
    def skills_in(text):
        joined = " ".join(stems_of(text))
        return {s for s in SKILLS if _phrase_present(s, joined)}

    # --- keywords ---
    def keywords_missing(self, resume_text, jd_text, n=10, pool=100, skip_words=()):
        """Important job-description terms that the resume lacks (stem-aware, filler removed)."""
        resume_joined = " ".join(stems_of(resume_text))
        resume_set = set(resume_joined.split())
        skip_stems = {stem(w) for phrase in skip_words for w in clean_text(phrase).split()}
        jd_vec = self.tfidf.transform([clean_text(jd_text)]).toarray()[0]
        out = []
        for i in jd_vec.argsort()[::-1][:pool]:
            if jd_vec[i] <= 0:
                break
            term = self.names[i]
            if " " in term:
                continue                     # single words only: bigrams were mostly noise
            parts = [stem(p) for p in term.split()]
            if any(p in FILLER_STEMS or p in skip_stems for p in parts):
                continue
            if all(p in resume_set for p in parts):
                continue
            out.append(term)
        return out[:n]

    # --- full comparison ---
    def compare(self, resume_text, jd_text):
        r_top, j_top = self.top_roles(resume_text), self.top_roles(jd_text)
        r_skills, j_skills = self.skills_in(resume_text), self.skills_in(jd_text)
        matched = sorted(j_skills & r_skills)
        missing_skills = sorted(j_skills - r_skills)
        missing_kw = self.keywords_missing(resume_text, jd_text, skip_words=j_skills)

        # score: 70% skill coverage (if the JD lists skills), 30% role match
        role_match = r_top[0][0] == j_top[0][0]
        if j_skills:
            skill_cov = len(matched) / len(j_skills)
            score = round(100 * (0.7 * skill_cov + 0.3 * (1.0 if role_match else 0.0)))
        else:
            jd_vec = self.tfidf.transform([clean_text(jd_text)]).toarray()[0]
            rs = set(stems_of(resume_text))
            idx = [i for i in jd_vec.argsort()[::-1][:60] if jd_vec[i] > 0]
            idx = [i for i in idx if not any(stem(p) in FILLER_STEMS for p in self.names[i].split())]
            hit = sum(all(stem(p) in rs for p in self.names[i].split()) for i in idx)
            score = round(100 * (0.7 * (hit / len(idx) if idx else 0) + 0.3 * (1.0 if role_match else 0.0)))

        return {
            "resume_roles": r_top, "jd_roles": j_top, "role_match": role_match,
            "low_confidence": r_top[0][1] < LOW_CONFIDENCE,
            "matched_skills": matched, "missing_skills": missing_skills,
            "missing_keywords": missing_kw, "score": int(score),
        }


# ---------- file reading ----------
def read_upload(name, data):
    """Extract text from an uploaded PDF or TXT (bytes)."""
    if name.lower().endswith(".pdf"):
        import io
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(data))
        return "\n".join((p.extract_text() or "") for p in reader.pages)
    return data.decode("utf-8", errors="ignore")


# ---------- chat formatting ----------
HELP = (
    "**How to use me**\n\n"
    "1. Paste your **resume** (or upload a PDF/TXT in the sidebar).\n"
    "2. Paste a **job description**.\n"
    "3. I'll show the role match, a score out of 100, missing skills and keywords.\n\n"
    "Type `new` to start over, `jd` to swap in a different job description, `help` to see this again."
)


def format_resume_reply(roles, low_conf):
    lines = ["**Resume read.** Top role matches:"]
    for role, p in roles:
        lines.append(f"- {role.title()}: {p:.0%}")
    if low_conf:
        lines.append("\n⚠️ *Low confidence: this resume doesn't fit the dataset's 24 job categories well "
                     "(students and AI/ML profiles often don't). Treat the role guess as rough.*")
    lines.append("\nNow paste a **job description** to compare.")
    return "\n".join(lines)


def format_compare_reply(r):
    jd_role, jd_p = r["jd_roles"][0]
    res_role, res_p = r["resume_roles"][0]
    out = [f"### Match score: {r['score']}/100",
           f"- Resume looks like: **{res_role.title()}** ({res_p:.0%})",
           f"- Job description looks like: **{jd_role.title()}** ({jd_p:.0%})",
           f"- Role match: **{'YES' if r['role_match'] else 'NO'}**"]
    if r["low_confidence"]:
        out.append("- ⚠️ *Resume role prediction is low confidence, so rely more on the skills below.*")
    out.append("\n**Skills you already show:** " + (", ".join(r["matched_skills"]) or "none found"))
    out.append("\n**Skills to add (in the job description, not in your resume):** "
               + (", ".join(r["missing_skills"]) or "none 🎉"))
    out.append("\n**Other missing keywords:** " + (", ".join(r["missing_keywords"]) or "none"))
    out.append("\nOnly add skills you really have. Paste another job description, or type `new` to start over.")
    return "\n".join(out)


def looks_like_text_block(msg, min_words=25):
    return len(msg.split()) >= min_words
