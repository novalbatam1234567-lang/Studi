import { useData } from '../contexts/DataContext'
import { MapPin, Video, Clock, Navigation, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'

const Schedule = () => {
  const { schedule } = useData()
  const [currentLocation, setCurrentLocation] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
  const today = days[new Date().getDay()] || 'Senin'

  useEffect(() => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied')
        }
      )
    }

    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted')
      })
    }
  }, [])

  const sendNotification = (message) => {
    if (notificationsEnabled && Notification.permission === 'granted') {
      new Notification('Studi - Pengingat Kelas', {
        body: message,
        icon: '/icon-192.png'
      })
    }
  }

  const getLocationReminder = (classItem) => {
    if (classItem.type === 'online') {
      return 'Kelas online - siapkan koneksi internet'
    }
    return `Pindah ke ${classItem.building} - ${classItem.room}`
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Jadwal Kuliah</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Kelola jadwal kuliah mingguan Anda</p>
      </div>

      {/* GPS Status */}
      <div className="card">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              currentLocation ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Navigation className={`w-4 h-4 sm:w-5 sm:h-5 ${
                currentLocation ? 'text-green-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Lokasi GPS</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {currentLocation ? 'Aktif - Notifikasi pintar menyala' : 'Nonaktif - Aktifkan untuk notifikasi'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setCurrentLocation({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    })
                    sendNotification('GPS aktif! Notifikasi kelas dinyalakan.')
                  },
                  (error) => {
                    alert('Gagal mengakses lokasi. Pastikan izin lokasi diberikan.')
                  }
                )
              }
            }}
            className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 flex-shrink-0"
          >
            {currentLocation ? 'Refresh' : 'Aktifkan'}
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto pb-4">
        {days.map((day) => {
          const daySchedule = schedule.filter(item => item.day === day)
          const isToday = day === today
          
          return (
            <div key={day} className={`card ${isToday ? 'ring-2 ring-primary-500' : ''}`}>
              <div className={`text-center mb-3 sm:mb-4 pb-3 border-b ${
                isToday ? 'border-primary-200' : 'border-gray-100'
              }`}>
                <h3 className={`font-semibold text-sm sm:text-base ${isToday ? 'text-primary-600' : 'text-gray-900'}`}>
                  {day}
                </h3>
                {isToday && <span className="text-xs text-primary-500">Hari Ini</span>}
              </div>

              <div className="space-y-2 sm:space-y-3">
                {daySchedule.length > 0 ? (
                  daySchedule.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-2 sm:p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => sendNotification(getLocationReminder(item))}
                    >
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 truncate">
                        {item.course}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{item.time} - {item.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {item.type === 'online' ? (
                          <>
                            <Video className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span className="text-blue-600">Online</span>
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-auto flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Join
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{item.room}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs sm:text-sm text-gray-400 py-4">
                    Tidak ada kelas
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              notificationsEnabled ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${
                notificationsEnabled ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Notifikasi Kelas</p>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {notificationsEnabled ? 'Aktif - Dapat pengingat kelas' : 'Nonaktif'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                  setNotificationsEnabled(permission === 'granted')
                  if (permission === 'granted') {
                    sendNotification('Notifikasi aktif! Anda akan mendapat pengingat kelas.')
                  }
                })
              }
            }}
            className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 flex-shrink-0"
          >
            {notificationsEnabled ? 'Aktif' : 'Aktifkan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Schedule
