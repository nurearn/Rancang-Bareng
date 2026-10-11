# RPD & Arsitektur Studio (Neo-Brutalism Light Modern Edition)

Aplikasi visual digital board berbasis web untuk merancang **Arsitektur Sistem Polosan**, menyambungkan **Pipa Alur Data Interaktif**, **Kotak Catatan / Pertanyaan Arsitektural untuk AI Prompt**, serta **Auto-Sinkronisasi ke Dokumen RPD/PRD (.md)** dan **AI Prompt Generator** kelas dunia (ChatGPT, Claude 3.7, DeepSeek R1, Gemini).

---

## 🎨 Desain: Neo-Brutalism Light Modern Minimalist

- **Karakter Visual**: Garis tepi hitam tegas (`2.5px - 3px solid #000000`), bayangan kaku berbobot (*hard drop shadow* `3px 3px 0 #000`, `5px 5px 0 #000`), palet pastel bersih (*pastel yellow, purple, mint, sky, orange, pink*).
- **Tipografi**: *Plus Jakarta Sans* + *Space Mono*.
- **Kanvas**: Dot-grid neo-brutalist dengan navigasi Pan & Zoom tak terbatas.

---

## ⚡ Fitur Utama

1. **Kotak Komponen Polosan (Bebas Input Sendiri)**
   - Tidak ada batasan atau label pakem seperti *frontend, backend, database*.
   - Setiap kotak dan sub-kotak murni polosan: kamu yang menentukan nama komponen, sub-komponen, rincian fitur, dan teknologi.
   - Pilihan warna header pastel yang bisa diganti kapan saja.

2. **📌 Kotak Khusus Catatan & Pertanyaan Arsitektur (Sticky Question Note)**
   - Tambahkan kotak catatan lewat tombol **+ Catatan** di toolbar atas.
   - Tulis pertanyaan bebas, dilema teknologi, atau catatan khusus (contoh: *"nanti pake arsitektur apa ya front end nya?"*, *"mending PostgreSQL atau MongoDB?"*).
   - **Otomatis Masuk ke Prompt AI**: Pertanyaan ini tidak dibiarkan mengambang, melainkan langsung diformulasikan ke dalam prompt sebagai **"Daftar Pertanyaan & Dilema Arsitektur yang WAJIB Dijawab dan Diberikan Rekomendasi oleh AI"**!
   - Bisa dipindahkan (drag pin), di-resize, diganti warna, dan dipantau di tab sidebar **Catatan**.

3. **Pipa Sambungan Interaktif (Bisa Disambung Langsung)**
   - Tarik dari titik hitam di sisi kanan kotak (port output) ke titik hitam di sisi kiri kotak tujuan (port input).
   - Mendukung sambungan level Kotak Utama maupun Sub-Kotak.
   - Klik pipa untuk memilih atau menghapus sambungan.

4. **Auto-Sinkronisasi Real-Time ke PRD & Prompt AI**
   - **Begitu pipa disambungkan atau catatan ditambahkan**, sistem otomatis menyinkronkannya seketika ke:
     - **Preview RPD (Sidebar)**: Menampilkan diagram alur Mermaid syntax, matriks transmisi pipa data, dan daftar catatan pertanyaan.
     - **Generator AI Prompt**: Membedah setiap sambungan pipa secara mendalam dan menginstruksikan AI untuk menjawab tuntas semua pertanyaan di kotak catatan.
     - **Dokumen Markdown (.md)**: Siap diunduh lengkap dengan checklist pengerjaan dan daftar pertanyaan.

5. **✨ 5 Mode Persona Master Prompt AI**
   - 👑 **Principal Software Architect**: Desain sistem terdistribusi, justifikasi arsitektur, SLA pipa data, dan jawaban pertanyaan teknis pengguna.
   - 📑 **PRD / RPD Lengkap**: Standar Product Lead (User Stories, Acceptance Criteria Given-When-Then, NFR).
   - 🚀 **Roadmap Implementasi & Sprint**: Pembagian milestone fase 1-4 dan tiket sprint dev-ready.
   - 🔌 **Database Schema & Kontrak API**: DDL SQL schema lengkap dan spesifikasi payload API setiap pipa.
   - 🛡️ **Keamanan & Ketahanan Sistem**: Threat modeling STRIDE, enkripsi in-transit/at-rest, dan failover.

---

## 💻 Cara Menjalankan

Buka langsung file [`index.html`](file:///c:/Users/Rian/Desktop/PROYEK/Roadmap%20RPD/index.html) di browser, atau akses web server lokal di:
**`http://localhost:3030`**
