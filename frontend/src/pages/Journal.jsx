import { useState } from "react";

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [lastText, setLastText] = useState("");
  const [lastMood, setLastMood] = useState(""); // ✅ NEW

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

      // ✅ STORE LAST VALUES
      setResult(data.data);
      setLastText(text);
      setLastMood(mood);

      // clear input
      setText("");
      setMood("");

    } catch (err) {
      setError("Server is waking up... please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-8 text-center">
        Daily Journal
      </h1>

      {/* INPUT */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-5">

        <textarea
          className="w-full p-4 rounded-lg border"
          rows="6"
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
          <option value="Happy">Happy</option>
          <option value="Neutral">Neutral</option>
          <option value="Sad">Sad</option>
          <option value="Anxious">Anxious</option>
          <option value="Stressed">Stressed</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-blue-600 text-white"
        >
          {loading ? "Analyzing..." : "Save Entry"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-8 bg-white shadow rounded-xl p-6">

          <h2 className="text-xl font-semibold mb-4">
            Analysis Result
          </h2>

          {/* 📝 ENTRY */}
          <div className="mb-4 p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-500">Your Entry:</p>
            <p>{lastText}</p>
          </div>

          {/* 😊 MOOD */}
          <div className="mb-4 p-3 bg-blue-100 rounded">
            <p className="text-sm text-gray-500">Your Mood:</p>
            <p className="font-semibold">{lastMood}</p>
          </div>

          {/* 🧠 RESULT */}
          <p>
            <b>Mismatch:</b>{" "}
            <span className={result.mismatch ? "text-red-500" : "text-green-500"}>
              {result.mismatch ? "Yes" : "No"}
            </span>
          </p>

          <p>
            <b>Perception:</b>{" "}
            <span className="text-blue-500">
              {result.perceptionType}
            </span>
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
