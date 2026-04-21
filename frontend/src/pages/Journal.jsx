import { useState } from "react";

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // store last submitted data
  const [lastText, setLastText] = useState("");
  const [lastMood, setLastMood] = useState("");

  const handleSubmit = async () => {
    if (!text || !mood) {
      setError("Please write something and select a mood.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        "https://mental-backend-heru.onrender.com/api/entry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text, mood })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // store everything
      setResult(data.data);
      setLastText(text);
      setLastMood(mood);

      // clear input
      setText("");
      setMood("");

    } catch (err) {
      setError("Server is waking up... try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8 text-center">
        🧠 AI Journal
      </h1>

      {/* INPUT CARD */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-5">

        <textarea
          className="w-full p-4 rounded-lg border"
          rows="5"
          placeholder="Write your thoughts..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <select
          className="w-full p-3 rounded-lg border"
          value={mood}
          onChange={e => setMood(e.target.value)}
        >
          <option value="">Select your mood</option>
          <option>Happy</option>
          <option>Neutral</option>
          <option>Sad</option>
          <option>Anxious</option>
          <option>Stressed</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Analyzing..." : "Save Entry"}
        </button>

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-8 bg-white shadow rounded-xl p-6 space-y-4">

          <h2 className="text-xl font-semibold">
            🔍 Analysis Result
          </h2>

          {/* USER ENTRY */}
          <div className="p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-500">Your Entry:</p>
            <p>{lastText}</p>
          </div>

          {/* USER MOOD */}
          <div className="p-3 bg-blue-100 rounded">
            <p className="text-sm text-gray-500">Your Mood:</p>
            <p className="font-semibold">{lastMood}</p>
          </div>

          {/* NLP PREDICTED MOOD */}
          <div className="p-3 bg-green-100 rounded">
            <p className="text-sm text-gray-500">Predicted Mood (AI):</p>
            <p className="font-semibold">
              {result.predictedMood || "Not available"}
            </p>
          </div>

          {/* MATCH / MISMATCH */}
          <div>
            {lastMood === result.predictedMood ? (
              <p className="text-green-600">
                ✅ Your mood matches your expression
              </p>
            ) : (
              <p className="text-red-600">
                ⚠ Your mood and expression differ
              </p>
            )}
          </div>

          {/* ANALYSIS */}
          <p>
            <b>Mismatch:</b>{" "}
            {result.mismatch ? "Yes" : "No"}
          </p>

          <p>
            <b>Perception:</b> {result.perceptionType}
          </p>

          {/* INSIGHTS */}
          {result.perceptionType === "Masking Stress" && (
            <p className="text-yellow-600">
              ⚠ You might be hiding stress behind positive emotions.
            </p>
          )}

          {result.perceptionType === "Resilience" && (
            <p className="text-green-600">
              💪 You are emotionally strong.
            </p>
          )}

          {result.perceptionType === "Aligned" && (
            <p className="text-blue-600">
              👍 Your emotions are aligned.
            </p>
          )}

        </div>
      )}
    </div>
  );
}
