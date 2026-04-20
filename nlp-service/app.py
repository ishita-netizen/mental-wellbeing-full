from flask import Flask, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()

# 🔧 Clean text
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)   # remove URLs
    text = re.sub(r"[^a-zA-Z\s]", "", text)  # remove special chars
    return text.strip()

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"error": "Text is required"}), 400

        raw_text = data["text"]
        text = preprocess_text(raw_text)

        if not text:
            return jsonify({"error": "Empty text after cleaning"}), 400

        # 🔥 Sentiment analysis
        scores = analyzer.polarity_scores(text)
        score = scores["compound"]

        # 🔥 Better thresholds (tuned)
        if score >= 0.4:
            severity = "Low"
        elif score >= -0.4:
            severity = "Moderate"
        else:
            severity = "High"

        return jsonify({
            "original_text": raw_text,
            "cleaned_text": text,
            "score": score,
            "severity": severity,
            "details": scores   # optional (debugging)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)
