import React, { useState, useEffect } from 'react';
import { historyApi } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Calendar, TrendingUp, Target } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoryData {
  history: Array<{
    taskId: number;
    title: string;
    isDone: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  chartData: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
  totalTasks: number;
  completedTasks: number;
}

interface WeeklyData {
  date: string;
  day: string;
  completed: number;
  total: number;
}

const HistoryPage: React.FC = () => {
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(30);

  useEffect(() => {
    loadHistoryData();
  }, [timeframe]);

  const loadHistoryData = async () => {
    try {
      const [historyResponse, weeklyResponse] = await Promise.all([
        historyApi.getHistory(timeframe),
        historyApi.getWeeklyStats()
      ]);
      
      setHistoryData(historyResponse.data);
      setWeeklyData(weeklyResponse.data.weeklyData || []);
    } catch (error) {
      console.error('Failed to load history data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0F380F',
        titleColor: '#9BBD0F',
        bodyColor: '#8BAC0F',
        borderColor: '#306230',
        borderWidth: 2,
        titleFont: {
          family: 'Press Start 2P',
          size: 8
        },
        bodyFont: {
          family: 'Press Start 2P',
          size: 8
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#306230'
        },
        ticks: {
          color: '#8BAC0F',
          font: {
            family: 'Press Start 2P',
            size: 8
          }
        }
      },
      y: {
        grid: {
          color: '#306230'
        },
        ticks: {
          color: '#8BAC0F',
          font: {
            family: 'Press Start 2P',
            size: 8
          }
        },
        beginAtZero: true
      }
    }
  };

  const chartData = {
    labels: historyData?.chartData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Completed',
        data: historyData?.chartData.map(d => d.completed) || [],
        borderColor: '#8BAC0F',
        backgroundColor: '#8BAC0F',
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#9BBD0F',
        pointBorderColor: '#306230',
        pointBorderWidth: 2
      },
      {
        label: 'Total',
        data: historyData?.chartData.map(d => d.total) || [],
        borderColor: '#306230',
        backgroundColor: '#306230',
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#306230',
        pointBorderColor: '#0F380F',
        pointBorderWidth: 2
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 animate-pulse">📊</div>
          <p className="font-pixel text-xs text-gameboy-light">Loading stats...</p>
        </div>
      </div>
    );
  }

  const completionRate = historyData && historyData.totalTasks > 0 
    ? Math.round((historyData.completedTasks / historyData.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <h1 className="font-pixel text-sm text-gameboy-lightest mb-4">Battle Statistics</h1>
        
        {/* Timeframe Selector */}
        <div className="flex space-x-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeframe(days)}
              className={`flex-1 font-pixel text-xs py-2 px-3 border-2 rounded transition-colors ${
                timeframe === days
                  ? 'bg-gameboy-light text-gameboy-dark border-gameboy-lightest'
                  : 'bg-gameboy-medium text-gameboy-lightest border-gameboy-border hover:border-gameboy-light'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard 
          icon={<Target size={14} />} 
          label="Completion" 
          value={`${completionRate}%`} 
        />
        <StatCard 
          icon={<TrendingUp size={14} />} 
          label="Completed" 
          value={historyData?.completedTasks || 0} 
        />
        <StatCard 
          icon={<Calendar size={14} />} 
          label="Total" 
          value={historyData?.totalTasks || 0} 
        />
      </div>

      {/* Line Chart */}
      {historyData && historyData.chartData.length > 0 && (
        <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
          <h3 className="font-pixel text-xs text-gameboy-lightest mb-4">Progress Chart</h3>
          <div className="h-48 bg-gameboy-medium border-2 border-gameboy-border rounded p-2">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Weekly Heatmap */}
      <div className="bg-gameboy-dark border-4 border-gameboy-border rounded-lg p-4">
        <h3 className="font-pixel text-xs text-gameboy-lightest mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-1">
          {(weeklyData || []).map((day, index) => {
            const intensity = day.total > 0 ? day.completed / day.total : 0;
            return (
              <div key={index} className="text-center">
                <div 
                  className={`w-full h-8 border border-gameboy-border rounded mb-1 flex items-center justify-center transition-all duration-200 ${
                    intensity >= 0.8 ? 'bg-gameboy-light' :
                    intensity >= 0.5 ? 'bg-gameboy-lightest opacity-75' :
                    intensity > 0 ? 'bg-gameboy-medium' : 'bg-gameboy-dark'
                  }`}
                  title={`${day.day}: ${day.completed}/${day.total} completed`}
                >
                  <span className="font-pixel text-xs text-gameboy-dark">
                    {day.completed > 0 ? day.completed : ''}
                  </span>
                </div>
                <p className="font-pixel text-xs text-gameboy-light">{day.day}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-gameboy-dark border-2 border-gameboy-border rounded-lg p-3 text-center hover:border-gameboy-light transition-colors">
    <div className="w-6 h-6 mx-auto mb-2 text-gameboy-light">
      {icon}
    </div>
    <p className="font-pixel text-xs text-gameboy-light mb-1">{label}</p>
    <p className="font-pixel text-xs text-gameboy-lightest">{value}</p>
  </div>
);

export default HistoryPage;