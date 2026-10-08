FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
# Streamlit is only needed for app.py; skip it in the API image to keep it small
RUN grep -v '^streamlit' requirements.txt > req-api.txt && pip install --no-cache-dir -r req-api.txt
COPY bot_core.py skills.py api.py role_model.pkl tfidf.pkl ./
EXPOSE 8000
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
