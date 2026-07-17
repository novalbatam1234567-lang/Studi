import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Moon, Sun, Bell, Volume2 } from 'lucide-react'

const FocusMode = () => {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [mode, setMode] = useState('pomodoro') // pomodoro, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const intervalRef = useRef(null)
  const audioRef = useRef(null)

  const modes = {
    pomodoro: { label: 'Fokus', duration: 25 * 60, color: 'from-red-500 to-orange-500' },
    shortBreak: { label: 'Istirahat Pendek', duration: 5 * 60, color: 'from-green-500 to-teal-500' },
    longBreak: { label: 'Istirahat Panjang', duration: 15 * 60, color: 'from-blue-500 to-purple-500' }
  }

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted')
      })
    }

    // Create audio for notification sound
    audioRef.current = new Audio('/notification.mp3')
    audioRef.current.volume = 0.5

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused])

  const handleTimerComplete = () => {
    setIsActive(false)
    setIsPaused(false)
    
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error)
    }

    if (notificationsEnabled && Notification.permission === 'granted') {
      new Notification('Studi - Timer Selesai', {
        body: mode === 'pomodoro' ? 'Waktu fokus selesai! Istirahat sejenak.' : 'Istirahat selesai! Siap fokus lagi?',
        icon: '/icon-192.png'
      })
    }

    if (mode === 'pomodoro') {
      setSessionsCompleted(prev => prev + 1)
      // Auto-switch to break
      if (sessionsCompleted % 4 === 3) {
        setMode('longBreak')
        setTimeLeft(modes.longBreak.duration)
      } else {
        setMode('shortBreak')
        setTimeLeft(modes.shortBreak.duration)
      }
    } else {
      setMode('pomodoro')
      setTimeLeft(modes.pomodoro.duration)
    }
  }

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true)
      setIsPaused(false)
    } else if (isPaused) {
      setIsPaused(false)
    } else {
      setIsPaused(true)
    }
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(modes[mode].duration)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setTimeLeft(modes[newMode].duration)
    setIsActive(false)
    setIsPaused(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 lg:pb-0 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="section-header">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Focus Mode</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 text-sm sm:text-base`}>
              Teknik Pomodoro untuk produktivitas maksimal
            </p>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-600'}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
          {Object.entries(modes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
                mode === key
                  ? `bg-gradient-to-r ${value.color} text-white shadow-lg`
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className={`card bg-gradient-to-br ${modes[mode].color} text-white shadow-2xl`}>
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-48 sm:w-64 h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={toggleTimer}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
              >
                {!isActive ? <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5" /> : isPaused ? <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-0.5" /> : <Pause className="w-6 h-6 sm:w-8 sm:h-8" />}
              </button>
              
              <button
                onClick={resetTimer}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Session Counter */}
        <div className={`card ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <div>
                <p className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sesi Selesai</p>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {sessionsCompleted} sesi hari ini
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < (sessionsCompleted % 4)
                      ? 'bg-green-500'
                      : isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className={`card ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`section-title mb-4 text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pengaturan</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Suara Notifikasi</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  soundEnabled ? 'bg-primary-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notifikasi Browser</span>
              </div>
              <button
                onClick={() => {
                  if ('Notification' in window) {
                    Notification.requestPermission().then(permission => {
                      setNotificationsEnabled(permission === 'granted')
                    })
                  }
                }}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-primary-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FocusMode