import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Zap, Target, AlertCircle, Download, RefreshCw } from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  totalExports: number
  totalShares: number
  averageMarkup: number
  topPlatform: string
  topExportFormat: string
}

interface ChartData {
  label: string
  value: number
  percentage: number
}

interface Dashboard {
  isDarkMode: boolean
}

export default function Dashboard({ isDarkMode }: Dashboard) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalExports: 0,
    totalShares: 0,
    averageMarkup: 0,
    topPlatform: 'Facebook',
    topExportFormat: 'PNG',
  })

  const [platformStats, setPlatformStats] = useState<ChartData[]>([
    { label: 'Facebook', value: 45, percentage: 35 },
    { label: 'WhatsApp', value: 38, percentage: 29 },
    { label: 'Twitter', value: 28, percentage: 22 },
    { label: 'Telegram', value: 18, percentage: 14 },
  ])

  const [exportStats, setExportStats] = useState<ChartData[]>([
    { label: 'PNG', value: 52, percentage: 40 },
    { label: 'JPG', value: 35, percentage: 27 },
    { label: 'JSON', value: 28, percentage: 21 },
    { label: 'CSV', value: 15, percentage: 12 },
  ])

  const [markupTrend, setMarkupTrend] = useState<ChartData[]>([
    { label: '5%', value: 15, percentage: 12 },
    { label: '10%', value: 35, percentage: 27 },
    { label: '15%', value: 42, percentage: 32 },
    { label: '20%', value: 21, percentage: 16 },
    { label: '25%+', value: 17, percentage: 13 },
  ])

  const [timeRange, setTimeRange] = useState('week')
  const [isLoading, setIsLoading] = useState(false)

  // Load stats from localStorage
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = () => {
    setIsLoading(true)
    setTimeout(() => {
      try {
        const savedStats = localStorage.getItem('marketing_app_stats')
        if (savedStats) {
          const parsedStats = JSON.parse(savedStats)
          setStats(parsedStats)
        } else {
          // Generate mock data
          setStats({
            totalProducts: 127,
            totalExports: 89,
            totalShares: 156,
            averageMarkup: 14.5,
            topPlatform: 'Facebook',
            topExportFormat: 'PNG',
          })
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
      setIsLoading(false)
    }, 500)
  }

  const exportDashboard = () => {
    const dashboardData = {
      stats,
      platformStats,
      exportStats,
      markupTrend,
      exportedAt: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(dashboardData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `dashboard_${new Date().getTime()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const StatCard = ({ icon: Icon, label, value, unit, color, trend }: any) => (
    <div className={`${
      isDarkMode ? 'bg-slate-700' : 'bg-white'
    } rounded-xl p-6 shadow-lg border ${
      isDarkMode ? 'border-slate-600' : 'border-gray-200'
    } hover:shadow-xl transition`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-green-500 text-sm font-semibold">
            <TrendingUp size={16} /> {trend}%
          </span>
        )}
      </div>
      <p className={`text-sm font-medium mb-2 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {label}
      </p>
      <p className={`text-3xl font-bold mb-1 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {value}
        <span className={`text-lg ml-1 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {unit}
        </span>
      </p>
    </div>
  )

  const ChartBar = ({ label, value, percentage, color }: any) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </span>
        <span className={`text-sm font-bold ${
          isDarkMode ? 'text-blue-300' : 'text-blue-600'
        }`}>
          {value}
        </span>
      </div>
      <div className={`w-full h-3 rounded-full overflow-hidden ${
        isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
      }`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-xs mt-1 block ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {percentage}%
      </span>
    </div>
  )

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={32} />
              <h1 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📊 لوحة المعلومات
              </h1>
            </div>
            <button
              onClick={loadStats}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                  : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
              }`}
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Time Range Selector */}
        <div className="flex gap-3 mb-8">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                timeRange === range
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range === 'day' && 'اليوم'}
              {range === 'week' && 'هذا الأسبوع'}
              {range === 'month' && 'هذا الشهر'}
              {range === 'year' && 'هذا العام'}
            </button>
          ))}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Zap}
            label="إجمالي المنتجات"
            value={stats.totalProducts}
            unit="منتج"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            trend="+12"
          />
          <StatCard
            icon={Download}
            label="إجمالي التصديرات"
            value={stats.totalExports}
            unit="مرة"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            trend="+8"
          />
          <StatCard
            icon={Users}
            label="إجمالي المشاركات"
            value={stats.totalShares}
            unit="مشاركة"
            color="bg-gradient-to-br from-green-500 to-green-600"
            trend="+25"
          />
          <StatCard
            icon={Target}
            label="متوسط النسبة"
            value={stats.averageMarkup.toFixed(1)}
            unit="%"
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            trend="+5"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Platform Statistics */}
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-6 shadow-lg border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              📱 إحصائيات المنصات
            </h2>
            {platformStats.map((stat) => (
              <ChartBar
                key={stat.label}
                label={stat.label}
                value={stat.value}
                percentage={stat.percentage}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
            ))}
          </div>

          {/* Export Format Statistics */}
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-6 shadow-lg border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              💾 صيغ التصدير
            </h2>
            {exportStats.map((stat) => (
              <ChartBar
                key={stat.label}
                label={stat.label}
                value={stat.value}
                percentage={stat.percentage}
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
            ))}
          </div>

          {/* Markup Trend */}
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-6 shadow-lg border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              📈 نسب الزيادة
            </h2>
            {markupTrend.map((stat) => (
              <ChartBar
                key={stat.label}
                label={stat.label}
                value={stat.value}
                percentage={stat.percentage}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            ))}
          </div>
        </div>

        {/* Pie Chart Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Platform Pie */}
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-8 shadow-lg border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              🎯 توزيع المنصات
            </h2>
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="8"
                    strokeDasharray="99 264"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className={`text-3xl font-bold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      35%
                    </p>
                    <p className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Facebook
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {platformStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {stat.label}
                    </span>
                  </div>
                  <span className={`font-bold ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {stat.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-8 shadow-lg border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              ⚡ إحصائيات سريعة
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                background: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
              }}>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  أعلى منصة
                </span>
                <span className={`font-bold text-lg ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {stats.topPlatform}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                background: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'
              }}>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  صيغة التصدير الأشهر
                </span>
                <span className={`font-bold text-lg ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {stats.topExportFormat}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                background: isDarkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)'
              }}>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  متوسط الإنتاجية
                </span>
                <span className={`font-bold text-lg ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {Math.round((stats.totalProducts + stats.totalExports + stats.totalShares) / 3)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg" style={{
                background: isDarkMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.05)'
              }}>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  معدل النمو
                </span>
                <span className={`font-bold text-lg text-green-500`}>
                  +15% ↑
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Alerts */}
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-8 shadow-lg border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <AlertCircle size={22} />
              التنبيهات المهمة
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className={`font-semibold mb-1 ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
                }`}>
                  ⚠️ استخدام التخزين
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-yellow-300' : 'text-yellow-600'
                }`}>
                  استخدام التخزين وصل إلى 75% من الحد الأقصى
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className={`font-semibold mb-1 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  💡 نصيحة
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  استخدم القوالب لتوفير الوقت وزيادة الإنتاجية
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className={`font-semibold mb-1 ${
                  isDarkMode ? 'text-green-400' : 'text-green-700'
                }`}>
                  ✅ الإنجاز
                </p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-green-300' : 'text-green-600'
                }`}>
                  تم الوصول إلى 100 مشاركة هذا الأسبوع!
                </p>
              </div>
            </div>
          </div>

          {/* Export Dashboard */}
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-8 shadow-lg border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              📥 تصدير البيانات
            </h2>
            <p className={`text-sm mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              ق�� بتصدير إحصائيات لوحة المعلومات بصيغ مختلفة للمزيد من التحليل
            </p>
            <div className="space-y-3">
              <button
                onClick={exportDashboard}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Download size={20} />
                تصدير JSON
              </button>
              <button className={`w-full px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                isDarkMode
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}>
                <Download size={20} />
                تصدير PDF
              </button>
              <button className={`w-full px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                isDarkMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}>
                <Download size={20} />
                تصدير CSV
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
