# Rancang Bareng Studio (Neo-Brutalism Edition)

Aplikasi visual digital board berbasis web untuk merancang **Arsitektur Sistem Modular**, menyambungkan **Pipa Alur Antar-Komponen (Bebas 2 Arah)**, mencatat **Keputusan & Pertanyaan Kunci Arsitektur**, serta **Auto-Sinkronisasi ke Dokumen RPD/PRD (.md)** dan **Vibe Coding AI Prompt Generator** siap pakai untuk AI Coding Agents (Antigravity IDE, Cursor, Claude Code, Windsurf, Devin).

---

## 🎨 Desain: Neo-Brutalism Light Modern Minimalist

- **Karakter Visual**: Garis tepi hitam tegas (`2.5px - 3px solid #000000`), bayangan kaku berbobot (*hard drop shadow* `3px 3px 0 #000`, `5px 5px 0 #000`), palet pastel bersih (*pastel yellow, purple, mint, sky, orange, pink*).
- **Tipografi**: *Plus Jakarta Sans* + *Space Mono*.
- **Kanvas**: Dot-grid neo-brutalist dengan navigasi Pan & Zoom tak terbatas, responsive di **PC, Tablet, dan Smartphone**.

---

## ⚡ Fitur Utama

### 1. Kotak Komponen Polosan (Bebas Input Sendiri)
- Tidak ada batasan atau label kaku: kamu bebas menentukan nama kotak, sub-kotak, protokol, teknologi, dan rincian fitur.
- Pilihan warna pastel yang bisa diganti kapan saja.
- Bisa di-drag dan dipindahkan dengan lancar baik menggunakan mouse (PC) maupun sentuhan jari di layar HP/tablet.

### 2. 🔗 Pipa Sambungan Antar-Komponen (Universal Bidirectional)
- **Tanpa Panah Pembatas**: Pipa berfungsi sebagai kabel penghubung nyata antar-komponen (contoh: *Kotak B terhubung dengan Kotak A*, *Sub A terhubung dengan Kotak C*).
- **Fleksibel Segala Arah**: Bebas disambungkan dari kanan ke kiri, kiri ke kanan, kanan ke kanan, maupun kiri ke kiri.
- **Auto-Avoidance (Anti-Tabrakan)**: Pipa otomatis melengkung di **luar bodi kotak** (tidak menembus atau menghalangi teks kotak) dan otomatis menyesuaikan posisinya secara rapi saat kotak digeser.
- Dilengkapi tombol pemutus "X" di tengah pipa untuk menghapus sambungan secara instan.

### 3. 📌 Kotak Catatan & Keputusan Arsitektur (Sticky Question Note)
- Tuliskan pertanyaan arsitektur, dilema teknologi, atau pertimbangan desain (contoh: *"pakai PostgreSQL atau MongoDB?"*, *"arsitektur front-end pakai SSR Next.js atau SPA Vite?"*).
- **Wajib Diterapkan oleh AI**: Catatan ini otomatis masuk ke dalam prompt dan dokumen sebagai **"Keputusan Arsitektur Kunci yang WAJIB Dijawab dan Diterapkan oleh AI"**.

### 4. ⚡ Vibe Coding AI Prompt Generator (Siap Kirim ke Agent)
- Cukup 1-klik untuk menghasilkan prompt komprehensif yang siap dikirim ke AI coding agent:
  - 🤖 **Antigravity IDE / Cursor / Claude Code / Windsurf / Devin**: Menghasilkan pohon folder, kontrak data antar-pipa, dan instruksi kode 100% lengkap tanpa placeholder (`// TODO`).
  - 📐 **Enterprise Software Architect**: Analisis trade-offs, boundary domain, SLA latency.
  - 📋 **PRD / RPD Lengkap**: User stories format Given-When-Then dan acceptance criteria.
  - 🚀 **Roadmap & Sprint**: Pembagian fase 1-4 dan tiket sprint dev-ready.
  - 🔌 **Database Schema & Kontrak API**: SQL DDL dan JSON payload setiap pipa.

### 5. 📄 Ekspor Dokumen RPD (.md) Lengkap
- Dokumen Markdown terstruktur rapi:
  - Ringkasan eksekutif dan matriks sistem.
  - Diagram alur Mermaid syntax (`Kotak B ---|"terhubung dengan"| Kotak A`).
  - Matriks kontrak integrasi pipa data.
  - Panduan eksekusi Vibe Coding untuk agen AI.
  - Checklist implementasi fitur.

---

## 🚀 Cara Menjalankan & Vibe Coding

1. Buka file [`index.html`](file:///c:/Users/Rian/Desktop/PROYEK/Roadmap%20RPD/index.html) (Landing Page) atau langsung [`workspace.html`](file:///c:/Users/Rian/Desktop/PROYEK/Roadmap%20RPD/workspace.html) (Kanvas Studio Kerja) di browser, atau jalankan web server lokal:
   ```bash
   python -m http.server 3030
   ```
   - **Landing Page**: `http://localhost:3030/` (atau `http://localhost:3030/index.html`)
   - **Kanvas Studio**: `http://localhost:3030/workspace.html` (atau klik tombol *Rancang Bareng Sekarang*)

2. **Alur Kerja Vibe Coding**:
   - Tambahkan kotak komponen dan sub-kotak sesuai ide aplikasi kamu.
   - Sambungkan pipa antar-kotak (misal: Frontend terhubung ke Auth API, Auth API terhubung ke Database).
   - Tulis catatan arsitektur jika ada dilema teknologi.
   - Klik **AI Prompt** di header atas, pilih mode **Vibe Coding Blueprint**, lalu klik **Salin Prompt**.
   - Paste prompt tersebut ke AI Coding Agent kamu (Antigravity IDE, Cursor, Claude Code, Windsurf) — agen AI akan langsung memahami seluruh arsitektur dan membangun kodenya secara utuh!

