import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/analytics')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  const data = {
    labels: ['Original Size', 'Compressed Size', 'Saved Size'],
    datasets: [
      {
        label: 'Size (KB)',
        data: [
          stats.totalOriginal / 1024,
          stats.totalCompressed / 1024,
          stats.totalSaved / 1024
        ],
        backgroundColor: ['#f87171', '#60a5fa', '#34d399']
      }
    ]
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">📊 Analytics</h2>
      <p>Total Compressions: {stats.total}</p>
      <p>Total Saved: {(stats.totalSaved / 1024).toFixed(2)} KB ({stats.percentSaved.toFixed(2)}%)</p>
      <div className="w-full md:w-2/3">
        <Bar data={data} />
      </div>
    </div>
  );
}