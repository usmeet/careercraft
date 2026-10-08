"""Train the role classifier from Resume.csv and save role_model.pkl + tfidf.pkl.

Usage:  python train.py [path/to/Resume.csv]
"""
import sys
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report

from bot_core import clean_text


def main(csv_path="Resume.csv"):
    data = pd.read_csv(csv_path)[["Resume_str", "Category"]].dropna()
    data["clean"] = data["Resume_str"].apply(clean_text)
    print("total resumes:", len(data))

    x_train, x_test, y_train, y_test = train_test_split(
        data["clean"], data["Category"], test_size=0.2, random_state=42, stratify=data["Category"]
    )

    tfidf = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=20000, sublinear_tf=True)
    x_train_vec = tfidf.fit_transform(x_train)
    x_test_vec = tfidf.transform(x_test)

    # class_weight="balanced" helps small categories (e.g. BPO) that have few resumes
    model = LinearSVC(class_weight="balanced")
    model.fit(x_train_vec, y_train)

    pred = model.predict(x_test_vec)
    print("Accuracy:", round(accuracy_score(y_test, pred), 4))
    print(classification_report(y_test, pred))

    joblib.dump(model, "role_model.pkl")
    joblib.dump(tfidf, "tfidf.pkl")
    print("saved role_model.pkl and tfidf.pkl")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "Resume.csv")
