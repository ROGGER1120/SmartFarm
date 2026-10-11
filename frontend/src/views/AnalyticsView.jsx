import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3, TrendingUp, Droplet, DollarSign, Sprout, RefreshCw } from 'lucide-react';
import { api } from '../api';

const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function AnalyticsView({ farmId }) {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmId) loadCharts();
  }, [farmId]);

  const loadCharts = async () => {
    try {
      setLoading(true);
      const data = await api.getChartsData(farmId);
      setCharts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading analytics graphs & visual metrics...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Resource & Financial Analytics Dashboard
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Visual insights into resource consumption patterns, seasonal expenses and crop-level profitability
        </p>
      </div>

      {/* Grid of Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '24px'
      }}>
        {/* 1. Monthly Category Spending Breakdown */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Monthly Cultivation Expenses Trend (₹)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Stacked view of Water, Fertilizer, Labour, and Machinery monthly costs
          </p>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.monthlySpending} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, '']} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="Water" stackId="a" fill="#0284c7" />
                <Bar dataKey="Fertilizer" stackId="a" fill="#10b981" />
                <Bar dataKey="Labour" stackId="a" fill="#f59e0b" />
                <Bar dataKey="Machinery" stackId="a" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Water Consumption: Planned vs Actual Trends */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Water Usage: Planned vs Actual (Litres)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Comparison over irrigation cycles with abnormal consumption points
          </p>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.waterTrends} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${Number(val).toLocaleString()} L`, '']} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Line type="monotone" dataKey="plannedLiters" stroke="#059669" strokeWidth={2} name="Planned Quota" />
                <Line type="monotone" dataKey="actualLiters" stroke="#ef4444" strokeWidth={2.5} name="Actual Usage" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Fertilizer Consumption by Brand/Product */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Fertilizer Cost Distribution
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            NPK, Urea, DAP and organic manure cost allocation
          </p>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.fertilizerChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="cost"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {charts?.fertilizerChart?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Total Cost']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Labour Expenses by Specialization Role */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Labour Wage Distribution by Role (₹)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Spraying, weeding, tractor driving and harvesting wages
          </p>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.labourRoleChart} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 10 }} width={110} />
                <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Wages Paid']} />
                <Bar dataKey="amount" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Crop-wise Expense vs Projected Revenue */}
        <div className="card" style={{ padding: '20px', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            Crop-Wise Economics: Cultivation Cost vs Projected Revenue (₹)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Comparing cumulative resource inputs with anticipated crop harvest value
          </p>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.cropExpenses} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, '']} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="totalCost" fill="#ef4444" name="Cumulative Production Cost" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expectedRevenue" fill="#10b981" name="Projected Harvest Value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
