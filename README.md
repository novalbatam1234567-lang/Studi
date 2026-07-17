# Studi - Asisten Akademik Pintar 📚

Aplikasi web modern untuk membantu mahasiswa mengelola kehidupan akademik mereka dengan lebih efisien dan terorganisir.

## ✨ Fitur Utama

### 🏠 Dashboard
- Ringkasan harian dengan kelas berikutnya
- Deadline tugas hari ini
- Aksi cepat untuk berbagai fitur
- Display IPK real-time

### 📅 Jadwal Kuliah
- Tampilan jadwal mingguan yang responsif
- Integrasi GPS untuk notifikasi lokasi
- Support kelas online dengan link meeting
- Notifikasi otomatis sebelum kelas

### ✅ Manajemen Tugas
- Tambah, edit, dan kelola tugas kuliah
- Sistem prioritas (Tinggi, Sedang, Rendah)
- OCR untuk scan tugas dari foto
- Filter dan sorting berdasarkan deadline

### 📊 Simulator IPK
- Simulasi perubahan nilai secara real-time
- Visual perbandingan IPK saat ini vs simulasi
- Perencanaan target nilai semester mendatang

### ⏰ Focus Mode
- Teknik Pomodoro untuk produktivitas
- Timer dengan dark mode support
- Tracking sesi fokus harian
- Notifikasi dan sound alerts

### 📈 Ringkasan Mingguan
- Analisis produktivitas mingguan
- Statistik penyelesaian tugas
- Notifikasi proaktif untuk tugas penting
- Overview tugas mendatang

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v16 atau lebih baru)
- npm atau yarn

### Instalasi & Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Jalankan development server**
   ```bash
   npm run dev
   ```

3. **Buka di browser**
   ```
   http://localhost:3002 (atau port yang tersedia)
   ```

### Build untuk Production

```bash
npm run build
npm run preview
```

## 📱 Responsive Design

Aplikasi ini dioptimalkan untuk:
- 📱 Mobile devices (320px+)
- 📟 Tablets (768px+) 
- 💻 Desktop (1024px+)

### Fitur Mobile-First
- Touch-friendly interface
- Bottom navigation untuk mobile
- Optimized tap targets
- Safe area untuk notch/punch hole
- Smooth scrolling dan animations

## 🛠 Teknologi Yang Digunakan

### Frontend
- **React 18** - UI framework modern
- **React Router** - Navigation dan routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library yang konsisten
- **Vite** - Build tool yang cepat

### Libraries & Utilities
- **date-fns** - Manipulasi tanggal yang powerful
- **Tesseract.js** - OCR untuk scan tugas

## 🎨 Design System

### Color Palette
- **Primary**: Blue spectrum (#0ea5e9 - #0369a1)
- **Accent**: Purple spectrum (#d946ef - #701a75)
- **Semantic**: Green (success), Red (danger), Yellow (warning)

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Responsive typography

### Components
- Card-based layout
- Consistent spacing (4px grid)
- Smooth animations dan transitions
- Accessible focus states

## 📊 Perbaikan Yang Dilakukan

### Layout & Responsivitas
✅ **Header responsive** - Ukuran dan spacing adaptif untuk mobile/desktop
✅ **Sidebar optimization** - Collapsed di mobile dengan bottom navigation  
✅ **Card layouts** - Padding dan margin responsif
✅ **Typography scaling** - Font size adaptif untuk semua device
✅ **Bottom navigation** - Safe area untuk mobile dengan shadow dan z-index
✅ **Grid systems** - Auto-responsive grids dengan breakpoint optimal

### Mobile Optimizations
✅ **Touch targets** - Minimum 44px untuk semua interactive elements
✅ **Tap highlights** - Disabled untuk better UX
✅ **Overflow handling** - Proper scrolling dan content clipping
✅ **Loading states** - Skeleton loading dan smooth transitions
✅ **Performance** - Font preloading dan critical CSS inlining

### Cross-Browser Support
✅ **Vendor prefixes** - Autoprefixer untuk compatibility
✅ **Smooth scrolling** - Polyfill untuk older browsers
✅ **Font rendering** - Antialiasing untuk crisp text
✅ **Safe area** - Support untuk iPhone notch/Dynamic Island

## 📁 Struktur Project

```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx      # Main layout dengan navigation
├── contexts/           # React Context untuk state management
│   ├── AuthContext.jsx # Authentication state
│   └── DataContext.jsx # Application data state
├── pages/             # Page components
│   ├── Dashboard.jsx  # Homepage dashboard (✅ Responsive)
│   ├── Schedule.jsx   # Jadwal kuliah (✅ Responsive)  
│   ├── Tasks.jsx      # Manajemen tugas (✅ Responsive)
│   ├── IPKSimulator.jsx # Simulator IPK (✅ Responsive)
│   ├── FocusMode.jsx  # Pomodoro timer (✅ Responsive)
│   ├── WeeklySummary.jsx # Ringkasan mingguan (✅ Responsive)
│   └── Login.jsx      # Halaman login (✅ Responsive)
├── index.css          # Global styles dan Tailwind (✅ Enhanced)
└── main.jsx          # App entry point
```

## 🆘 Troubleshooting

### Common Issues

**Port sudah digunakan**
```bash
# Vite akan automatically mencari port yang tersedia
npm run dev
```

**Dependencies error**
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

**Layout masalah pada mobile**
- Pastikan viewport meta tag ada di index.html
- Check untuk overflow-x: hidden
- Verify touch target sizes minimal 44px

---

**Made with ❤️ untuk mahasiswa Indonesia**

> Aplikasi ini dirancang khusus untuk mempermudah mahasiswa Indonesia dalam mengelola kehidupan akademik mereka.