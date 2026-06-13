import React, { useState, useEffect } from 'react'
import { Clock, Plus, Trash2, Settings, Globe, Sun, Moon } from 'lucide-react'

interface TimeZone {
  id: string
  name: string
  timezone: string
  offset: number
  isFavorite: boolean
  color: string
}

interface ClockTime {
  hours: string
  minutes: string
  seconds: string
  period: string
  fullDate: string
}

const TIMEZONES = [
  { name: 'مكة المكرمة', timezone: 'Asia/Riyadh', offset: 3, color: 'from-amber-500' },
  { name: 'دبي', timezone: 'Asia/Dubai', offset: 4, color: 'from-blue-500' },
  { name: 'بغداد', timezone: 'Asia/Baghdad', offset: 3, color: 'from-orange-500' },
  { name: 'القاهرة', timezone: 'Africa/Cairo', offset: 2, color: 'from-yellow-600' },
  { name: 'بيروت', timezone: 'Asia/Beirut', offset: 2, color: 'from-red-500' },
  { name: 'إسطنبول', timezone: 'Europe/Istanbul', offset: 3, color: 'from-purple-500' },
  { name: 'لندن', timezone: 'Europe/London', offset: 0, color: 'from-slate-500' },
  { name: 'نيويورك', timezone: 'America/New_York', offset: -5, color: 'from-cyan-500' },
  { name: 'لوس أنجلوس', timezone: 'America/Los_Angeles', offset: -8, color: 'from-green-500' },
  { name: 'طوكيو', timezone: 'Asia/Tokyo', offset: 9, color: 'from-pink-500' },
  { name: 'سيدني', timezone: 'Australia/Sydney', offset: 10, color: 'from-teal-500' },
  { name: 'باريس', timezone: 'Europe/Paris', offset: 1, color: 'from-indigo-500' },
]

export default function DigitalClockApp() {
  const [timeZones, setTimeZones] = useState<TimeZone[]>([
    {
      id: '1',
      name: 'مكة المكرمة',
      timezone: 'Asia/Riyadh',
      offset: 3,
      isFavorite: true,
      color: 'from-amber-500',
    },
    {
      id: '2',
      name: 'نيويورك',
      timezone: 'America/New_York',
      offset: -5,
      isFavorite: true,
      color: 'from-cyan-500',
    },
    {
      id: '3',
      name: 'طوكيو',
      timezone: 'Asia/Tokyo',
      offset: 9,
      isFavorite: true,
      color: 'from-pink-500',
    },
  ])
  const [times, setTimes] = useState<Record<string, ClockTime>>({})
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showAddZone, setShowAddZone] = useState(false)
  const [selectedTimezone, setSelectedTimezone] = useState('')
  const [is24HourFormat, setIs24HourFormat] = useState(true)
  const [currentLocalTime, setCurrentLocalTime] = useState<ClockTime>({
    hours: '00',
    minutes: '00',
    seconds: '00',
    period: 'AM',
    fullDate: '',
  })

  // Update time every second
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date()

      // Local time
      setCurrentLocalTime(formatTime(now, is24HourFormat))

      // Update all timezones
      const newTimes: Record<string, ClockTime> = {}
      timeZones.forEach((tz) => {
        const tzTime = new Date(now.toLocaleString('en-US', { timeZone: tz.timezone }))
        newTimes[tz.id] = formatTime(tzTime, is24HourFormat)
      })
      setTimes(newTimes)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [timeZones, is24HourFormat])

  const formatTime = (date: Date, is24Hour: boolean): ClockTime => {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    let period = 'AM'

    if (!is24Hour) {
      period = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12
    }

    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ]
    const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

    const fullDate = `${arabicDays[date.getDay()]}, ${date.getDate()} ${arabicMonths[date.getMonth()]} ${date.getFullYear()}`

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      period,
      fullDate,
    }
  }

  const addTimeZone = () => {
    if (!selectedTimezone) {
      alert('الرجاء اختيار منطقة زمنية')
      return
    }

    const selected = TIMEZONES.find((tz) => tz.timezone === selectedTimezone)
    if (selected) {
      const newTimeZone: TimeZone = {
        id: Date.now().toString(),
        name: selected.name,
        timezone: selected.timezone,
        offset: selected.offset,
        isFavorite: false,
        color: selected.color,
      }
      setTimeZones([...timeZones, newTimeZone])
      setSelectedTimezone('')
      setShowAddZone(false)
    }
  }

  const removeTimeZone = (id: string) => {
    setTimeZones(timeZones.filter((tz) => tz.id !== id))
  }

  const toggleFavorite = (id: string) => {
    setTimeZones(
      timeZones.map((tz) =>
        tz.id === id ? { ...tz, isFavorite: !tz.isFavorite } : tz
      )
    )
  }

  const isDayTime = (hours: number) => {
    return hours >= 6 && hours < 18
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      {/* Header */}
      <header className={`${
        isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-blue-200'
      } backdrop-blur-md border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} size={32} />
              <h1 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ⏰ ساعة عالمية
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIs24HourFormat(!is24HourFormat)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isDarkMode
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                }`}
              >
                {is24HourFormat ? '24 ساعة' : '12 ساعة'}
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition ${
                  isDarkMode
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Local Time Display */}
        <div className={`${
          isDarkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-white to-blue-50'
        } rounded-2xl p-8 mb-12 shadow-2xl border ${
          isDarkMode ? 'border-slate-600' : 'border-blue-200'
        }`}>
          <h2 className={`text-lg font-semibold mb-6 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-600'
          }`}>
            🌍 توقيتك المحلي
          </h2>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className={`text-8xl font-bold tracking-tighter mb-4 font-mono ${
                isDarkMode ? 'text-cyan-300' : 'text-blue-600'
              }`}>
                {currentLocalTime.hours}:{currentLocalTime.minutes}
              </div>
              {!is24HourFormat && (
                <div className={`text-2xl font-semibold ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-600'
                }`}>
                  {currentLocalTime.period}
                </div>
              )}
              <div className={`text-sm mt-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLocalTime.fullDate}
              </div>
              <div className={`text-xs mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                الثواني: {currentLocalTime.seconds}
              </div>
            </div>
          </div>
        </div>

        {/* Add New Timezone */}
        {!showAddZone ? (
          <button
            onClick={() => setShowAddZone(true)}
            className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-semibold transition mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg"
          >
            <Plus size={24} /> إضافة منطقة زمنية جديدة
          </button>
        ) : (
          <div className={`${
            isDarkMode ? 'bg-slate-700' : 'bg-white'
          } rounded-xl p-6 mb-8 border ${
            isDarkMode ? 'border-slate-600' : 'border-gray-200'
          }`}>
            <div className="flex gap-4">
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                  isDarkMode
                    ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-400'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none`}
              >
                <option value="">اختر منطقة زمنية...</option>
                {TIMEZONES.map((tz) => (
                  <option key={tz.timezone} value={tz.timezone}>
                    {tz.name} (UTC{tz.offset > 0 ? '+' : ''}{tz.offset})
                  </option>
                ))}
              </select>
              <button
                onClick={addTimeZone}
                className="px-6 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                إضافة
              </button>
              <button
                onClick={() => setShowAddZone(false)}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  isDarkMode
                    ? 'bg-slate-600 text-white hover:bg-slate-500'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Timezones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timeZones.map((tz) => {
            const time = times[tz.id]
            const hours = parseInt(time?.hours || '0')
            const isDaytime = isDayTime(hours)

            return (
              <div
                key={tz.id}
                className={`relative rounded-2xl overflow-hidden shadow-xl transition transform hover:scale-105 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-white'
                } border-2 ${
                  tz.isFavorite
                    ? isDarkMode
                      ? 'border-yellow-500'
                      : 'border-yellow-400'
                    : isDarkMode
                      ? 'border-slate-600'
                      : 'border-gray-200'
                }`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tz.color} to-transparent opacity-10`} />

                {/* Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {isDaytime ? (
                    <Sun className="text-yellow-400" size={20} />
                  ) : (
                    <Moon className="text-blue-300" size={20} />
                  )}
                </div>

                {/* Content */}
                <div className="relative p-8 z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {tz.name}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        UTC{tz.offset > 0 ? '+' : ''}{tz.offset}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(tz.id)}
                      className={`text-2xl transition ${tz.isFavorite ? 'text-yellow-400' : isDarkMode ? 'text-gray-400' : 'text-gray-300'}`}
                    >
                      ⭐
                    </button>
                  </div>

                  {/* Time Display */}
                  {time && (
                    <div className="mb-6">
                      <div className={`text-5xl font-bold tracking-tighter font-mono mb-3 ${
                        isDarkMode ? 'text-cyan-300' : 'text-blue-600'
                      }`}>
                        {time.hours}:{time.minutes}
                      </div>
                      <div className="flex items-center justify-between">
                        {!is24HourFormat && (
                          <span className={`text-lg font-semibold ${
                            isDarkMode ? 'text-purple-300' : 'text-purple-600'
                          }`}>
                            {time.period}
                          </span>
                        )}
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {time.seconds}s
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className={`text-xs mb-6 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {time?.fullDate}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeTimeZone(tz.id)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                      isDarkMode
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    <Trash2 className="inline mr-2" size={16} /> حذف
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {timeZones.length === 0 && (
          <div className={`text-center py-16 rounded-xl border-2 border-dashed ${
            isDarkMode ? 'border-slate-600' : 'border-gray-300'
          }`}>
            <Globe className={`mx-auto mb-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} size={48} />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              لا توجد مناطق زمنية مضافة
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`${
        isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-200'
      } border-t backdrop-blur-md mt-12`}>
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            ⏰ ساعة عالمية احترافية | تحديث فوري كل ثانية
          </p>
        </div>
      </footer>
    </div>
  )
}
