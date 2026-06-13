import React, { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
  date: string
  products: number
  exports: number
  shares: number
  revenue?: number
}

interface Analytics {
  isDarkMode: boolean
}

const ANALYTICS_DATA: AnalyticsData[] = [
  { date: 'السبت', products: 12, exports: 8, shares: 24, revenue: 450 },
  { date: 'الأحد', products: 19, exports: 12, shares: 28, revenue: 580 },
  { date: 'الاثنين', products: 15, exports: 10, shares: 32, revenue: 520 },
  { date: 'الثلاثاء', products: 22, exports: 15, shares: 38, revenue: 720 },
  { date: 'الأربعاء', products: 18, exports: 14, shares: 35, revenue: 680 },
  { date: 'الخميس', products: 25, exports: 18, shares: 42, revenue: 850 },
  { date: 'الجمعة', products: 28, exports: 20, shares: 45, revenue: 920 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function AdvancedAnalytics({ isDarkMode }: Analytics) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'products' | 'exports' | 'shares'>('all')
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    const total = ANALYTICS_DATA.reduce((sum, item) => sum + (item.revenue || 0), 0)
    setTotalRevenue(total)
  }, [])

  const pieData = [
    { name: 'المنتجات', value: 139 },
    { name: 'التصديرات', value: 97 },
    { name: 'المشاركات', value: 244 },
  ]

  const chartColor = isDarkMode ? '#ffffff' : '#111827'
  const gridColor = isDarkMode ? '#475569' : '#e5e7eb'

  return (
    <div className={`min-h-screen ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      {/* Header */}
      <div className={`${
        isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-blue-200'
      } backdrop-blur-md border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            📈 التحليلات المتقدمة
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            {['line', 'bar'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type as 'line' | 'bar')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  chartType === type
                    ? isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'bg-slate-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                {type === 'line' ? '📈 خطي' : '📊 أعمدة'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['all', 'products', 'exports', 'shares'].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric as any)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  selectedMetric === metric
                    ? isDarkMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-500 text-white'
                    : isDarkMode
                      ? 'bg-slate-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                {metric === 'all' && 'الكل'}
                {metric === 'products' && 'المنتجات'}
                {metric === 'exports' && 'التصديرات'}
                {metric === 'shares' && 'المشاركات'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className={`${
          isDarkMode ? 'bg-slate-700' : 'bg-white'
        } rounded-xl p-8 shadow-lg border ${
          isDarkMode ? 'border-slate-600' : 'border-gray-200'
        } mb-8`}>
          <h2 className={`text-xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            النشاط الأسبوعي
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'line' ? (
              <LineChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={chartColor} />
                <YAxis stroke={chartColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: chartColor,
                  }}
                />
                <Legend />
                {(selectedMetric === 'all' || selectedMetric === 'products') && (
                  <Line type="monotone" dataKey="products" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="المنتجات" />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'exports') && (
                  <Line type="monotone" dataKey="exports" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="التصديرات" />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'shares') && (
                  <Line type="monotone" dataKey="shares" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} name="المشاركات" />
                )}
              </LineChart>
            ) : (
              <BarChart data={ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={chartColor} />
                <YAxis stroke={chartColor} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: chartColor,
                  }}
                />
                <Legend />
                {(selectedMetric === 'all' || selectedMetric === 'products') && (
                  <Bar dataKey="products" fill="#3b82f6" name="المنتجات" />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'exports') && (
                  <Bar dataKey="exports" fill="#10b981" name="التصديرات" />
                )}
                {(selectedMetric === 'all' || selectedMetric === 'shares') && (
                  <Bar dataKey="shares" fill="#f59e0b" name="المشاركات" />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-8 shadow-lg border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <h2 className={`text-xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              توزيع النشاط
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#475569' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: chartColor,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            {[
              { label: 'إجمالي الدخل', value: `${totalRevenue} د.إ`, color: 'from-green-500 to-green-600' },
              { label: 'متوسط يومي', value: `${Math.round(totalRevenue / 7)} د.إ`, color: 'from-blue-500 to-blue-600' },
              { label: 'أعلى يوم', value: '920 د.إ', color: 'from-purple-500 to-purple-600' },
              { label: 'أقل يوم', value: '450 د.إ', color: 'from-orange-500 to-orange-600' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 shadow-lg text-white`}
              >
                <p className="text-sm opacity-90 mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
