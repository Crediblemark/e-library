# Auth0 Setup Guide

Panduan ini menjelaskan cara mengkonfigurasi Auth0 untuk aplikasi E-Library.

## 1. Setup Auth0 Application

### Buat Aplikasi Auth0
1. Login ke [Auth0 Dashboard](https://manage.auth0.com/)
2. Pilih **Applications** > **Create Application**
3. Pilih nama aplikasi: `E-Library App`
4. Pilih tipe: **Single Page Web Applications** (untuk mendukung mobile dan web)
5. Klik **Create**

### Konfigurasi Application Settings

#### Allowed Callback URLs
```
myapp://auth,
http://localhost:8081/auth,
https://your-app-domain.com/auth
```

#### Allowed Logout URLs
```
myapp://logout,
http://localhost:8081/logout,
https://your-app-domain.com/logout
```

#### Allowed Web Origins
```
http://localhost:8081,
https://your-app-domain.com
```

#### Allowed Origins (CORS)
```
http://localhost:8081,
https://your-app-domain.com
```

## 2. Konfigurasi Environment Variables

Update file `.env` dengan kredensial Auth0:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key

# Auth0
EXPO_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=your_auth0_client_id
```

## 3. Konfigurasi Supabase Auth

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Pergi ke **Authentication** > **Providers**
4. Aktifkan **Auth0** provider
5. Masukkan konfigurasi:
   - **Auth0 Domain**: `your-auth0-domain.auth0.com`
   - **Auth0 Client ID**: `your_auth0_client_id`
   - **Auth0 Client Secret**: `your_auth0_client_secret`

## 4. Testing

### Development (Expo)
```bash
npx expo start
```

### Production Build
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios

# Web
npx expo export:web
```

## 5. Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Pastikan callback URLs sudah dikonfigurasi dengan benar di Auth0
   - Periksa scheme di `app.json`

2. **"Network request failed"**
   - Periksa koneksi internet
   - Pastikan Auth0 domain dan client ID benar

3. **"Supabase sign-in failed"**
   - Pastikan Auth0 provider sudah diaktifkan di Supabase
   - Periksa konfigurasi Auth0 di Supabase dashboard

### Debug Mode

Untuk debugging, tambahkan log di `src/services/auth0.ts`:

```typescript
console.log('Auth0 Config:', {
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN,
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID,
});
```

## 6. Security Best Practices

1. **Environment Variables**
   - Jangan commit file `.env` ke repository
   - Gunakan environment variables yang berbeda untuk development dan production

2. **Auth0 Configuration**
   - Batasi callback URLs hanya untuk domain yang diperlukan
   - Aktifkan MFA untuk akun Auth0 admin
   - Review logs Auth0 secara berkala

3. **Supabase Security**
   - Aktifkan Row Level Security (RLS)
   - Review policies database secara berkala
   - Monitor usage dan logs

## 7. Features yang Didukung

- ✅ Social Login (Google, Facebook, GitHub, dll)
- ✅ Email/Password Authentication
- ✅ Multi-Factor Authentication (MFA)
- ✅ Single Sign-On (SSO)
- ✅ Cross-platform (Mobile & Web)
- ✅ Secure Token Management
- ✅ Automatic Token Refresh
- ✅ Logout dari semua devices

## 8. Next Steps

Setelah Auth0 berhasil dikonfigurasi:

1. Setup social providers (Google, Facebook, etc.)
2. Konfigurasi custom branding
3. Setup MFA rules
4. Implementasi role-based access control
5. Setup monitoring dan analytics