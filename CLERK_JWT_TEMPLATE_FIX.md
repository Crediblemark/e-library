# Perbaikan Error 404 Clerk JWT Template

## Masalah
Error 404 pada endpoint Clerk:
```
POST https://mutual-possum-83.clerk.accounts.dev/v1/client/sessions/sess_xxx/tokens/supabase
404 (Not Found)
```

## Penyebab
JWT template dengan nama 'supabase' belum dibuat di Clerk dashboard.

## Solusi

### Langkah 1: Buat JWT Template di Clerk Dashboard

1. Buka [Clerk Dashboard](https://dashboard.clerk.com)
2. Pilih aplikasi Anda
3. Navigasi ke **JWT Templates** di sidebar
4. Klik **New template**
5. Pilih **Supabase** dari template yang tersedia
6. Konfigurasi template:
   - **Name**: `supabase` (PENTING: harus persis 'supabase')
   - **Token lifetime**: 3600 seconds (1 hour)
   - **Claims**: Gunakan konfigurasi berikut

```json
{
  "aud": "authenticated",
  "exp": {{exp}},
  "iat": {{iat}},
  "iss": "{{iss}}",
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address.email_address}}",
  "phone": "{{user.primary_phone_number.phone_number}}",
  "app_metadata": {
    "provider": "clerk",
    "providers": ["clerk"]
  },
  "user_metadata": {
    "email": "{{user.primary_email_address.email_address}}",
    "email_verified": {{user.primary_email_address.verification.status == "verified"}},
    "phone_verified": {{user.primary_phone_number.verification.status == "verified"}},
    "sub": "{{user.id}}"
  },
  "role": "authenticated"
}
```

7. Klik **Save**

### Langkah 2: Konfigurasi Supabase JWT Settings

1. Buka Supabase project dashboard
2. Navigasi ke **Settings** > **API**
3. Scroll ke bagian **JWT Settings**
4. Di Clerk Dashboard, pergi ke **API Keys**
5. Copy **JWT Verification Key** (PEM format)
6. Di Supabase, tambahkan key ini sebagai additional JWT secret

### Langkah 3: Verifikasi Konfigurasi

1. Restart development server:
   ```bash
   npx expo start --clear
   ```

2. Test authentication flow
3. Periksa console untuk memastikan tidak ada error 404

### Langkah 4: Debug (Opsional)

Tambahkan logging untuk memverifikasi token:

```typescript
// Di komponen yang menggunakan getToken
const { getToken } = useAuth();

try {
  const token = await getToken({ template: 'supabase' });
  console.log('Token berhasil didapat:', !!token);
} catch (error) {
  console.error('Error getting token:', error);
}
```

## Catatan Penting

1. **Nama Template**: Harus persis 'supabase' karena kode menggunakan `getToken({ template: 'supabase' })`
2. **Case Sensitive**: Nama template case-sensitive
3. **Restart Required**: Setelah membuat template, restart development server
4. **Propagation Time**: Perubahan mungkin butuh beberapa menit untuk aktif

## Verifikasi Berhasil

Setelah konfigurasi benar:
- Error 404 akan hilang
- Authentication flow berjalan normal
- Data dapat diambil dari Supabase dengan RLS
- Console tidak menampilkan error Clerk

## Troubleshooting

Jika masih ada masalah:
1. Periksa nama template di Clerk dashboard
2. Pastikan template sudah di-save
3. Restart development server
4. Clear browser cache/storage
5. Periksa network tab untuk melihat request yang sebenarnya