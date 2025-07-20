# E-Library - School Digital Library App 📚

Aplikasi perpustakaan digital berbasis React Native dengan Expo yang menyediakan fitur membaca, menulis, dan manajemen buku untuk lingkungan sekolah.

## 🏗️ Arsitektur Proyek

### Tech Stack
- **Frontend**: React Native + Expo Router + NativeWind (Tailwind CSS)
- **Backend**: Supabase (Database + Auth)
- **Authentication**: Clerk + Supabase Auth (Dual system)
- **UI Framework**: React Native Paper + Lucide Icons
- **Styling**: NativeWind (Tailwind CSS untuk React Native)

### Struktur Folder
```
├── app/                    # File-based routing (Expo Router)
│   ├── _layout.tsx        # Root layout dengan auth guard
│   ├── index.tsx          # Homepage
│   ├── login.tsx          # Login screen
│   ├── admin/             # Admin panel
│   ├── book/[id].tsx      # Book details
│   ├── read/[id].tsx      # Reading interface
│   └── write/             # Writing features
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context (AuthContext)
│   ├── services/          # API services (Clerk, Supabase)
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── supabase/              # Database migrations
```

## 🔐 Sistem Autentikasi

### Dual Authentication System
1. **Supabase Auth** - Email/password login tradisional
2. **Clerk** - Modern authentication dengan social login dan enterprise features

### Role-based Access Control
- **READER**: User biasa (baca buku, tulis)
- **LIBRARIAN**: Kelola buku dan user
- **ADMIN**: Full access ke semua fitur

## 📚 Fitur Utama

### Reading Features
- ✅ Browse dan search buku
- ✅ Book details dengan rating dan reviews
- 🚧 Reading interface dengan progress tracking
- ✅ Recently read section
- 🚧 Reading statistics dan achievements

### Writing Features
- 🚧 Create writing projects
- 🚧 Chapter management
- 🚧 Draft dan publish system
- 🚧 Writing statistics

### Admin Panel
- 🚧 User management
- 🚧 Book management
- 🚧 Analytics dashboard
- 🚧 Content moderation

## 🗄️ Database Schema

### Core Tables
- `profiles` - User profile data
- `books` - Book catalog
- `borrowed_books` - Borrowing records
- `reading_history` - Reading progress
- `reading_stats` - User reading statistics
- `achievements` - Gamification system
- `projects` - User writing projects
- `chapters` - Project chapters

## ⚙️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` dengan kredensial yang benar:
```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Start Development Server
```bash
npx expo start
```

### 4. Platform-specific Commands
```bash
# Android
npm run android
# atau: expo start --android

# iOS
npm run ios
# atau: expo start --ios

# Web
npm run web
# atau: expo start --web
```

## 🚀 Platform Support
- ✅ **iOS**: `expo start --ios`
- ✅ **Android**: `expo start --android`
- ✅ **Web**: `expo start --web`

## 📋 Status Implementasi

### ✅ Sudah Diimplementasikan
- Basic project structure
- Authentication system (Clerk + Supabase)
- Database schema
- Core UI components
- Route protection
- Role-based access control
- File-based routing dengan Expo Router

### 🚧 Dalam Pengembangan
- Book management features
- Reading interface
- Writing editor
- Admin dashboard
- Search functionality

### 📋 Belum Diimplementasikan
- Payment integration
- Offline reading
- Push notifications
- Advanced analytics

## 🔧 Development Guidelines

### Code Structure
- Gunakan TypeScript untuk type safety
- Implementasikan proper error handling
- Follow React Native best practices
- Gunakan NativeWind untuk styling consistency

### Authentication Flow
1. User login melalui Clerk atau Supabase
2. Token disimpan secara aman
3. Route protection berdasarkan role
4. Automatic session refresh

## 📚 Documentation

- [CLERK_SETUP.md](./CLERK_SETUP.md) - Panduan setup Clerk
- [CLERK_SUPABASE_INTEGRATION.md](./CLERK_SUPABASE_INTEGRATION.md) - Integrasi Clerk dengan Supabase

## 🛠️ Troubleshooting

### Common Issues
1. **Environment Variables**: Pastikan semua env vars sudah dikonfigurasi
2. **Clerk Setup**: Periksa publishable key dan JWT template configuration
3. **Supabase Connection**: Verify database connection dan API keys

## 🤝 Contributing

1. Fork the project
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Catatan**: Proyek ini memiliki foundation yang solid dengan arsitektur modern. Fokus pengembangan selanjutnya adalah melengkapi fitur-fitur core dan meningkatkan user experience.
