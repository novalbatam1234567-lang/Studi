import { createContext, useContext, useState, useEffect } from 'react'
import { format, addDays, startOfWeek, isToday, isBefore, isAfter } from 'date-fns'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const [schedule, setSchedule] = useState([])
  const [tasks, setTasks] = useState([])
  const [grades, setGrades] = useState([])
  const [notifications, setNotifications] = useState([])

  // Mock data initialization
  useEffect(() => {
    // Mock schedule data
    const mockSchedule = [
      { id: 1, course: 'Pemrograman Web', day: 'Senin', time: '08:00', endTime: '10:00', room: 'A-101', building: 'Gedung A', type: 'offline', link: null },
      { id: 2, course: 'Struktur Data', day: 'Senin', time: '13:00', endTime: '15:00', room: 'B-205', building: 'Gedung B', type: 'offline', link: null },
      { id: 3, course: 'Basis Data', day: 'Selasa', time: '10:00', endTime: '12:00', room: 'Zoom', building: 'Online', type: 'online', link: 'https://zoom.us/j/123456789' },
      { id: 4, course: 'Algoritma', day: 'Rabu', time: '08:00', endTime: '10:00', room: 'A-102', building: 'Gedung A', type: 'offline', link: null },
      { id: 5, course: 'Jaringan Komputer', day: 'Kamis', time: '14:00', endTime: '16:00', room: 'C-301', building: 'Gedung C', type: 'offline', link: null },
    ]
    setSchedule(mockSchedule)

    // Mock tasks data
    const mockTasks = [
      { id: 1, title: 'Tugas Pemrograman Web', course: 'Pemrograman Web', deadline: new Date(), priority: 'high', status: 'pending', description: 'Buat aplikasi toko online dengan React' },
      { id: 2, title: 'Resume Ekonomi', course: 'Ekonomi', deadline: addDays(new Date(), 1), priority: 'medium', status: 'pending', description: 'Resume bab 1-3' },
      { id: 3, title: 'Laporan Praktikum Basis Data', course: 'Basis Data', deadline: addDays(new Date(), 3), priority: 'high', status: 'in_progress', description: 'ERD dan implementasi SQL' },
      { id: 4, title: 'Quiz Algoritma', course: 'Algoritma', deadline: addDays(new Date(), 5), priority: 'medium', status: 'pending', description: 'Quiz materi sorting dan searching' },
    ]
    setTasks(mockTasks)

    // Mock grades data
    const mockGrades = [
      { id: 1, course: 'Pemrograman Web', sks: 3, grade: 'A', semester: 1 },
      { id: 2, course: 'Matematika Diskrit', sks: 3, grade: 'B+', semester: 1 },
      { id: 3, course: 'Bahasa Inggris', sks: 2, grade: 'A', semester: 1 },
      { id: 4, course: 'Pendidikan Pancasila', sks: 2, grade: 'A-', semester: 1 },
      { id: 5, course: 'Struktur Data', sks: 4, grade: 'B', semester: 2 },
      { id: 6, course: 'Basis Data', sks: 3, grade: 'A-', semester: 2 },
      { id: 7, course: 'Algoritma', sks: 4, grade: 'B+', semester: 2 },
    ]
    setGrades(mockGrades)
  }, [])

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), status: 'pending' }])
  }

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status } : task))
  }

  const updateGrade = (id, grade) => {
    setGrades(grades.map(g => g.id === id ? { ...g, grade } : g))
  }

  const calculateIPK = () => {
    const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'E': 0.0 }
    let totalPoints = 0
    let totalSKS = 0
    
    grades.forEach(grade => {
      totalPoints += (gradePoints[grade.grade] || 0) * grade.sks
      totalSKS += grade.sks
    })
    
    return totalSKS > 0 ? (totalPoints / totalSKS).toFixed(2) : '0.00'
  }

  const getTodaySchedule = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const today = days[new Date().getDay()]
    return schedule.filter(item => item.day === today).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getTodayDeadlines = () => {
    return tasks.filter(task => isToday(task.deadline) && task.status !== 'completed')
  }

  const getUpcomingClass = () => {
    const todaySchedule = getTodaySchedule()
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    return todaySchedule.find(item => item.time > currentTime) || todaySchedule[0]
  }

  return (
    <DataContext.Provider value={{
      schedule,
      tasks,
      grades,
      notifications,
      addTask,
      updateTaskStatus,
      updateGrade,
      calculateIPK,
      getTodaySchedule,
      getTodayDeadlines,
      getUpcomingClass
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
