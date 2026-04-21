import { useState } from "react";

export default function Journal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

      setResult(data.data);
      setLastText(text);
      setLastMood(mood);

      setText("");
      setMood("");

    } catch (err) {
      setError("Server is waking up... please try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-6 text-center">
        📝 Daily Journal
      </h1>

      <div className="bg-white dark:bg-card shadow-xl rounded-2xl p-6 space-y-5 border">

        <textarea
          className="w-full p-4 rounded-xl bg-gray-50 dark:bg-surface border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          rows="6"
          placeholder="Write about your day, thoughts, or feelings..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <select
          className="w-full p-3 rounded-xl bg-gray-50 dark:bg-surface border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={mood}
          onChange={e => setMood(e.target.value)}
        >
          <option value="">Select your mood</option>
          <option value="Happy">😊 Happy</option>
          <option value="Neutral">😐 Neutral</option>
          <option value="Sad">😢 Sad</option>
          <option value="Anxious">😟 Anxious</option>
          <option value="Stressed">😫 Stressed</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition shadow-md"
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
        <div className="mt-8 bg-white dark:bg-card shadow-xl rounded-2xl p-6 border">

          <h2 className="text-xl font-semibold mb-4">
            📊 Analysis Result
          </h2>

          <div className="space-y-3 text-sm">

            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">📝 Your Entry:</span>
              <p className="mt-1 text-gray-700">{lastText}</p>
            </div>

            <div className="flex gap-3 flex-wrap">

              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                😊 Entered Mood: {lastMood}
              </span>

              <span className={`px-3 py-1 rounded-full ${
                result.mismatch
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}>
                ⚖️ Alignment: {result.mismatch ? "Mismatch" : "Aligned"}
              </span>

              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                🧠 Perception Type: {result.perceptionType}
              </span>

            </div>

          </div>

          <p className="mt-4 text-xs text-gray-500">
            This analysis reflects language patterns and self-reported mood,
            not a medical diagnosis.
          </p>
        </div>
      )}
    </div>
  );
}
