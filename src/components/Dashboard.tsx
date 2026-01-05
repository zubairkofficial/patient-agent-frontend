import { Search, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Dummy data
  const balance = 86924.02;
  const cashflow = 6528.21;
  const inflow = 8453.43;
  const outflow = 2322.03;
  const inflowChange = 3;
  const outflowChange = 3;

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Chart data (simplified - in real app, use a charting library)
  const chartData = [
    { month: 'JAN', value: 40000 },
    { month: 'FEB', value: 45000 },
    { month: 'MAR', value: 50000 },
    { month: 'APR', value: 55000 },
    { month: 'MAY', value: 60000 },
    { month: 'JUN', value: 59453, highlighted: true },
    { month: 'JUL', value: 65000 },
    { month: 'AUG', value: 70000 },
    { month: 'SEP', value: 75000 },
    { month: 'OCT', value: 86924 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = 0;

  // Calculate percentages for cashflow
  const totalCashflow = inflow + outflow;
  const inflowPercent = (inflow / totalCashflow) * 100;
  const outflowPercent = (outflow / totalCashflow) * 100;

  return (
    <div className="w-full h-full">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hey, Kevin</h1>
          <p className="text-sm text-slate-500 mt-1">{currentDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            This month
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            Move money
          </Button>
        </div>
      </div>

      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Balance</h2>
            <Button variant="outline" size="sm" className="text-sm">
              Move money
            </Button>
          </div>
          
          <div className="mb-6">
            <p className="text-4xl font-bold text-slate-900">
              {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Bar Chart */}
          <div className="mt-8">
            <div className="flex items-end justify-between gap-2 h-48 mb-4">
              {chartData.map((data, index) => {
                const height = ((data.value - minValue) / (maxValue - minValue)) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative">
                    <div
                      className={`w-full rounded-t transition-all ${
                        data.highlighted
                          ? 'bg-orange-500 hover:bg-orange-600'
                          : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                      style={{ height: `${height}%` }}
                    >
                      {data.highlighted && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          ${data.value.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 mt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
            {/* Y-axis labels */}
            <div className="flex justify-between text-xs text-slate-400 px-1">
              <span>0</span>
              <span>10k</span>
              <span>20k</span>
              <span>40k</span>
              <span>80k</span>
              <span>120k</span>
            </div>
          </div>
        </div>

        {/* Cashflow Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Cashflow</h2>
            <button className="text-sm text-slate-600 hover:text-slate-800 underline">
              View more
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-4xl font-bold text-slate-900">
              {cashflow.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Inflow/Outflow Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">
                  {inflow.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })} in
                </span>
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{inflowChange}% vs last month
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">
                  {outflow.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })} out
                </span>
                <span className="text-sm text-red-600 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  +{outflowChange}% vs last month
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${inflowPercent}%` }}
                />
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${outflowPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{inflowPercent.toFixed(0)}%</span>
                <span>{outflowPercent.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

