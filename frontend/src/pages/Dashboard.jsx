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

  useEffect(() => {
    fetch("http://localhost:5000/analytics")
      .then(res => res.json())
      .then(data => {
        setTrend(data.sentimentTrend || []);
        setMood(data.moodCount || {});
      });
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

      <div className="bg-white dark:bg-card p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">
          Sentiment Trend
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          How your emotional tone changes over time
        </p>

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
                position: "bottom",
                labels: {
                  color: "#9ca3af"
                }
              }
            },
            scales: {
              x: {
                ticks: { color: "#9ca3af" },
                grid: { display: false }
              },
              y: {
                min: -1,
                max: 1,
                ticks: { color: "#9ca3af" },
                grid: { color: "rgba(0,0,0,0.05)" }
              }
            }
          }}
        />
      </div>

      
      <div className="bg-white dark:bg-card p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold">
          Mood Distribution
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          How often each mood appears
        </p>

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
                      "#f59e0b"  // Anxious / Stressed
                    ],
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 16,
                      color: "#9ca3af"
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
