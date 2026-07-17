import { useData } from '../contexts/DataContext'
import { TrendingUp, RotateCcw, Info } from 'lucide-react'
import { useState } from 'react'

const IPKSimulator = () => {
  const { grades, updateGrade, calculateIPK } = useData()
  const [simulatedGrades, setSimulatedGrades] = useState(grades)
  const [originalIPK, setOriginalIPK] = useState(calculateIPK())

  const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'E']
  const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'E': 0.0 }

  const calculateSimulatedIPK = () => {
    let totalPoints = 0
    let totalSKS = 0
    
    simulatedGrades.forEach(grade => {
      totalPoints += (gradePoints[grade.grade] || 0) * grade.sks
      totalSKS += grade.sks
    })
    
    return totalSKS > 0 ? (totalPoints / totalSKS).toFixed(2) : '0.00'
  }

  const handleGradeChange = (id, newGrade) => {
    setSimulatedGrades(simulatedGrades.map(g => g.id === id ? { ...g, grade: newGrade } : g))
  }

  const resetSimulation = () => {
    setSimulatedGrades(grades)
  }

  const simulatedIPK = calculateSimulatedIPK()
  const ipkChange = (parseFloat(simulatedIPK) - parseFloat(originalIPK)).toFixed(2)
  const isImprovement = parseFloat(ipkChange) > 0

  const getGradeColor = (grade) => {
    const point = gradePoints[grade] || 0
    if (point >= 3.7) return 'bg-green-100 text-green-700'
    if (point >= 3.0) return 'bg-blue-100 text-blue-700'
    if (point >= 2.0) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-20 lg:pb-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Simulasi IPK</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Simulasikan perubahan nilai untuk melihat dampaknya pada IPK</p>
      </div>

      {/* IPK Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <p className="text-xs sm:text-sm text-gray-500">IPK Saat Ini</p>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{originalIPK}</p>
        </div>

        <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-100" />
            <p className="text-xs sm:text-sm text-primary-100">IPK Simulasi</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <p className="text-2xl sm:text-3xl font-bold">{simulatedIPK}</p>
            {ipkChange !== '0.00' && (
              <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                isImprovement ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
              }`}>
                {isImprovement ? '+' : ''}{ipkChange}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetSimulation}
        className="btn-secondary flex items-center gap-2 text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Reset Simulasi
      </button>

      {/* Grade List */}
      <div>
        <h2 className="section-title mb-3 sm:mb-4 text-base sm:text-lg">Daftar Mata Kuliah</h2>
        <div className="space-y-3 sm:space-y-4">
          {simulatedGrades.map((grade) => (
            <div key={grade.id} className="card">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{grade.course}</h3>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span>{grade.sks} SKS</span>
                    <span>Semester {grade.semester}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">Nilai:</span>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-end">
                    {gradeOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleGradeChange(grade.id, option)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm ${
                          grade.grade === option
                            ? getGradeColor(option) + ' ring-2 ring-offset-2 ring-primary-500'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-900 mb-1 text-sm sm:text-base">Cara Penggunaan</p>
            <p className="text-xs sm:text-sm text-blue-700">
              Klik pada huruf nilai untuk mengubahnya secara simulasi. IPK akan dihitung ulang secara real-time.
              Gunakan fitur ini untuk merencanakan target nilai Anda di semester mendatang.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IPKSimulator
