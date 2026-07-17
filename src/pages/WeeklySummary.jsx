import { useData } from '../contexts/DataContext'
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertTriangle, Award, Calendar, Target } from 'lucide-react'
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { id } from 'date-fns/locale'

const WeeklySummary = () => {
  const { tasks, calculateIPK } = useData()
  const ipk = calculateIPK()

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Sunday

  const weekTasks = tasks.filter(task => 
    isWithinInterval(task.deadline, { start: weekStart, end: weekEnd })
  )

  const completedTasks = weekTasks.filter(t => t.status === 'completed')
  const pendingTasks = weekTasks.filter(t => t.status !== 'completed')
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high')

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed' && t.deadline > now)
    .sort((a, b) => a.deadline - b.deadline)
    .slice(0, 3)

  const weeklyStats = {
    tasksCompleted: completedTasks.length,
    tasksTotal: weekTasks.length,
    completionRate: weekTasks.length > 0 ? Math.round((completedTasks.length / weekTasks.length) * 100) : 0,
    studyHours: 12, // Mock data
    focusSessions: 8 // Mock data
  }

  const getWeeklyMessage = () => {
    if (weeklyStats.completionRate >= 80) {
      return {
        icon: <Award className="w-6 h-6" />,
        title: "Luar Biasa!",
        message: "Minggu ini kamu sangat produktif! Pertahankan kinerja hebatmu.",
        color: "from-green-500 to-emerald-500"
      }
    } else if (weeklyStats.completionRate >= 50) {
      return {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Bagus!",
        message: "Kamu sudah menyelesaikan setengah tugas minggu ini. Terus semangat!",
        color: "from-blue-500 to-cyan-500"
      }
    } else {
      return {
        icon: <Target className="w-6 h-6" />,
        title: "Ayo Tingkatkan!",
        message: "Masih banyak tugas yang belum selesai. Fokus dan prioritaskan tugas penting.",
        color: "from-orange-500 to-red-500"
      }
    }
  }

  const weeklyMessage = getWeeklyMessage()

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Ringkasan Mingguan</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          {format(weekStart, 'd MMM', { locale: id })} - {format(weekEnd, 'd MMM yyyy', { locale: id })}
        </p>
      </div>

      {/* Weekly Message Card */}
      <div className={`card bg-gradient-to-r ${weeklyMessage.color} text-white`}>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-white/20 rounded-xl flex-shrink-0">
            {weeklyMessage.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold mb-1">{weeklyMessage.title}</h2>
            <p className="text-white/90 text-sm sm:text-base">{weeklyMessage.message}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            <p className="text-xs sm:text-sm text-gray-500">Tugas Selesai</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{weeklyStats.tasksCompleted}</p>
          <p className="text-xs text-gray-500">dari {weeklyStats.tasksTotal} tugas</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            <p className="text-xs sm:text-sm text-gray-500">Completion Rate</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{weeklyStats.completionRate}%</p>
          <p className="text-xs text-gray-500">minggu ini</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <p className="text-xs sm:text-sm text-gray-500">Jam Belajar</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{weeklyStats.studyHours}h</p>
          <p className="text-xs text-gray-500">minggu ini</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <p className="text-xs sm:text-sm text-gray-500">IPK Saat Ini</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{ipk}</p>
          <p className="text-xs text-gray-500">target: 3.5</p>
        </div>
      </div>

      {/* Proactive Notifications */}
      <div className="card bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          <h2 className="font-semibold text-amber-900 text-sm sm:text-base">Notifikasi Proaktif</h2>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          {highPriorityTasks.length > 0 && (
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <p className="text-xs sm:text-sm text-amber-900">
                ⚠️ Ada <strong>{highPriorityTasks.length} tugas prioritas tinggi</strong> yang belum selesai. Segera kerjakan!
              </p>
            </div>
          )}

          {upcomingTasks.length > 0 && (
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <p className="text-xs sm:text-sm text-amber-900 mb-2">📅 Tugas mendatang yang perlu diperhatikan:</p>
              <ul className="space-y-1">
                {upcomingTasks.map(task => (
                  <li key={task.id} className="text-xs sm:text-sm text-amber-800">
                    • {task.title} - {format(task.deadline, 'd MMM', { locale: id })}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {weeklyStats.completionRate < 50 && (
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <p className="text-xs sm:text-sm text-amber-900">
                🎯 Tingkatkan produktivitas dengan menggunakan Focus Mode untuk sesi belajar yang lebih efektif!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div>
          <h2 className="section-title mb-3 sm:mb-4 text-base sm:text-lg">Tugas Mendatang</h2>
          <div className="space-y-2 sm:space-y-3">
            {upcomingTasks.map(task => (
              <div key={task.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{task.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 truncate">{task.course}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className={`badge text-xs ${
                        task.priority === 'high' 
                          ? 'badge-high' 
                          : task.priority === 'medium'
                          ? 'badge-medium'
                          : 'badge-low'
                      }`}>
                        {task.priority === 'high' ? 'Tinggi' : task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(task.deadline, 'EEEE, d MMM HH:mm', { locale: id })}
                      </span>
                    </div>
                  </div>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeeklySummary