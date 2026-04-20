from flask import Flask, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from flask_cors import CORS
import os
import re

app = Flask(__name__)
CORS(app)  # 🔥 allow frontend/backend access

analyzer = SentimentIntensityAnalyzer()

# 🔧 Clean text (keep emojis for better sentiment)
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)   # remove URLs
    text = re.sub(r"\s+", " ", text)      # normalize spaces
    return text.strip()


# ✅ HEALTH CHECK ROUTE (IMPORTANT FOR RENDER)
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "NLP Service Running 🚀"})


# ✅ MAIN ANALYZE ROUTE
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()

        # ✅ validation
        if not data or "text" not in data:
            return jsonify({"error": "Text is required"}), 400

        raw_text = data["text"]

        if not isinstance(raw_text, str) or raw_text.strip() == "":
            return jsonify({"error": "Invalid or empty text"}), 400

        # 🔥 preprocess
        text = preprocess_text(raw_text)

        # 🔥 sentiment analysis
        scores = analyzer.polarity_scores(text)
        score = scores["compound"]

        # 🔥 improved severity logic
        if score >= 0.5:
            severity = "Low"          # positive
        elif score >= -0.5:
            severity = "Moderate"     # neutral
        else:
            severity = "High"         # negative

        return jsonify({
            "success": True,
            "original_text": raw_text,
            "cleaned_text": text,
            "score": score,
            "severity": severity,
            "details": scores
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ✅ IMPORTANT FOR LOCAL + RENDER DEPLOYMENT
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
