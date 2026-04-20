from flask import Flask, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")

    score = analyzer.polarity_scores(text)["compound"]

    if score >= 0.3:
        severity = "Low"
    elif score >= -0.3:
        severity = "Moderate"
    else:
        severity = "High"

    return jsonify({
        "score": score,
        "severity": severity
    })

if __name__ == "__main__":
    app.run(port=8000)
