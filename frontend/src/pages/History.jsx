import { useEffect, useState } from "react";

export default function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://mental-backend-heru.onrender.com/api/entry")
      .then(res => res.json())
      .then(data => {
        setEntries(data?.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load history");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading history...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Journal History</h1>

      {entries.length === 0 ? (
        <p className="text-gray-500">No entries yet</p>
      ) : (
        <div className="space-y-4">
          {entries.map((e) => {
            const predicted =
              e.predictedMood || e.predicted_mood || "N/A"; // ✅ FIX

            return (
              <div
                key={e._id}
                className="p-4 rounded-xl shadow bg-white dark:bg-card"
              >
                <p className="text-sm text-gray-400">
                  {new Date(e.createdAt).toLocaleString()}
                </p>

                <p className="mt-2">{e.text}</p>

                <div className="mt-3 flex flex-wrap gap-2 text-sm">

                  <span className="px-2 py-1 bg-blue-100 rounded">
                    Mood: {e.mood}
                  </span>

                  <span className="px-2 py-1 bg-green-100 rounded">
                    AI: {predicted}
                  </span>

                  <span className="px-2 py-1 bg-gray-100 rounded">
                    Score: {e.sentimentScore}
                  </span>

                  <span className="px-2 py-1 bg-purple-100 rounded">
                    {e.perceptionType}
                  </span>

                  {e.mismatch && (
                    <span className="px-2 py-1 bg-red-100 rounded text-red-600">
                      ⚠ Mismatch
                    </span>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
