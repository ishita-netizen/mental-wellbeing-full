import { useState } from "react";

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

      setResult(data);
      setText("");
      setMood("");

    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-8 text-center">
        Daily Journal
      </h1>

      <div className="bg-white dark:bg-card shadow-lg rounded-xl p-6 space-y-5">
        <textarea
          className="w-full p-4 rounded-lg bg-gray-50 dark:bg-surface border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          rows="6"
          placeholder="Write about your day, thoughts, or feelings..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <select
          className="w-full p-3 rounded-lg bg-gray-50 dark:bg-surface border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition"
        >
          {loading ? "Analyzing..." : "Save Entry"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white dark:bg-card shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Analysis Result
          </h2>

          <div className="flex flex-col gap-2">
            <p>
              <span className="font-medium">Mismatch:</span>{" "}
              <span className={result.mismatch ? "text-red-500" : "text-green-500"}>
                {result.mismatch ? "Yes" : "No"}
              </span>
            </p>

            <p>
              <span className="font-medium">Perception Type:</span>{" "}
              <span className="text-blue-500">
                {result.perceptionType}
              </span>
            </p>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            This analysis reflects language patterns and self-reported mood,
            not a medical diagnosis.
          </p>
        </div>
      )}
    </div>
  );
}
