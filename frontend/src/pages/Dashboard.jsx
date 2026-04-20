import { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
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
  const [stats, setStats] = useState({
    avg: 0,
    dominant: "",
    total: 0,
    types: 0
  });

  useEffect(() => {
    fetch("https://mental-backend-heru.onrender.com/api/analytics")
      .then(res => res.json())
      .then(data => {
        const t = data.sentimentTrend || [];
        const m = data.moodCount || {};

        setTrend(t);
        setMood(m);

        // 🔥 Calculate stats
        const avg =
          t.reduce((sum, i) => sum + i.score, 0) / (t.length || 1);

        const dominant =
          Object.keys(m).reduce((a, b) =>
            m[a] > m[b] ? a : b
          , "");

        setStats({
          avg: avg.toFixed(2),
          dominant,
          total: t.length,
          types: Object.keys(m).length
        });
      });
  }, []);

  return (
    <div className="p-6 space-y-8">

      {/* 🔥 HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Mood Analytics</h1>
        <p className="text-gray-500">
          Track your emotional journey and discover patterns
        </p>
      </div>

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <Card title="Avg Sentiment" value={stats.avg} />
        <Card title="Dominant Mood" value={stats.dominant} />
        <Card title="Entries" value={stats.total} />
        <Card title="Mood Types" value={stats.types} />

      </div>

      {/* 🔥 CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* 📈 Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Sentiment Trend</h2>
          <p className="text-sm text-gray-500 mb-4">
            How your emotional tone changes over time
          </p>

          <Line
            data={{
              labels: trend.map(t => t.date),
              datasets: [
                {
                  label: "Sentiment",
                  data: trend.map(t => t.score),
                  borderColor: "#4f46e5",
                  backgroundColor: "rgba(79,70,229,0.2)",
                  tension: 0.4,
                  fill: true
                }
              ]
            }}
            options={{
              scales: {
                y: { min: -1, max: 1 }
              }
            }}
          />
        </div>

        {/* 🥧 Doughnut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Mood Distribution</h2>
          <p className="text-sm text-gray-500 mb-4">
            How often each mood appears
          </p>

          <Doughnut
            data={{
              labels: Object.keys(mood),
              datasets: [
                {
                  data: Object.values(mood),
                  backgroundColor: [
                    "#22c55e",
                    "#6366f1",
                    "#ef4444",
                    "#f59e0b"
                  ]
                }
              ]
            }}
          />
        </div>

      </div>

    </div>
  );
}

/* 🔥 CARD COMPONENT */
function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
