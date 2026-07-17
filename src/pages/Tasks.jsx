import { useData } from '../contexts/DataContext'
import { Camera, Plus, CheckCircle, Clock, AlertCircle, XCircle, Upload } from 'lucide-react'
import { useState, useRef } from 'react'
import Tesseract from 'tesseract.js'

const Tasks = () => {
  const { tasks, addTask, updateTaskStatus } = useData()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showOCR, setShowOCR] = useState(false)
  const [ocrResult, setOcrResult] = useState('')
  const [ocrLoading, setOcrLoading] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    course: '',
    deadline: '',
    priority: 'medium',
    description: ''
  })
  const fileInputRef = useRef(null)

  const handleOCR = async (file) => {
    setOcrLoading(true)
    try {
      const result = await Tesseract.recognize(file, 'ind', {
        logger: (m) => console.log(m)
      })
      setOcrResult(result.data.text)
      
      // Simple parsing to extract task info
      const lines = result.data.text.split('\n').filter(line => line.trim())
      if (lines.length > 0) {
        setNewTask(prev => ({
          ...prev,
          title: lines[0] || prev.title,
          description: lines.slice(1).join(' ') || prev.description
        }))
      }
    } catch (error) {
      console.error('OCR Error:', error)
      alert('Gagal memproses gambar. Coba lagi.')
    } finally {
      setOcrLoading(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleOCR(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTask.title || !newTask.deadline) {
      alert('Mohon lengkapi judul dan deadline tugas')
      return
    }
    
    addTask({
      ...newTask,
      deadline: new Date(newTask.deadline)
    })
    
    setNewTask({
      title: '',
      course: '',
      deadline: '',
      priority: 'medium',
      description: ''
    })
    setOcrResult('')
    setShowAddForm(false)
    setShowOCR(false)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'in_progress':
        return 'Sedang Dikerjakan'
      default:
        return 'Belum Dikerjakan'
    }
  }

  const filteredTasks = tasks.filter(task => task.status !== 'completed')

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-20 lg:pb-0">
      <div className="section-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Daftar Tugas</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Kelola tugas dan deadline kuliah Anda</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setShowOCR(!showOCR)}
            className="btn-secondary !p-2 sm:!p-3"
            title="Scan dengan OCR"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary !p-2 sm:!p-3 sm:!px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">Tambah Tugas Baru</h2>
            <button
              onClick={() => {
                setShowAddForm(false)
                setShowOCR(false)
                setOcrResult('')
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setShowOCR(false)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
                  !showOCR ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Input Manual
              </button>
              <button
                type="button"
                onClick={() => setShowOCR(true)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  showOCR ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Camera className="w-4 h-4" />
                Scan OCR
              </button>
            </div>

            {showOCR && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <p className="font-medium text-blue-900">Scan Tugas</p>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Upload foto tugas atau pengumuman dosen untuk otomatis mengisi detail tugas
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={ocrLoading}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  {ocrLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Gambar</span>
                    </>
                  )}
                </button>
                {ocrResult && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Hasil Scan:</p>
                    <p className="text-sm text-gray-700">{ocrResult}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Judul Tugas</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="input-field"
                placeholder="Contoh: Tugas Pemrograman Web"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mata Kuliah</label>
              <input
                type="text"
                value={newTask.course}
                onChange={(e) => setNewTask({...newTask, course: e.target.value})}
                className="input-field"
                placeholder="Contoh: Pemrograman Web"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="datetime-local"
                value={newTask.deadline}
                onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="input-field"
              >
                <option value="high">Tinggi</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="input-field min-h-[100px] resize-none"
                placeholder="Detail instruks tugas..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setShowOCR(false)
                  setOcrResult('')
                }}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button type="submit" className="btn-primary flex-1">
                Simpan Tugas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                  className="mt-1"
                >
                  {getStatusIcon(task.status)}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500">{task.course}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {task.priority === 'high' ? 'Tinggi' : task.priority === 'medium' ? 'Sedang' : 'Rendah'}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(task.deadline).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : task.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {task.status !== 'in_progress' && task.status !== 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      Mulai
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada tugas aktif 🎉</p>
          </div>
        )}
      </div>

      {/* Completed Tasks Toggle */}
      {tasks.some(t => t.status === 'completed') && (
        <details className="card">
          <summary className="cursor-pointer font-medium text-gray-700">
            Tampilkan Tugas Selesai ({tasks.filter(t => t.status === 'completed').length})
          </summary>
          <div className="mt-4 space-y-3">
            {tasks.filter(t => t.status === 'completed').map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-400 line-through">{task.title}</p>
                  <p className="text-sm text-gray-400">{task.course}</p>
                </div>
                <button
                  onClick={() => updateTaskStatus(task.id, 'pending')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Buka Kembali
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

export default Tasks
