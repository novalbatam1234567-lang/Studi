import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate SSO login validation
    setTimeout(() => {
      // Mock user data after successful login
      const userData = {
        id: 1,
        name: 'Mahasiswa',
        email: email,
        university: 'Universitas Indonesia',
        major: 'Teknik Informatika',
        semester: 3,
        studentId: '12345678'
      }
      login(userData)
      navigate('/')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 sm:mb-6 shadow-xl">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Selamat Datang di Studi</h1>
          <p className="text-gray-600 text-sm sm:text-base">Asisten Akademik Pintar untuk Mahasiswa</p>
        </div>

        <div className="card shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Kampus
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="nama@kampus.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-9 sm:pl-10 text-sm sm:text-base"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Gunakan email domain .ac.id</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-9 sm:pl-10 text-sm sm:text-base"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span>Masuk...</span>
                </>
              ) : (
                <>
                  <span>Login dengan SSO</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>🎓 Auto-sync jadwal & nilai</span>
              <span>•</span>
              <span>📱 Notifikasi pintar</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Aplikasi ini akan otomatis menarik data dari SIAKAD kampus Anda
        </p>
      </div>
    </div>
  )
}

export default Login
