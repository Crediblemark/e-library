# Auth0 + Supabase Third-Party Authentication Integration

Panduan ini menjelaskan cara mengintegrasikan Auth0 sebagai third-party authentication provider dengan Supabase.

## Overview

Implementasi ini menggunakan Auth0 sebagai identity provider utama dan Supabase sebagai database backend dengan third-party authentication. Pendekatan ini memungkinkan:

- Auth0 menangani autentikasi dan manajemen user
- Supabase menyediakan database dan API dengan authorization berbasis JWT dari Auth0
- Row Level Security (RLS) di Supabase menggunakan claims dari Auth0 JWT

## Setup Supabase

### 1. Konfigurasi Third-Party Auth di Supabase Dashboard

1. Buka Supabase Dashboard → Authentication → Settings
2. Scroll ke bagian "Third-Party Auth"
3. Klik "Add Integration"
4. Pilih "Auth0"
5. Masukkan:
   - **Tenant ID**: Domain Auth0 Anda (tanpa https://)
   - **Tenant Region**: Region jika ada (opsional)

### 2. Konfigurasi via CLI (Alternatif)

Tambahkan ke `supabase/config.toml`:

```toml
[auth.third_party.auth0]
enabled = true
tenant = "your-auth0-domain"
tenant_region = "us" # jika ada region
```

## Setup Auth0

### 1. Buat Auth0 Action untuk Role Claim

Auth0 JWT secara default tidak memiliki `role` claim yang dibutuhkan Supabase. Buat Action:

1. Buka Auth0 Dashboard → Actions → Flows
2. Pilih "Login"
3. Klik "Add Action" → "Build Custom"
4. Nama: "Add Supabase Role"
5. Trigger: "Login / Post Login"

Kode Action:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Set default role untuk semua user
  api.accessToken.setCustomClaim('role', 'authenticated');
  
  // Opsional: Set role berdasarkan kondisi tertentu
  // if (event.user.email === 'admin@example.com') {
  //   api.accessToken.setCustomClaim('role', 'admin');
  // }
};
```

6. Save dan Deploy
7. Drag Action ke Flow dan Apply

### 2. Konfigurasi Application Settings

Pastikan Auth0 Application memiliki:

- **Application Type**: Single Page Application
- **Allowed Callback URLs**: 
  - Web: `http://localhost:8081/auth`, `https://yourdomain.com/auth`
  - Mobile: URL yang dihasilkan Expo
- **Allowed Logout URLs**: 
  - Web: `http://localhost:8081`, `https://yourdomain.com`
- **Allowed Web Origins**: 
  - `http://localhost:8081`, `https://yourdomain.com`

## Implementasi di Aplikasi

### 1. Environment Variables

Tambahkan ke `.env`:

```env
# Auth0
EXPO_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
EXPO_PUBLIC_AUTH0_CLIENT_ID=your-client-id

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
```

### 2. Database Schema

Pastikan tabel `profiles` memiliki struktur yang sesuai:

```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- Auth0 user ID (sub claim)
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'reader',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy contoh
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy untuk read (semua authenticated user bisa read)
CREATE POLICY "Users can read all profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy untuk update (user hanya bisa update profile sendiri)
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'sub' = id);
```

### 3. Cara Kerja Integrasi

1. **Login Flow**:
   - User login via Auth0
   - Aplikasi mendapat access token dan ID token
   - Access token disimpan untuk digunakan dengan Supabase
   - Profile user dibuat/diupdate di Supabase

2. **API Calls ke Supabase**:
   - Menggunakan `createSupabaseWithAuth0(accessToken)`
   - Access token dikirim sebagai Bearer token
   - Supabase memverifikasi JWT dengan Auth0 public key
   - RLS policies menggunakan claims dari JWT

3. **Authorization**:
   - JWT dari Auth0 berisi `role: 'authenticated'`
   - Supabase menggunakan role ini untuk RLS
   - User ID dari `sub` claim digunakan untuk ownership

## Testing

1. **Test Auth0 Login**:
   - Klik tombol "Continue with Auth0"
   - Verifikasi redirect ke Auth0
   - Verifikasi redirect kembali dengan tokens

2. **Test Supabase Integration**:
   - Verifikasi profile dibuat di database
   - Test API calls dengan access token
   - Verifikasi RLS policies bekerja

3. **Test Logout**:
   - Verifikasi tokens dihapus
   - Verifikasi redirect ke Auth0 logout (web)

## Troubleshooting

### Common Issues

1. **"Invalid JWT" Error**:
   - Pastikan Auth0 domain benar di Supabase config
   - Verifikasi Action menambahkan role claim

2. **"Unauthorized" Error**:
   - Check RLS policies
   - Verifikasi access token valid
   - Check role claim di JWT

3. **CORS Issues**:
   - Verifikasi Allowed Web Origins di Auth0
   - Check callback URLs

### Debug JWT

Untuk debug JWT claims:

```javascript
// Decode access token untuk melihat claims
const tokens = await auth0Service.getStoredTokens();
if (tokens) {
  const payload = JSON.parse(atob(tokens.accessToken.split('.')[1]));
  console.log('JWT Claims:', payload);
}
```

## Security Considerations

1. **Token Storage**:
   - Web: localStorage (consider httpOnly cookies for production)
   - Mobile: AsyncStorage dengan encryption

2. **Token Refresh**:
   - Implement token refresh logic
   - Handle expired tokens gracefully

3. **RLS Policies**:
   - Always use RLS untuk data protection
   - Test policies thoroughly
   - Use principle of least privilege

## Production Checklist

- [ ] Auth0 Action deployed dan active
- [ ] Supabase third-party auth configured
- [ ] RLS policies implemented dan tested
- [ ] Proper error handling
- [ ] Token refresh logic
- [ ] Secure token storage
- [ ] HTTPS untuk semua endpoints
- [ ] Environment variables configured