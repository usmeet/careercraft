# CareerCraft ML Service & Resume Bot

A machine learning pipeline for resume role classification and job-fit analysis using TF-IDF and Linear Support Vector Machines (Linear SVM).

## Directory Structure

- `api.py`: FastAPI REST API service (`/health`, `/predict-role`, `/match`) for integration with Spring Boot
- `bot_core.py`: NLP cleaning, skill matching, role prediction, and comparison algorithms
- `skills.py`: Curated dictionary of technical and domain skills
- `app.py`: Standalone Streamlit interactive chat UI
- `chat_cli.py`: Command-line interface for running evaluations
- `train.py`: Model training script from `Resume.csv`
- `role_model.pkl`: Pre-trained Linear SVM classifier
- `tfidf.pkl`: Pre-trained TF-IDF vectorizer
- `requirements.txt`: Python package dependencies
- `Dockerfile`: Container image configuration for `ml-service`
- `CareerCraft_ML.ipynb`: Training and experiment Jupyter notebook
- `docs/`: Academic project report PDF and reference decks

---

## Running Locally

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```
*(Make sure to match the scikit-learn version used during pickling if needed).*

### 2. Start the FastAPI Service (for CareerCraft integration)
```bash
uvicorn api:app --port 8000
```
Interactive API docs will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Run Standalone Streamlit Web UI
```bash
streamlit run app.py
```

### 4. Run CLI Evaluation
```bash
python chat_cli.py my_resume.txt job_description.txt
```

---

## Retraining the Model

If you have updated `Resume.csv`:
```bash
python train.py Resume.csv
```
This regenerates `role_model.pkl` and `tfidf.pkl`.
