# NexaWallet

Aplikasi dompet digital React Native (Expo) sesuai desain UI NexaWallet — login, home, transaksi, kartu, dan profil dengan semua tombol berfungsi.

## Menjalankan

```bash
cd nexawallet
npm install
npx expo start
```

Scan QR dengan **Expo Go** (Android/iOS) atau tekan `a` / `i` untuk emulator.

## Akun demo

| Field    | Value              |
|----------|--------------------|
| Email    | sarah@saamail.com  |
| Password | password123        |

## Fitur

- **Login** — email/password, Face ID, Touch ID
- **Sign Up** — registrasi akun baru
- **Forgot Password** — reset email
- **Home** — saldo live, Send/Receive/Top Up/Pay Bill (update saldo & riwayat)
- **Transactions** — search + filter All/Sent/Received/Bills
- **Cards** — lihat detail & blokir kartu
- **Profile** — notifikasi Push/Email, logout, security, help
- Data disimpan lokal dengan AsyncStorage
