import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [trend, setTrend] = useState([]);
  const [mood, setMood] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://mental-backend-heru.onrender.com/api/analytics")
      .then(res => res.json())
      .then(data => {
        setTrend(data.sentimentTrend || []);
        setMood(data.moodCount || {});
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Server is waking up... try again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        ⏳ Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* 📈 Line Chart */}
      <div className="bg-white dark:bg-card p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">
          Sentiment Trend
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          How your emotional tone changes over time
        </p>

        {trend.length === 0 ? (
          <p className="text-gray-400 text-center">
            No data yet
          </p>
        ) : (
          <Line
            data={{
              labels: trend.map(t => t.date),
              datasets: [
                {
                  label: "Sentiment Score",
                  data: trend.map(t => t.score),
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(99,102,241,0.2)",
                  pointBackgroundColor: "#6366f1",
                  pointRadius: 4,
                  tension: 0.4,
                  fill: true
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom"
                }
              },
              scales: {
                y: {
                  min: -1,
                  max: 1
                }
              }
            }}
          />
        )}
      </div>

      {/* 🥧 Pie Chart */}
      <div className="bg-white dark:bg-card p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">
          Mood Distribution
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          How often each mood appears
        </p>

        {Object.keys(mood).length === 0 ? (
          <p className="text-gray-400 text-center">
            No data yet
          </p>
        ) : (
          <div className="flex justify-center">
            <div className="w-64">
              <Pie
                data={{
                  labels: Object.keys(mood),
                  datasets: [
                    {
                      data: Object.values(mood),
                      backgroundColor: [
                        "#22c55e", // Happy
                        "#6366f1", // Neutral
                        "#ef4444", // Sad
                        "#f59e0b", // Stress
                        "#a855f7"  // extra safety color
                      ]
                    }
                  ]
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom"
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
