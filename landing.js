/**
 * RANCANG BARENG · LANDING PAGE CONTROLLER
 * Ultra-lightweight: 0 dependencies, fast FCP/LCP, instant redirect
 */
(function () {
  'use strict';

  // 1. Language Dictionary (Landing only)
  const LANDING_I18N = {
    id: {
      brandSubtitleLanding: 'STUDIO ARSITEKTUR & PRD KOLABORATIF',
      navFeatures: 'Fitur Utama',
      navMultiplayer: 'Multiplayer Sync',
      navAiPrompt: 'AI Prompt & PRD',
      navMultiDevice: 'Multi-Perangkat',
      supportCreator: 'Dukung Kreator',
      ctaNow: 'Rancang Bareng Sekarang',
      heroBadge: 'REAL-TIME COLLABORATIVE ARCHITECTURE PLATFORM',
      heroTitle: 'Rancang Arsitektur Sistem <br><span class="highlight-text">Bareng Tim Tanpa Batas.</span>',
      heroDesc: 'Kanvas modular serbaguna untuk merancang arsitektur sistem, menghubungkan pipa data interaktif, dan mendokumentasikan keputusan teknis. Kendalikan bersama rekan tim secara online real-time dari <b>PC, tablet, hingga smartphone</b>, otomatis tersinkronisasi ke dokumen PRD dan prompt AI.',
      heroDemo: 'Masuk Kanvas Studio',
      heroJoinRoom: 'Gabung Ruang Kolaborasi',
      statSync: 'Multi-User Realtime Sync',
      statPipes: 'Pipa Sambungan Interaktif',
      statNotes: 'Kotak Catatan & Keputusan Teknis',
      statResponsive: 'Responsif PC, Tablet & Mobile',
      mockupMembers: 'Rekan Tim Online Mengendalikan',
      featuresTag: 'FITUR UNGGULAN',
      featuresTitle: 'Semua yang Kamu Butuhkan untuk Desain Sistem',
      featuresDesc: 'Arsitektur visual modular: cepat, intuitif, tanpa batasan template kaku, dan dirancang khusus untuk mempercepat alur kerja teknis tim.',
      feat1Title: 'Kolaborasi Online Real-Time',
      feat1Text: 'Kendalikan kanvas secara serentak bersama rekan tim dalam satu Room ID. Pergerakan kotak, sambungan pipa, hingga posisi kursor rekan tim terlihat langsung tanpa delay.',
      feat2Title: 'Pipa Interaktif Presisi',
      feat2Text: 'Hubungkan port output dan input antar kotak secara instan. Dukung multi-koneksi dan sambungan sub-kotak. Lengkap dengan tombol pemutus pipa langsung di tengah koneksi.',
      feat3Title: 'Komponen Polosan Tanpa Batasan',
      feat3Text: 'Bebas dari template kaku. Kamu leluasa menentukan nama komponen, hierarki modul, teknologi pendukung, protokol, dan rincian fitur tanpa hambatan.',
      feat4Title: 'Kotak Catatan & Keputusan Teknis',
      feat4Text: 'Dokumentasikan pertanyaan teknis dan trade-off arsitektur langsung di kanvas. Terintegrasi ke generator AI untuk evaluasi komparatif yang tajam dan terstruktur.',
      feat5Title: 'Sinkronisasi PRD & Diagram Alur',
      feat5Text: 'Setiap komponen dan pipa yang kamu pasang otomatis terkonversi menjadi dokumen PRD / RPD siap eksekusi lengkap dengan diagram alur, matriks data, dan checklist sprint.',
      feat6Title: 'Responsif di Semua Perangkat',
      feat6Text: 'Tampilan beradaptasi mulus di PC monitor ultra-wide, laptop, tablet iPad, hingga smartphone dengan kontrol sentuh dan navigasi kanvas yang intuitif.',
      splitTag: 'MULTI-PERANGKAT & INSTANT SHARE',
      splitTitle: 'Buka di PC, Diskusi di Tablet, Pantau dari HP.',
      splitDesc: 'Tak perlu registrasi atau login akun. Cukup ketik nama/username kamu, buka di browser perangkat apa pun, dan bagikan tautan ruangan untuk mulai berkolaborasi seketika.',
      splitCheck1: '<b>Tanpa Login / Registrasi:</b> Masukkan username dan pilih avatar warna favorit secara instan.',
      splitCheck2: '<b>Navigasi Sentuh Fleksibel:</b> Geser, zoom, ubah ukuran kotak, dan sambungkan pipa data secara presisi di layar mana pun.',
      splitCheck3: '<b>Share Link Seketika:</b> Satu klik tombol bagikan untuk mengundang tim lewat tautan ruangan unik.',
      mockupScreenTitle: 'Rancang Bareng Studio Multi-Perangkat',
      mockupPill1: 'PC Desktop',
      mockupPill2: 'Tablet / iPad',
      mockupPill3: 'Smartphone',
      mockupConnectedUsers: 'Ruang Kolaborasi Real-Time',
      mockupSyncBadge: 'Otomatis Tersimpan & Tersinkronkan Real-Time',
      bannerTitle: 'Siap Merancang Arsitektur Sistem Bersama Tim?',
      bannerDesc: 'Mulai gratis sekarang. Polosan, interaktif, kolaborasi real-time, dan langsung terintegrasi ke dokumen PRD & AI Prompt.',
      footerBrand: '<b>RANCANG BARENG</b> · Studio Arsitektur & PRD Kolaboratif Real-Time',
      footerTagline: 'Arsitektur Modular & Desain Sistem Modern',
      footerToTop: 'Kembali ke Atas'
    },
    en: {
      brandSubtitleLanding: 'COLLABORATIVE ARCHITECTURE & PRD STUDIO',
      navFeatures: 'Key Features',
      navMultiplayer: 'Multiplayer Sync',
      navAiPrompt: 'AI Prompt & PRD',
      navMultiDevice: 'Multi-Device',
      supportCreator: 'Support Creator',
      ctaNow: 'Design Together Now',
      heroBadge: 'REAL-TIME COLLABORATIVE ARCHITECTURE PLATFORM',
      heroTitle: 'Architect Complex Systems <br><span class="highlight-text">Together with Zero Limits.</span>',
      heroDesc: 'A versatile modular canvas for architecting software systems, snapping interactive data pipelines, and documenting technical decisions. Collaborate in real time across <b>desktop, tablet, and mobile</b>, automatically synced into executable PRDs and AI prompts.',
      heroDemo: 'Open Canvas Studio',
      heroJoinRoom: 'Join Collaboration Room',
      statSync: 'Multi-User Realtime Sync',
      statPipes: 'Interactive Precision Pipes',
      statNotes: 'Technical Notes & Decision Logs',
      statResponsive: 'Responsive for PC, Tablet & Mobile',
      mockupMembers: 'Teammate Online Editing',
      featuresTag: 'CORE CAPABILITIES',
      featuresTitle: 'Everything You Need to Architect Scalable Systems',
      featuresDesc: 'Clean modular visual architecture: fast, intuitive, free from rigid templates, and engineered specifically to accelerate technical workflows.',
      feat1Title: 'Real-Time Online Collaboration',
      feat1Text: 'Co-design systems synchronously with teammates in one shared Room ID. Box movements, pipe connections, and live cursors sync instantly without lag.',
      feat2Title: 'Precision Interactive Pipelines',
      feat2Text: 'Snap output and input ports across boxes instantly. Full support for multi-connections, sub-box links, and one-click disconnect buttons directly on each pipe.',
      feat3Title: 'Flexible Modular Components',
      feat3Text: 'Break free from rigid templates. Customize component labels, sub-module hierarchies, protocols, and technical specs with complete flexibility.',
      feat4Title: 'Technical Notes & Decision Logs',
      feat4Text: 'Capture technical questions and architecture trade-offs directly on the canvas. Auto-fed into the AI prompt generator for deep comparative analysis.',
      feat5Title: 'Automated PRD & Flow Diagrams',
      feat5Text: 'Every component and pipe you connect automatically compiles into a production-ready PRD document with architectural flowcharts, data schemas, and sprint checklists.',
      feat6Title: 'Universal Device Responsive',
      feat6Text: 'Smoothly adapts across ultra-wide desktop monitors, laptops, tablets, and smartphones with intuitive touch gestures and canvas navigation.',
      splitTag: 'MULTI-DEVICE & INSTANT SHARING',
      splitTitle: 'Design on Desktop, Review on Tablet, Inspect on Mobile.',
      splitDesc: 'Zero registration or complex login required. Simply pick your username, open in any device browser, and share your unique room link to collaborate in seconds.',
      splitCheck1: '<b>No Login / Sign-up:</b> Instant custom nickname and avatar color picker.',
      splitCheck2: '<b>Touch & Pointer Friendly:</b> Smooth pan, zoom, box resize, and pipe routing on any screen.',
      splitCheck3: '<b>Instant Room Sharing:</b> One-click link copy to invite engineers and teammates.',
      mockupScreenTitle: 'Rancang Bareng Multi-Device Studio',
      mockupPill1: 'Desktop PC',
      mockupPill2: 'Tablet / iPad',
      mockupPill3: 'Smartphone',
      mockupConnectedUsers: 'Real-Time Collaboration Room',
      mockupSyncBadge: 'Auto-Saved & Real-Time Synced',
      bannerTitle: 'Ready to Architect Systems with Your Team?',
      bannerDesc: 'Start free today. Modular, interactive, real-time collaboration, seamlessly integrated into PRDs and AI Prompts.',
      footerBrand: '<b>RANCANG BARENG</b> · Real-Time Collaborative Architecture & PRD Studio',
      footerTagline: 'Modular Architecture & Modern System Design',
      footerToTop: 'Back to Top'
    }
  };

  let currentLang = localStorage.getItem('rb_lang') || 'id';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('rb_lang', lang);
    const dict = LANDING_I18N[lang] || LANDING_I18N.id;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key]) el.innerHTML = dict[key];
    });

    const idBtn = document.getElementById('landingLangId');
    const enBtn = document.getElementById('landingLangEn');
    if (idBtn && enBtn) {
      if (lang === 'id') {
        idBtn.classList.add('active');
        enBtn.classList.remove('active');
      } else {
        enBtn.classList.add('active');
        idBtn.classList.remove('active');
      }
    }
  }

  // Setup Language Switchers
  const idBtn = document.getElementById('landingLangId');
  const enBtn = document.getElementById('landingLangEn');
  if (idBtn) idBtn.addEventListener('click', () => applyLanguage('id'));
  if (enBtn) enBtn.addEventListener('click', () => applyLanguage('en'));
  applyLanguage(currentLang);

  // Setup CTA Buttons -> Navigate to workspace.html
  const ctaButtons = ['landingCtaNavBtn', 'heroStartBtn', 'heroDemoBtn', 'splitStartBtn', 'bannerStartBtn'];
  ctaButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'workspace.html';
      });
    }
  });

  // Join Room button
  const joinBtn = document.getElementById('heroJoinRoomBtn');
  if (joinBtn) {
    joinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = prompt(currentLang === 'en' ? 'Enter Room ID / Name to join:' : 'Masukkan ID / Nama Ruang Kolaborasi:');
      if (code && code.trim()) {
        const cleanCode = code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        window.location.href = 'workspace.html?room=' + encodeURIComponent(cleanCode);
      } else if (code !== null) {
        window.location.href = 'workspace.html';
      }
    });
  }

})();
