import { useData } from '../contexts/DataContext'
import { Clock, AlertCircle, Plus, Video, MapPin, TrendingUp } from 'lucide-react'
import { format, isToday, isAfter, isBefore, addMinutes } from 'date-fns'
import { id } from 'date-fns/locale'

const Dashboard = () => {
  const { getUpcomingClass, getTodayDeadlines, tasks, calculateIPK } = useData()
  const upcomingClass = getUpcomingClass()
  const todayDeadlines = getTodayDeadlines()
  const ipk = calculateIPK()

  const now = new Date()
  const currentTime = format(now, 'HH:mm')

  const getNextClass = () => {
    if (!upcomingClass) return null
    const classTime = new Date()
    const [hours, minutes] = upcomingClass.time.split(':')
    classTime.setHours(parseInt(hours), parseInt(minutes), 0)
    
    if (isAfter(classTime, now)) {
      return upcomingClass
    }
    return null
  }

  const nextClass = getNextClass()

  const quickActions = [
    { 
      title: 'Tambah Tugas', 
      icon: Plus, 
      color: 'bg-primary-500',
      href: '/tasks'
    },
    { 
      title: 'Simulasi Nilai', 
      icon: TrendingUp, 
      color: 'bg-accent-500',
      href: '/ipk-simulator'
    },
    { 
      title: 'Cek Kantin', 
      icon: MapPin, 
      color: 'bg-green-500',
      href: '#'
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-20 lg:pb-0">
      {/* Welcome Section */}
      <div className="section-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {format(now, 'EEEE, d MMMM yyyy', { locale: id })}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Semangat belajar! 📚</p>
        </div>
      </div>

      {/* Now & Next Section */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white !p-4 sm:!p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          <h2 className="font-semibold text-sm sm:text-base">Sekarang & Nanti</h2>
        </div>
        
        {nextClass ? (
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-primary-100 mb-1">Kelas Berikutnya</p>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 truncate">{nextClass.course}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      {nextClass.time} - {nextClass.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      {nextClass.room}
                    </span>
                  </div>
                </div>
                {nextClass.type === 'online' && nextClass.link && (
                  <a
                    href={nextClass.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-primary-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2 text-xs sm:text-sm flex-shrink-0"
                  >
                    <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Join</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <p className="text-primary-100 text-sm sm:text-base">Tidak ada kelas lagi hari ini 🎉</p>
          </div>
        )}
      </div>

      {/* Today's Deadlines */}
      <div>
        <div className="section-header">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            <h2 className="section-title text-base sm:text-lg">Deadline Hari Ini</h2>
          </div>
          <span className="text-xs sm:text-sm text-gray-500">{todayDeadlines.length} tugas</span>
        </div>

        {todayDeadlines.length > 0 ? (
          <div className="space-y-3">
            {todayDeadlines.map((task) => (
              <div key={task.id} className="card">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{task.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 truncate">{task.course}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
                        Deadline: {format(task.deadline, 'HH:mm')}
                      </span>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    task.status === 'completed' 
                      ? 'bg-green-500' 
                      : task.status === 'in_progress'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-6 sm:py-8">
            <p className="text-gray-500 text-sm sm:text-base">Tidak ada deadline hari ini ✨</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="section-title mb-3 sm:mb-4 text-base sm:text-lg">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <a
                key={action.title}
                href={action.href}
                className="card hover:shadow-lg transition-all duration-200 group cursor-pointer !p-4"
              >
                <div className={`${action.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{action.title}</h3>
              </a>
            )
          })}
        </div>
      </div>

      {/* IPK Summary */}
      <div className="card bg-gradient-to-r from-accent-500 to-accent-600 text-white !p-4 sm:!p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-accent-100 mb-1">Prestasi Akademik</p>
            <p className="text-2xl sm:text-3xl font-bold">{ipk}</p>
            <p className="text-xs sm:text-sm text-accent-100 mt-1">IPK Kumulatif</p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-accent-100">Total SKS</p>
            <p className="text-lg sm:text-xl font-semibold">21</p>
            <p className="text-xs sm:text-sm text-accent-100 mt-1">SKS Lulus</p>
          </div>
        </div>
      </div>

      {/* IPK Details */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white !p-4 sm:!p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-primary-100 mb-1">Detail Akademik</p>
            <p className="text-lg sm:text-xl font-bold">Semester 3</p>
            <p className="text-xs sm:text-sm text-primary-100 mt-1">Total 21 SKS</p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-primary-100">IPK Saat Ini</p>
            <p className="text-2xl sm:text-3xl font-bold">3.45</p>
            <p className="text-xs sm:text-sm text-primary-100 mt-1">Target: 3.50</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
