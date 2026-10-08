# CareerCraft AI

Two implementations of one idea (helping job seekers match a resume to a job), plus an integration between them.

| | `java-app/` | `ml-service/` |
|---|---|---|
| Purpose | Full web app: JD Decoder, Resume Enhancer, LinkedIn Builder, Culture Analyzer, Interview Simulator | Resume role classifier and job-match bot |
| Stack | Java 17, Spring Boot 3.2, JPA, H2/MySQL, vanilla JS, Gemini API | Python, scikit-learn (TF-IDF + Linear SVM), FastAPI, Streamlit |
| Course | Advanced Java Programming Lab | Machine Learning mini project |
| Built by | Manasvi Sawant | Usmeet |

## How they connect

```
Browser ──► Spring Boot (8085) ──REST/JSON──► FastAPI ML service (8000)
             tool: resume-matcher               POST /match, /predict-role
```

The Spring app treats the ML service as one more `CareerTool` (`ResumeMatcher`). Each project still runs on its own.

## Run locally

### Terminal 1: ML service (FastAPI)
```bash
cd ml-service
python -m uvicorn api:app --port 8000
# or run: .\run.ps1
# test page: http://localhost:8000/docs
```

### Terminal 2: Java app (Spring Boot)
**Option A (IntelliJ IDEA):**
Open `java-app` in IntelliJ IDEA and click **Run** on `CareerCraftApplication.java`.

**Option B (PowerShell using bundled Maven/JDK):**
```powershell
cd java-app
.\run.ps1
# or if 'mvn' is in PATH: mvn spring-boot:run
# web app: http://localhost:8085
```

Or run both with Docker: `docker compose up --build`

## Credits

The Java web app is by Manasvi Sawant. The ML model, bot and FastAPI service are by Usmeet. The ML report cites the original CareerCraft AI idea from Manasvi's Gen AI Academy deck.

## Limitations

See the ML project report: the 0-100 match score is a heuristic, the dataset has no AI/ML category, and matching is keyword based, not semantic.
