/**
 * ============================================================
 * RANCANG BARENG · STUDIO ARSITEKTUR SISTEM & PRD KOLABORATIF
 * Kanvas Modular · Pipa Interaktif · Kotak Catatan Keputusan · Auto-Sync PRD & Prompt
 * ============================================================
 */

(function () {
  'use strict';

  // --- STATE ---
  let projectTitle = '';
  let mainBoxes = [];
  let notes = [];
  let connections = [];
  let mainBoxCounter = 0;
  let subCounter = 0;
  let noteCounter = 0;
  let connCounter = 0;
  let selectedBoxId = null;
  let selectedConnId = null;
  let editingFeatures = null;

  // Viewport Pan & Zoom
  let panX = 80;
  let panY = 70;
  let zoom = 1;
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 2.5;

  // Interaction Drag / Pan / Resize / Wire
  let isDraggingBox = false;
  let dragBoxId = null;
  let dragStartMouseX = 0;
  let dragStartMouseY = 0;
  let dragStartBoxX = 0;
  let dragStartBoxY = 0;

  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panStartPanX = 0;
  let panStartPanY = 0;
  let spacePressed = false;

  let isResizing = false;
  let resizeBoxId = null;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeStartW = 0;
  let resizeStartH = 0;

  let isConnecting = false;
  let connectFrom = null; // { type: 'main'|'sub', boxId, subId, portType: 'output' }
  let tempLine = null;

  // ============================================================
  // MULTI-LANGUAGE (INDONESIAN & ENGLISH) DICTIONARY
  // ============================================================
  const I18N = {
    id: {
      brandSubtitle: 'STUDIO ARSITEKTUR · REAL-TIME',
      brandSubtitleLanding: 'STUDIO ARSITEKTUR & PRD KOLABORATIF',
      projectTag: 'PROYEK:',
      projectPlaceholder: 'Ketik nama arsitektur...',
      autoSaved: 'Auto-Saved',
      inviteTeam: 'Undang Tim',
      userProfile: 'Profil Kamu',
      addBox: 'Tambah Kotak',
      addNote: '+ Catatan',
      promptBtn: 'Prompt AI',
      ctaNow: 'Rancang Bareng Sekarang',
      heroDemo: 'Masuk Kanvas Studio',
      heroJoinRoom: 'Gabung Ruang Kolaborasi',
      newNoteTitle: 'Catatan',
      notePlaceholder: 'Tulis catatan arsitektur...',
      noteFooter: 'CATATAN',
      pipeConnected: 'Pipa berhasil disambungkan!',
      pipeExists: 'Sambungan pipa ini sudah ada.',
      pipeCut: 'Klik "X" untuk memutus pipa ini',
      canvasCleared: 'Kanvas telah dibersihkan',
      copied: 'Tersalin ke clipboard!',

      // Landing Navigation & Hero
      navFeatures: 'Fitur Utama',
      navMultiplayer: 'Multiplayer Sync',
      navAiPrompt: 'AI Prompt & PRD',
      navMultiDevice: 'Multi-Perangkat',
      heroBadge: 'REAL-TIME COLLABORATIVE ARCHITECTURE PLATFORM',
      heroTitle: 'Rancang Arsitektur Sistem <br><span class="highlight-text">Bareng Tim Tanpa Batas.</span>',
      heroDesc: 'Kanvas modular serbaguna untuk merancang arsitektur sistem, menghubungkan pipa data interaktif, dan mendokumentasikan keputusan teknis. Kendalikan bersama rekan tim secara online real-time dari <b>PC, tablet, hingga smartphone</b>, otomatis tersinkronisasi ke dokumen PRD dan prompt AI.',

      // Stat Pills
      statSync: 'Multi-User Realtime Sync',
      statPipes: 'Pipa Sambungan Interaktif',
      statNotes: 'Kotak Catatan & Keputusan Teknis',
      statResponsive: 'Responsif PC, Tablet & Mobile',

      // Mockup Hero
      mockupMembers: 'Rekan Tim Online Mengendalikan',
      mockNode1Title: 'Client Web App',
      mockNode1Sub1: 'Formulir Pendaftaran',
      mockNode1Sub2: 'Dashboard Pengguna',
      mockNode2Title: 'API Gateway & Auth',
      mockNode2Sub1: 'Validasi Token JWT',
      mockNode2Sub2: 'Rate Limiter & Routing',
      mockNode3Title: 'Layanan Data Terpadu',
      mockNode3Sub1: 'PostgreSQL Utama',
      mockNode3Sub2: 'Redis Cache Cluster',
      mockNoteTitle: 'Catatan Arsitektur',
      mockNoteContent: '"Evaluasi arsitektur frontend: Next.js SSR vs SPA Vite untuk latensi optimal."',
      mockNoteTag: 'Siap Dievaluasi AI & PRD',

      // Features Section
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

      // Split Section
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

      // CTA Banner & Footer & Projects
      bannerTitle: 'Siap Merancang Arsitektur Sistem Bersama Tim?',
      bannerDesc: 'Mulai gratis sekarang. Polosan, interaktif, kolaborasi real-time, dan langsung terintegrasi ke dokumen PRD & AI Prompt.',
      footerBrand: '<b>RANCANG BARENG</b> · Studio Arsitektur & PRD Kolaboratif Real-Time',
      footerTagline: 'Arsitektur Modular & Desain Sistem Modern',
      footerToTop: 'Kembali ke Atas',

      // Projects & Support
      supportCreator: 'Dukung Kreator',
      projectsBtn: 'Proyek',
      exportBtn: 'Ekspor',
      shareRoom: 'Bagikan',
      projectModalTitle: 'Kelola Proyek Arsitektur',
      projectModalSub: 'Buat baru, ganti proyek, atau bagikan link instan',
      newProjectBtn: '+ Proyek Baru',
      duplicateProjectBtn: 'Duplikasi Proyek',
      shareSnapshotBtn: 'Salin Link Snapshot',
      instantShareBadge: 'Bebas Biaya Server · Snapshot Sharing',
      instantShareDesc: 'Kamu bisa membagikan desain arsitektur ini ke siapa saja via tautan link snapshot. Data terenkode langsung di URL, jadi temanmu bisa membukanya tanpa perlu registrasi atau login!',
      savedProjectsTitle: 'Daftar Proyek Kamu (Tersimpan di Browser):'
    },
    en: {
      brandSubtitle: 'ARCHITECTURE STUDIO · REAL-TIME',
      brandSubtitleLanding: 'COLLABORATIVE ARCHITECTURE & PRD STUDIO',
      projectTag: 'PROJECT:',
      projectPlaceholder: 'Enter architecture title...',
      autoSaved: 'Auto-Saved',
      inviteTeam: 'Invite Team',
      userProfile: 'Your Profile',
      addBox: 'Add Box',
      addNote: '+ Note',
      exportBtn: 'Export',
      projectsBtn: 'Projects',
      supportCreator: 'Support Creator',
      promptBtn: 'AI Prompt',
      ctaNow: 'Design Together Now',
      heroDemo: 'Open Canvas Studio',
      heroJoinRoom: 'Join Collaboration Room',
      newNoteTitle: 'Note',
      notePlaceholder: 'Write architecture notes...',
      noteFooter: 'NOTE',
      pipeConnected: 'Pipe connected successfully!',
      pipeExists: 'Pipe connection already exists.',
      pipeCut: 'Click "X" to disconnect this pipe',
      canvasCleared: 'Canvas has been cleared',
      copied: 'Copied to clipboard!',

      // Landing Navigation & Hero
      navFeatures: 'Key Features',
      navMultiplayer: 'Multiplayer Sync',
      navAiPrompt: 'AI Prompt & PRD',
      navMultiDevice: 'Multi-Device',
      heroBadge: 'REAL-TIME COLLABORATIVE ARCHITECTURE PLATFORM',
      heroTitle: 'Architect Complex Systems <br><span class="highlight-text">Together with Zero Limits.</span>',
      heroDesc: 'A versatile modular canvas for architecting software systems, snapping interactive data pipelines, and documenting technical decisions. Collaborate in real time across <b>desktop, tablet, and mobile</b>, automatically synced into executable PRDs and AI prompts.',

      // Stat Pills
      statSync: 'Multi-User Realtime Sync',
      statPipes: 'Interactive Precision Pipes',
      statNotes: 'Technical Notes & Decision Logs',
      statResponsive: 'Responsive for PC, Tablet & Mobile',

      // Mockup Hero
      mockupMembers: 'Teammate Online Editing',
      mockNode1Title: 'Client Web App',
      mockNode1Sub1: 'Signup Workflow',
      mockNode1Sub2: 'User Dashboard',
      mockNode2Title: 'API Gateway & Auth',
      mockNode2Sub1: 'JWT Token Validation',
      mockNode2Sub2: 'Rate Limiter & Routing',
      mockNode3Title: 'Unified Data Tier',
      mockNode3Sub1: 'Primary PostgreSQL',
      mockNode3Sub2: 'Redis Cache Cluster',
      mockNoteTitle: 'Architecture Note',
      mockNoteContent: '"Frontend architecture decision: Evaluate Next.js SSR vs SPA Vite for optimal latency."',
      mockNoteTag: 'Ready for AI & PRD Evaluation',

      // Features Section
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

      // Split Section
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
      mockupSyncBadge: 'Auto-Saved & Real-Time Synchronized',

      // CTA Banner & Footer & Projects
      bannerTitle: 'Ready to Architect Systems Collaboratively?',
      bannerDesc: 'Get started for free today. Clean canvas, live collaboration, and direct integration with PRD & AI Prompts.',
      footerBrand: '<b>RANCANG BARENG</b> · Real-Time Collaborative System Architecture & PRD Studio',
      footerTagline: 'Modular Architecture & Modern System Design',
      footerToTop: 'Back to Top',

      // Projects & Support
      supportCreator: 'Support Creator',
      projectsBtn: 'Projects',
      shareRoom: 'Share',
      projectModalTitle: 'Architecture Projects Manager',
      projectModalSub: 'Create new, switch projects, or share instant links',
      newProjectBtn: '+ New Project',
      duplicateProjectBtn: 'Duplicate Project',
      shareSnapshotBtn: 'Copy Snapshot Link',
      instantShareBadge: 'Zero Server Cost · Snapshot Sharing',
      instantShareDesc: 'You can share this architecture design with anyone via a snapshot link. The data is encoded directly into the URL, allowing teammates to open it instantly with zero sign-up!',
      savedProjectsTitle: 'Your Saved Projects (Stored in Browser):'
    }
  };

  let currentLang = localStorage.getItem('rb_lang') || 'id';

  function t(key) {
    if (I18N[currentLang] && I18N[currentLang][key] != null) {
      return I18N[currentLang][key];
    }
    if (I18N.id && I18N.id[key] != null) return I18N.id[key];
    return key;
  }

  function setLanguage(lang) {
    if (lang !== 'id' && lang !== 'en') lang = 'id';
    currentLang = lang;
    localStorage.setItem('rb_lang', lang);
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-lang]').forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (I18N[currentLang] && I18N[currentLang][k] != null) {
        el.textContent = I18N[currentLang][k];
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const k = el.dataset.i18nHtml;
      if (I18N[currentLang] && I18N[currentLang][k] != null) {
        el.innerHTML = I18N[currentLang][k];
      }
    });

    if (projectTitleInput) {
      projectTitleInput.placeholder = t('projectPlaceholder');
    }

    const pLangEl = document.getElementById('promptLanguage');
    if (pLangEl) {
      pLangEl.value = currentLang;
    }

    const pModalEl = document.getElementById('promptModal');
    if (pModalEl && pModalEl.classList.contains('active') && typeof generateAIPrompt === 'function') {
      generateAIPrompt();
    }

    // Perbarui panel sidebar dan label statis tanpa menghancurkan elemen DOM kanvas
    updateSidebarPanels();
    updateCanvasStaticLabels();
  }

  function updateCanvasStaticLabels() {
    const isEn = currentLang === 'en';
    // Label tombol tambah sub-kotak
    document.querySelectorAll('.add-sub-btn').forEach(btn => {
      btn.innerHTML = `<i class="fas fa-plus"></i> ${isEn ? 'Add Sub-box' : 'Tambah Sub-Kotak'}`;
    });
    // Placeholder dan tooltip kartu catatan
    document.querySelectorAll('.note-box').forEach(box => {
      const pin = box.querySelector('.note-pin-badge');
      if (pin) pin.title = isEn ? 'Drag to move note' : 'Tarik untuk memindahkan catatan';
      const input = box.querySelector('.note-title-input');
      if (input && !input.value) input.placeholder = isEn ? 'Write architecture notes...' : 'Ketik pertanyaan / catatan arsitektur...';
    });
    // Tooltip pemutus pipa
    document.querySelectorAll('.pipe-cut-btn title').forEach(tEl => {
      tEl.textContent = t('pipeCut');
    });
    // Sub features btn polosan
    document.querySelectorAll('.sub-features-btn:not(.has)').forEach(btn => {
      btn.innerHTML = `<i class="fas fa-list-check"></i> ${isEn ? 'Features' : 'Fitur'}`;
    });
  }

  // ============================================================
  // SMART PRECISION ELBOW PIPE ROUTING (ROUNDED ORTHOGONAL)
  // Menjaga jalur pipa rapih siku melengkung (elbow), selalu di luar kotak,
  // tidak pernah memotong/mengganggu bodi kotak komponen & catatan.
  // ============================================================
  function getBoxBounds(boxRef) {
    if (!boxRef) return null;
    if (typeof boxRef === 'object' && typeof boxRef.left === 'number' && typeof boxRef.right === 'number') {
      return boxRef;
    }
    const boxId = (typeof boxRef === 'string') ? boxRef : (boxRef.id || null);
    if (!boxId) return null;

    const b = mainBoxes.find(x => x.id === boxId);
    if (b) {
      const left = b.x;
      const top = b.y;
      const w = b.w || 280;
      const h = b.h || 180;
      return { left, top, right: left + w, bottom: top + h };
    }
    const n = notes.find(x => x.id === boxId);
    if (n) {
      const left = n.x;
      const top = n.y;
      const w = n.w || 240;
      const h = n.h || 160;
      return { left, top, right: left + w, bottom: top + h };
    }
    const el = document.getElementById(boxId);
    if (el && board) {
      const bRect = board.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        left: (r.left - bRect.left) / zoom,
        top: (r.top - bRect.top) / zoom,
        right: (r.right - bRect.left) / zoom,
        bottom: (r.bottom - bRect.top) / zoom
      };
    }
    return null;
  }

  function pointsToRoundedPath(points, radius = 12) {
    if (!points || points.length < 2) return '';
    const clean = [points[0]];
    for (let i = 1; i < points.length; i++) {
      const prev = clean[clean.length - 1];
      const curr = points[i];
      if (Math.abs(curr[0] - prev[0]) > 0.5 || Math.abs(curr[1] - prev[1]) > 0.5) {
        clean.push(curr);
      }
    }
    if (clean.length < 2) return '';
    if (clean.length === 2) {
      return `M ${clean[0][0].toFixed(1)} ${clean[0][1].toFixed(1)} L ${clean[1][0].toFixed(1)} ${clean[1][1].toFixed(1)}`;
    }

    let d = `M ${clean[0][0].toFixed(1)} ${clean[0][1].toFixed(1)}`;

    for (let i = 1; i < clean.length - 1; i++) {
      const pPrev = clean[i - 1];
      const pCurr = clean[i];
      const pNext = clean[i + 1];

      const vInX = pCurr[0] - pPrev[0];
      const vInY = pCurr[1] - pPrev[1];
      const lenIn = Math.hypot(vInX, vInY);

      const vOutX = pNext[0] - pCurr[0];
      const vOutY = pNext[1] - pCurr[1];
      const lenOut = Math.hypot(vOutX, vOutY);

      if (lenIn < 1 || lenOut < 1) {
        d += ` L ${pCurr[0].toFixed(1)} ${pCurr[1].toFixed(1)}`;
        continue;
      }

      const r = Math.min(radius, lenIn / 2, lenOut / 2);

      const startX = pCurr[0] - (vInX / lenIn) * r;
      const startY = pCurr[1] - (vInY / lenIn) * r;

      const endX = pCurr[0] + (vOutX / lenOut) * r;
      const endY = pCurr[1] + (vOutY / lenOut) * r;

      d += ` L ${startX.toFixed(1)} ${startY.toFixed(1)}`;
      d += ` Q ${pCurr[0].toFixed(1)} ${pCurr[1].toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
    }

    const last = clean[clean.length - 1];
    d += ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
    return d;
  }

  function calculatePipeElbow(x1, y1, x2, y2, fromType = 'output', toType = 'input', rawB1 = null, rawB2 = null) {
    const b1 = getBoxBounds(rawB1);
    const b2 = getBoxBounds(rawB2);
    const lead = 24;
    let points = [];

    const absDx = Math.abs(x2 - x1);
    const absDy = Math.abs(y2 - y1);

    // KASUS 1: KANAN KE KIRI (Output di kanan -> Input di kiri)
    if (fromType === 'output' && toType === 'input') {
      if (x2 >= x1 + 40) {
        if (absDy < 2) {
          points = [[x1, y1], [x2, y2]];
        } else {
          let midX = (x1 + x2) / 2;
          if (b1 && midX < b1.right + 12) midX = b1.right + 16;
          if (b2 && midX > b2.left - 12) midX = b2.left - 16;
          points = [
            [x1, y1],
            [midX, y1],
            [midX, y2],
            [x2, y2]
          ];
        }
      } else {
        // Kotak 2 berada di kiri atau sejajar vertikal (backward flow)
        let canPassBetweenY = false;
        let midY = 0;

        if (b1 && b2) {
          if (b2.top > b1.bottom + 20) {
            midY = (b1.bottom + b2.top) / 2;
            canPassBetweenY = true;
          } else if (b1.top > b2.bottom + 20) {
            midY = (b2.bottom + b1.top) / 2;
            canPassBetweenY = true;
          }
        }

        if (canPassBetweenY) {
          points = [
            [x1, y1],
            [x1 + lead, y1],
            [x1 + lead, midY],
            [x2 - lead, midY],
            [x2 - lead, y2],
            [x2, y2]
          ];
        } else {
          const topBypass = Math.min(b1 ? b1.top : y1, b2 ? b2.top : y2) - 28;
          const bottomBypass = Math.max(b1 ? b1.bottom : y1, b2 ? b2.bottom : y2) + 28;
          const bypassY = (y2 <= y1) ? topBypass : bottomBypass;

          points = [
            [x1, y1],
            [x1 + lead, y1],
            [x1 + lead, bypassY],
            [x2 - lead, bypassY],
            [x2 - lead, y2],
            [x2, y2]
          ];
        }
      }
    }
    // KASUS 2: KIRI KE KANAN (Input di kiri -> Output di kanan)
    else if (fromType === 'input' && toType === 'output') {
      if (x1 >= x2 + 40) {
        if (absDy < 2) {
          points = [[x1, y1], [x2, y2]];
        } else {
          let midX = (x1 + x2) / 2;
          if (b1 && midX > b1.left - 12) midX = b1.left - 16;
          if (b2 && midX < b2.right + 12) midX = b2.right + 16;
          points = [
            [x1, y1],
            [midX, y1],
            [midX, y2],
            [x2, y2]
          ];
        }
      } else {
        let canPassBetweenY = false;
        let midY = 0;

        if (b1 && b2) {
          if (b2.top > b1.bottom + 20) {
            midY = (b1.bottom + b2.top) / 2;
            canPassBetweenY = true;
          } else if (b1.top > b2.bottom + 20) {
            midY = (b2.bottom + b1.top) / 2;
            canPassBetweenY = true;
          }
        }

        if (canPassBetweenY) {
          points = [
            [x1, y1],
            [x1 - lead, y1],
            [x1 - lead, midY],
            [x2 + lead, midY],
            [x2 + lead, y2],
            [x2, y2]
          ];
        } else {
          const topBypass = Math.min(b1 ? b1.top : y1, b2 ? b2.top : y2) - 28;
          const bottomBypass = Math.max(b1 ? b1.bottom : y1, b2 ? b2.bottom : y2) + 28;
          const bypassY = (y2 <= y1) ? topBypass : bottomBypass;

          points = [
            [x1, y1],
            [x1 - lead, y1],
            [x1 - lead, bypassY],
            [x2 + lead, bypassY],
            [x2 + lead, y2],
            [x2, y2]
          ];
        }
      }
    }
    // KASUS 3: KANAN KE KANAN (Output ke Output)
    else if (fromType === 'output' && toType === 'output') {
      const maxX = Math.max(b1 ? b1.right : x1, b2 ? b2.right : x2) + 28;
      points = [
        [x1, y1],
        [maxX, y1],
        [maxX, y2],
        [x2, y2]
      ];
    }
    // KASUS 4: KIRI KE KIRI (Input ke Input)
    else if (fromType === 'input' && toType === 'input') {
      const minX = Math.min(b1 ? b1.left : x1, b2 ? b2.left : x2) - 28;
      points = [
        [x1, y1],
        [minX, y1],
        [minX, y2],
        [x2, y2]
      ];
    }
    // Fallback umum
    else {
      const midX = (x1 + x2) / 2;
      points = [[x1, y1], [midX, y1], [midX, y2], [x2, y2]];
    }

    return pointsToRoundedPath(points, 12);
  }

  // Alias kompatibilitas
  function calculatePipeBezier(x1, y1, x2, y2, fromType = 'output', toType = 'input', b1 = null, b2 = null) {
    return calculatePipeElbow(x1, y1, x2, y2, fromType, toType, b1, b2);
  }

  // Live dragging pipe preview (smooth responsive elbow)
  function calculateDragBezier(sx, sy, mx, my, fromType = 'output', targetType = null) {
    const toType = targetType || (fromType === 'output' ? 'input' : 'output');
    const b1 = (connectFrom && connectFrom.boxId) ? getBoxBounds(connectFrom.boxId) : null;
    return calculatePipeElbow(sx, sy, mx, my, fromType, toType, b1, null);
  }

  function isSamePortRef(el, boxId, subId) {
    if (!el || !boxId) return false;
    const bId = el.dataset.boxId;
    const sId = el.dataset.subId || null;
    return bId === boxId && sId === (subId || null);
  }

  // Robust target finding supporting any port across other boxes with 48px proximity snap
  function findPortTarget(clientX, clientY, excludeBoxId = null, excludeSubId = null) {
    const target = document.elementFromPoint(clientX, clientY);
    if (target) {
      const directPort = target.closest('.main-port, .sub-port');
      if (directPort && !isSamePortRef(directPort, excludeBoxId, excludeSubId)) {
        return directPort;
      }

      const subBox = target.closest('.sub-box');
      if (subBox) {
        const anySubPort = subBox.querySelector('.sub-port');
        if (anySubPort && !isSamePortRef(anySubPort, excludeBoxId, excludeSubId)) return anySubPort;
      }

      const mainBox = target.closest('.main-box');
      if (mainBox) {
        const anyMainPort = mainBox.querySelector('.main-port');
        if (anyMainPort && !isSamePortRef(anyMainPort, excludeBoxId, excludeSubId)) return anyMainPort;
      }
    }

    const allPorts = document.querySelectorAll('.main-port, .sub-port');
    let bestPort = null;
    let bestDist = 48;

    allPorts.forEach(p => {
      if (isSamePortRef(p, excludeBoxId, excludeSubId)) return;
      const r = p.getBoundingClientRect();
      const px = r.left + r.width / 2;
      const py = r.top + r.height / 2;
      const dist = Math.hypot(clientX - px, clientY - py);
      if (dist < bestDist) {
        bestDist = dist;
        bestPort = p;
      }
    });

    return bestPort;
  }

  // Backward compatibility alias
  function findInputPortTarget(clientX, clientY) {
    return findPortTarget(clientX, clientY);
  }

  // Neo-Brutalist Clean Header Colors
  const BOX_HEADER_COLORS = [
    '#fef08a', // Pastel Yellow
    '#e9d5ff', // Pastel Purple
    '#bbf7d0', // Pastel Mint
    '#bae6fd', // Pastel Sky
    '#fed7aa', // Pastel Orange
    '#fbcfe8', // Pastel Pink
    '#ffffff'  // Pure White
  ];

  const NOTE_COLORS = [
    '#fef08a', // Sticky Yellow
    '#bae6fd', // Sticky Sky
    '#bbf7d0', // Sticky Mint
    '#fed7aa', // Sticky Peach
    '#fbcfe8', // Sticky Pink
    '#e9d5ff'  // Sticky Lavender
  ];

  // DOM Elements
  const viewport = document.getElementById('viewport');
  const board = document.getElementById('board');
  const svg = document.getElementById('svgCanvas');
  const connectionsGroup = document.getElementById('connectionsGroup');
  const tempConnectionGroup = document.getElementById('tempConnectionGroup');
  const emptyState = document.getElementById('emptyState');
  const projectTitleInput = document.getElementById('projectTitle');
  const zoomLevelEl = document.getElementById('zoomLevel');
  const saveStatusEl = document.getElementById('saveStatus');

  // Sidebar Elements
  const sidebarPanel = document.getElementById('sidebarPanel');
  const sbProjectName = document.getElementById('sbProjectName');
  const prdTreeContent = document.getElementById('prdTreeContent');
  const pipesListContent = document.getElementById('pipesListContent');
  const notesListContent = document.getElementById('notesListContent');
  const pipeCountBadge = document.getElementById('pipeCountBadge');
  const noteCountBadge = document.getElementById('noteCountBadge');
  const statNodes = document.getElementById('statNodes');
  const statSubs = document.getElementById('statSubs');
  const statFeatures = document.getElementById('statFeatures');
  const statPipes = document.getElementById('statPipes');

  // Feature Modal Elements
  const featuresModal = document.getElementById('featuresModal');
  const modalFeatureTitle = document.getElementById('modalFeatureTitle');
  const modalFeatureSubtitle = document.getElementById('modalFeatureSubtitle');
  const modalFeaturesTextarea = document.getElementById('modalFeaturesTextarea');
  const modalTechInput = document.getElementById('modalTechInput');
  const modalProtocolInput = document.getElementById('modalProtocolInput');

  // Prompt Modal Elements
  const promptModal = document.getElementById('promptModal');
  const promptModeSelect = document.getElementById('promptModeSelect');
  const promptTargetModel = document.getElementById('promptTargetModel');
  const promptLanguage = document.getElementById('promptLanguage');
  const promptExtraNotes = document.getElementById('promptExtraNotes');
  const promptResultTextarea = document.getElementById('promptResultTextarea');
  const promptTokenEstimate = document.getElementById('promptTokenEstimate');
  const promptIncludedSummary = document.getElementById('promptIncludedSummary');

  // In-Dashboard Confirm Modal Elements
  const confirmModal = document.getElementById('confirmModal');
  const confirmModalTitle = document.getElementById('confirmModalTitle');
  const confirmModalMessage = document.getElementById('confirmModalMessage');
  const confirmOkBtn = document.getElementById('confirmOkBtn');
  const confirmOkText = document.getElementById('confirmOkText');
  const confirmCancelBtn = document.getElementById('confirmCancelBtn');
  const closeConfirmModal = document.getElementById('closeConfirmModal');
  let currentConfirmCallback = null;

  function showConfirmDialog({ title = 'Konfirmasi Tindakan', message, okText = 'Hapus', onConfirm }) {
    if (confirmModalTitle) {
      confirmModalTitle.innerHTML = `<i class="fas fa-triangle-exclamation"></i> ${escapeHtml(title)}`;
    }
    if (confirmModalMessage) {
      confirmModalMessage.textContent = message;
    }
    if (confirmOkText) {
      confirmOkText.textContent = okText;
    }
    currentConfirmCallback = onConfirm;
    if (confirmModal) confirmModal.classList.add('active');
  }

  function hideConfirmDialog() {
    if (confirmModal) confirmModal.classList.remove('active');
    currentConfirmCallback = null;
  }

  if (confirmOkBtn) {
    confirmOkBtn.addEventListener('click', () => {
      const cb = currentConfirmCallback;
      hideConfirmDialog();
      if (typeof cb === 'function') cb();
    });
  }

  if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', hideConfirmDialog);
  if (closeConfirmModal) closeConfirmModal.addEventListener('click', hideConfirmDialog);
  if (confirmModal) {
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) hideConfirmDialog();
    });
  }

  // ============================================================
  // LANDING PAGE & DASHBOARD NAVIGATION ELEMENTS
  // ============================================================
  const landingPage = document.getElementById('landingPage');
  const dashboardApp = document.getElementById('dashboardApp');
  const backToLandingBtn = document.getElementById('backToLandingBtn');

  const landingCtaNavBtn = document.getElementById('landingCtaNavBtn');
  const heroStartBtn = document.getElementById('heroStartBtn');
  const heroDemoBtn = document.getElementById('heroDemoBtn');
  const heroJoinRoomBtn = document.getElementById('heroJoinRoomBtn');
  const splitStartBtn = document.getElementById('splitStartBtn');
  const bannerStartBtn = document.getElementById('bannerStartBtn');

  // Google Auth Elements
  const googleAuthModal = document.getElementById('googleAuthModal');
  const closeGoogleAuthModal = document.getElementById('closeGoogleAuthModal');
  const cancelGoogleAuthBtn = document.getElementById('cancelGoogleAuthBtn');
  const landingGoogleLoginBtn = document.getElementById('landingGoogleLoginBtn');
  const landingGoogleBtnLabel = document.getElementById('landingGoogleBtnLabel');
  const dashboardGoogleLoginBtn = document.getElementById('dashboardGoogleLoginBtn');
  const quickLoginDevBtn = document.getElementById('quickLoginDevBtn');
  const quickLoginArchBtn = document.getElementById('quickLoginArchBtn');
  const customUserNameInput = document.getElementById('customUserNameInput');
  const confirmCustomLoginBtn = document.getElementById('confirmCustomLoginBtn');
  const userProfileCard = document.getElementById('userProfileCard');
  const userNameLabel = document.getElementById('userNameLabel');
  const userAvatarImg = document.getElementById('userAvatarImg');
  const userLogoutBtn = document.getElementById('userLogoutBtn');

  // Real-time Collaboration Elements
  const roomBadgePill = document.getElementById('roomBadgePill');
  const roomNameText = document.getElementById('roomNameText');
  const shareRoomBtn = document.getElementById('shareRoomBtn');
  const collabAvatarsStack = document.getElementById('collabAvatarsStack');
  const inviteModal = document.getElementById('inviteModal');
  const closeInviteModal = document.getElementById('closeInviteModal');
  const closeInviteBottomBtn = document.getElementById('closeInviteBottomBtn');
  const roomShareLinkInput = document.getElementById('roomShareLinkInput');
  const copyRoomLinkBtn = document.getElementById('copyRoomLinkBtn');
  const switchRoomIdInput = document.getElementById('switchRoomIdInput');
  const switchRoomBtn = document.getElementById('switchRoomBtn');
  const modalOnlineList = document.getElementById('modalOnlineList');
  const remoteCursorsLayer = document.getElementById('remoteCursorsLayer');

  // Mobile Controls
  const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
  const mAddBoxBtn = document.getElementById('mAddBoxBtn');
  const mAddNoteBtn = document.getElementById('mAddNoteBtn');
  const mPromptBtn = document.getElementById('mPromptBtn');
  const mCenterBtn = document.getElementById('mCenterBtn');
  const mSidebarBtn = document.getElementById('mSidebarBtn');
  const mPngBtn = document.getElementById('mPngBtn');
  const mMdBtn = document.getElementById('mMdBtn');

  // User Profile & Realtime Collaboration State
  const USER_STORAGE_KEY = 'rancang_bareng_user_v2';
  let currentUser = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    name: 'Tamu Arsitek',
    email: 'guest@rancangbareng.studio',
    avatar: 'A',
    color: '#2563eb'
  };

  const USER_COLORS = ['#2563eb', '#16a34a', '#9333ea', '#ea580c', '#e11d48', '#0891b2'];
  const urlParamRoom = new URLSearchParams(window.location.search).get('room');
  let currentRoomId = (urlParamRoom && urlParamRoom.trim().length > 0) ? urlParamRoom.trim() : null;
  let collabChannel = null;
  const activeCollaborators = new Map(); // id -> { id, name, avatar, color, lastSeen }
  let lastCursorBroadcast = 0;
  let isReceivingRemoteSync = false;

  function generateUniqueRoomId() {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let res = 'rb-';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }

  function getRoomShareUrl(roomId) {
    let path = window.location.pathname;
    if (path.endsWith('index.html')) {
      path = path.replace(/index\.html$/, 'workspace.html');
    } else if (!path.endsWith('workspace.html') && !path.includes('.')) {
      path = path.replace(/\/?$/, '/workspace.html');
    }
    return `${window.location.origin}${path}?room=${encodeURIComponent(roomId || currentRoomId || '')}`;
  }

  // ============================================================
  // MULTI-PROJECT STORAGE & PERSISTENCE (TLDRAW STYLE)
  // ============================================================
  const PROJECTS_INDEX_KEY = 'rancang_projects_list_v1';
  let currentProjectId = localStorage.getItem('rancang_active_project_id') || 'proj_default';

  function getProjectStorageKey(id) {
    return `rancang_project_data_${id}`;
  }

  function getProjectsList() {
    try {
      const raw = localStorage.getItem(PROJECTS_INDEX_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'proj_default',
        title: projectTitle || 'Arsitektur Utama',
        updatedAt: Date.now(),
        boxCount: mainBoxes.length,
        pipeCount: connections.length
      }
    ];
  }

  function saveProjectsList(list) {
    try {
      localStorage.setItem(PROJECTS_INDEX_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn(e);
    }
  }

  function updateProjectIndex() {
    const list = getProjectsList();
    const idx = list.findIndex(p => p.id === currentProjectId);
    const item = {
      id: currentProjectId,
      title: projectTitle.trim() || (currentLang === 'en' ? 'Untitled Architecture' : 'Arsitektur Tanpa Judul'),
      updatedAt: Date.now(),
      boxCount: mainBoxes.length,
      pipeCount: connections.length
    };
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    saveProjectsList(list);
  }

  function saveToLocalStorage() {
    try {
      const data = {
        id: currentProjectId,
        projectTitle,
        mainBoxes,
        notes,
        connections,
        mainBoxCounter,
        subCounter,
        noteCounter,
        connCounter,
        panX,
        panY,
        zoom,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(getProjectStorageKey(currentProjectId), JSON.stringify(data));
      localStorage.setItem('rancang_active_project_id', currentProjectId);
      updateProjectIndex();
      flashSaveIndicator();
      if (!isReceivingRemoteSync) {
        broadcastSync(data);
      }
    } catch (err) {
      console.warn('Gagal simpan ke storage:', err);
    }
  }

  function loadFromLocalStorage(targetId = currentProjectId) {
    try {
      currentProjectId = targetId;
      localStorage.setItem('rancang_active_project_id', currentProjectId);
      const raw = localStorage.getItem(getProjectStorageKey(targetId));
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.mainBoxes)) return false;

      projectTitle = data.projectTitle || '';
      mainBoxes = data.mainBoxes || [];
      notes = data.notes || [];
      connections = data.connections || [];
      mainBoxCounter = data.mainBoxCounter || mainBoxes.length;
      subCounter = data.subCounter || 0;
      noteCounter = data.noteCounter || notes.length;
      connCounter = data.connCounter || connections.length;
      if (typeof data.panX === 'number') panX = data.panX;
      if (typeof data.panY === 'number') panY = data.panY;
      if (typeof data.zoom === 'number') zoom = data.zoom;

      if (projectTitleInput) projectTitleInput.value = projectTitle;
      return true;
    } catch (e) {
      console.error('Error load:', e);
      return false;
    }
  }

  function createNewProject(customTitle = '') {
    currentProjectId = 'proj_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    projectTitle = customTitle || (currentLang === 'en' ? 'New Architecture' : 'Arsitektur Baru');
    mainBoxes = [];
    notes = [];
    connections = [];
    mainBoxCounter = 0;
    subCounter = 0;
    noteCounter = 0;
    connCounter = 0;
    panX = 80;
    panY = 70;
    zoom = 1;
    if (projectTitleInput) projectTitleInput.value = projectTitle;
    render();
    centerView();
    saveToLocalStorage();
    renderProjectsModal();
    showToast(currentLang === 'en' ? 'New blank project created!' : 'Proyek baru berhasil dibuat!');
  }

  function duplicateCurrentProject() {
    const oldTitle = projectTitle || 'Arsitektur';
    currentProjectId = 'proj_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    projectTitle = oldTitle + (currentLang === 'en' ? ' (Copy)' : ' (Salinan)');
    if (projectTitleInput) projectTitleInput.value = projectTitle;
    saveToLocalStorage();
    renderProjectsModal();
    showToast(currentLang === 'en' ? 'Project duplicated!' : 'Proyek berhasil diduplikasi!');
  }

  function switchProject(targetId) {
    if (targetId === currentProjectId) return;
    saveToLocalStorage();
    loadFromLocalStorage(targetId);
    render();
    centerView();
    renderProjectsModal();
    showToast(currentLang === 'en' ? 'Switched project' : 'Berpindah proyek');
  }

  function deleteProject(targetId) {
    let list = getProjectsList().filter(p => p.id !== targetId);
    localStorage.removeItem(getProjectStorageKey(targetId));
    if (list.length === 0) {
      saveProjectsList(list);
      createNewProject();
      return;
    }
    saveProjectsList(list);
    if (currentProjectId === targetId) {
      switchProject(list[0].id);
    } else {
      renderProjectsModal();
    }
    showToast(currentLang === 'en' ? 'Project deleted' : 'Proyek dihapus');
  }

  function copySnapshotLink() {
    try {
      const payload = {
        v: 1,
        title: projectTitle,
        boxes: mainBoxes,
        notes: notes,
        conns: connections
      };
      const jsonStr = JSON.stringify(payload);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      const url = `${window.location.origin}${window.location.pathname}#snapshot=${encoded}`;
      navigator.clipboard.writeText(url).then(() => {
        showToast(currentLang === 'en' ? 'Snapshot link copied! Anyone can view with zero server.' : 'Tautan snapshot tersalin ke clipboard! (Bebas server)');
      }).catch(() => {
        prompt('Salin tautan snapshot berikut:', url);
      });
    } catch (err) {
      showToast('Gagal membuat link snapshot: ' + err.message, true);
    }
  }

  function checkUrlSnapshotImport() {
    if (window.location.hash.startsWith('#snapshot=')) {
      try {
        const raw = window.location.hash.replace('#snapshot=', '');
        const decoded = decodeURIComponent(escape(atob(raw)));
        const data = JSON.parse(decoded);
        if (data && Array.isArray(data.boxes)) {
          createNewProject(data.title ? data.title + ' (Imported)' : 'Arsitektur Impor');
          mainBoxes = data.boxes || [];
          notes = data.notes || [];
          connections = data.conns || [];
          mainBoxCounter = mainBoxes.length + 5;
          noteCounter = notes.length + 5;
          connCounter = connections.length + 5;
          render();
          centerView();
          saveToLocalStorage();
          showToast(currentLang === 'en' ? 'Snapshot imported successfully!' : 'Desain arsitektur dari link berhasil dibuka!');
          history.replaceState(null, '', window.location.pathname + '#dashboard');
          return true;
        }
      } catch (err) {
        console.warn('Gagal membaca snapshot URL:', err);
      }
    }
    return false;
  }

  function exportProjectRb() {
    const payload = {
      app: 'Rancang Bareng Studio',
      format: 'rb',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projectTitle,
      mainBoxes,
      notes,
      connections
    };
    const json = JSON.stringify(payload, null, 2);
    const filename = (projectTitle.trim() || 'rancang-bareng-proyek').replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.rb';
    const blob = new Blob([json], { type: 'application/octet-stream;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(currentLang === 'en' ? 'Project file (.rb) exported successfully!' : 'File proyek (.rb) berhasil diekspor!');
  }

  function importProjectRb(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const data = JSON.parse(text);
        const boxes = data.mainBoxes || data.boxes;
        if (!data || !Array.isArray(boxes)) {
          showToast('Format file .rb tidak valid atau data korup', true);
          return;
        }

        const importedTitle = (data.projectTitle || data.title || file.name.replace(/\.[^/.]+$/, '')) + (currentLang === 'en' ? ' (Imported)' : ' (Impor)');
        createNewProject(importedTitle);
        mainBoxes = boxes || [];
        notes = data.notes || [];
        connections = data.connections || data.conns || [];
        mainBoxCounter = mainBoxes.length + 5;
        noteCounter = notes.length + 5;
        connCounter = connections.length + 5;
        render();
        centerView();
        saveToLocalStorage();
        renderProjectsModal();
        showToast(currentLang === 'en' ? 'Project (.rb) imported successfully!' : 'File proyek (.rb) berhasil diimpor!');
      } catch (err) {
        showToast('Gagal membaca file .rb: ' + err.message, true);
      }
    };
    reader.readAsText(file);
  }

  function renderProjectsModal() {
    const container = document.getElementById('projectsListContainer') || document.getElementById('projectItemsList');
    if (!container) return;
    const list = getProjectsList();
    if (list.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:15px; color:#64748b; font-size:0.8rem;">Belum ada proyek tersimpan.</div>`;
      return;
    }
    let html = '';
    list.forEach(p => {
      const isActive = p.id === currentProjectId;
      const dateStr = new Date(p.updatedAt || Date.now()).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'id-ID', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      });
      html += `
        <div class="project-item-row ${isActive ? 'active' : ''}">
          <div class="pi-info" data-switch-proj="${escapeHtml(p.id)}">
            <span class="pi-title">${escapeHtml(p.title || 'Arsitektur Tanpa Judul')} ${isActive ? '(Aktif)' : ''}</span>
            <span class="pi-meta">${p.boxCount || 0} Kotak · ${p.pipeCount || 0} Pipa · ${dateStr}</span>
          </div>
          <div class="pi-actions">
            ${!isActive ? `<button class="nb-btn nb-btn-white btn-xs" data-switch-proj="${escapeHtml(p.id)}" title="Buka Proyek"><i class="fas fa-folder-open"></i> Buka</button>` : ''}
            <button class="pipe-del-btn" data-del-proj="${escapeHtml(p.id)}" title="Hapus Proyek" ${list.length <= 1 ? 'disabled style="opacity:0.3;"' : ''}><i class="fas fa-trash-can"></i></button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;

    container.querySelectorAll('[data-switch-proj]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.switchProj;
        switchProject(id);
      });
    });

    container.querySelectorAll('[data-del-proj]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.delProj;
        const target = list.find(p => p.id === id);
        showConfirmDialog({
          title: 'Hapus Proyek',
          message: `Hapus proyek "${target ? target.title : 'ini'}"? Tindakan ini tidak dapat dibatalkan.`,
          okText: 'Hapus Proyek',
          onConfirm: () => deleteProject(id)
        });
      });
    });
  }

  // Project Modal Listeners & RB File Handling
  const projectModal = document.getElementById('projectModal');
  const projectManagerBtn = document.getElementById('projectManagerBtn');
  const closeProjectModal = document.getElementById('closeProjectModal');
  const closeProjectModalBottomBtn = document.getElementById('closeProjectModalBottomBtn');
  const createNewProjectBtn = document.getElementById('createNewProjectBtn');
  const duplicateProjectBtn = document.getElementById('duplicateProjectBtn');
  const shareSnapshotLinkBtn = document.getElementById('shareSnapshotLinkBtn');
  const exportProjectRbBtn = document.getElementById('exportProjectRbBtn');
  const importProjectRbBtn = document.getElementById('importProjectRbBtn');
  const rbFileInput = document.getElementById('rbFileInput');

  if (projectManagerBtn) {
    projectManagerBtn.addEventListener('click', () => {
      renderProjectsModal();
      if (projectModal) projectModal.classList.add('active');
    });
  }
  if (closeProjectModal) closeProjectModal.addEventListener('click', () => projectModal?.classList.remove('active'));
  if (closeProjectModalBottomBtn) closeProjectModalBottomBtn.addEventListener('click', () => projectModal?.classList.remove('active'));
  if (createNewProjectBtn) createNewProjectBtn.addEventListener('click', () => createNewProject());
  if (duplicateProjectBtn) duplicateProjectBtn.addEventListener('click', duplicateCurrentProject);
  if (shareSnapshotLinkBtn) shareSnapshotLinkBtn.addEventListener('click', copySnapshotLink);
  if (exportProjectRbBtn) exportProjectRbBtn.addEventListener('click', exportProjectRb);
  if (importProjectRbBtn && rbFileInput) {
    importProjectRbBtn.addEventListener('click', () => rbFileInput.click());
  }
  if (rbFileInput) {
    rbFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        importProjectRb(e.target.files[0]);
        e.target.value = '';
      }
    });
  }
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) projectModal.classList.remove('active');
    });
  }

  // EXPORT DROPDOWN MENU TOGGLE & CLICK-OUTSIDE
  const exportDropdownWrap = document.getElementById('exportDropdownWrap');
  const exportMenuTriggerBtn = document.getElementById('exportMenuTriggerBtn');
  const headerExportRbBtn = document.getElementById('headerExportRbBtn');
  const headerImportRbBtn = document.getElementById('headerImportRbBtn');

  if (exportMenuTriggerBtn && exportDropdownWrap) {
    exportMenuTriggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = exportDropdownWrap.classList.toggle('open');
      exportMenuTriggerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!exportDropdownWrap.contains(e.target)) {
        exportDropdownWrap.classList.remove('open');
        exportMenuTriggerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (headerExportRbBtn) {
    headerExportRbBtn.addEventListener('click', () => {
      exportDropdownWrap?.classList.remove('open');
      exportProjectRb();
    });
  }

  if (headerImportRbBtn && rbFileInput) {
    headerImportRbBtn.addEventListener('click', () => {
      exportDropdownWrap?.classList.remove('open');
      rbFileInput.click();
    });
  }



  function flashSaveIndicator() {
    if (!saveStatusEl) return;
    const dot = saveStatusEl.querySelector('.status-indicator');
    dot.style.background = '#22c55e';
    setTimeout(() => {
      dot.style.background = '#16a34a';
    }, 400);
  }

  // ============================================================
  // USER PROFILE (INSTANT USERNAME & COLOR PICKER - NO GOOGLE REQUIRED)
  // ============================================================
  const userNameInput = document.getElementById('userNameInput');
  const userAvatarBtn = document.getElementById('userAvatarBtn');
  const userAvatarInitial = document.getElementById('userAvatarInitial');

  function initUserAuth() {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        currentUser = JSON.parse(saved);
      }
    } catch (e) {
      console.warn(e);
    }

    if (!currentUser || !currentUser.name) {
      const randColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
      const defaultNames = ['Arsitek Alpha', 'Rian Lead', 'Alex Frontend', 'Devika Backend', 'Arsitek Sistem', 'Kawan Studio'];
      const randName = defaultNames[Math.floor(Math.random() * defaultNames.length)];
      currentUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        name: randName,
        avatar: randName.charAt(0).toUpperCase(),
        color: randColor
      };
      try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser)); } catch (err) {}
    }

    updateUserAuthUI();

    if (userNameInput) {
      userNameInput.value = currentUser.name;
      userNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          currentUser.name = val;
          currentUser.avatar = val.charAt(0).toUpperCase();
          if (userAvatarInitial) userAvatarInitial.textContent = currentUser.avatar;
          try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser)); } catch (err) {}
          broadcastPresence();
          updateCollaboratorsUI();
        }
      });
    }

    if (userAvatarBtn) {
      userAvatarBtn.addEventListener('click', () => {
        const idx = USER_COLORS.indexOf(currentUser.color);
        const nextIdx = (idx + 1) % USER_COLORS.length;
        currentUser.color = USER_COLORS[nextIdx];
        updateUserAuthUI();
        try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser)); } catch (err) {}
        showToast('Warna kursor kamu diubah!', false);
        broadcastPresence();
        updateCollaboratorsUI();
      });
    }
  }

  function updateUserAuthUI() {
    if (!currentUser) return;
    if (userNameInput && userNameInput.value !== currentUser.name) {
      userNameInput.value = currentUser.name;
    }
    if (userAvatarInitial) {
      userAvatarInitial.textContent = (currentUser.name || 'A').charAt(0).toUpperCase();
    }
    if (userAvatarBtn) {
      userAvatarBtn.style.background = currentUser.color || '#2563eb';
    }
  }

  // ============================================================
  // REAL-TIME MULTIPLAYER COLLABORATION ENGINE (INTERNET WIDE)
  // ============================================================
  let mqttClient = null;
  let activeRoomTopic = null;

  function initRealtimeCollab(roomId = currentRoomId) {
    currentRoomId = roomId ? roomId.trim() : null;

    // 1. JIKA BELUM DIBAGIKAN (MODE PRIBADI / SOLO):
    // Setiap orang yang buka web utama masuk ke kanvas pribadinya masing-masing,
    // tidak terhubung dan tidak saling menimpa dengan orang lain.
    if (!currentRoomId) {
      if (mqttClient) {
        try { mqttClient.end(true); } catch (_) {}
        mqttClient = null;
      }
      activeRoomTopic = null;

      if (roomNameText) {
        roomNameText.textContent = currentLang === 'en' ? 'Private (Solo)' : 'Pribadi (Solo)';
      }
      if (roomBadgePill) {
        roomBadgePill.title = currentLang === 'en'
          ? 'Private Canvas (Only you). Click Share to invite your team.'
          : 'Kanvas Pribadi (Hanya Kamu). Klik Bagikan untuk kolaborasi bersama tim.';
        const dot = roomBadgePill.querySelector('.room-status-dot');
        if (dot) dot.className = 'room-status-dot solo';
      }
      if (switchRoomIdInput) switchRoomIdInput.value = '';
      if (roomShareLinkInput) roomShareLinkInput.value = '';

      activeCollaborators.clear();
      activeCollaborators.set(currentUser.id, {
        ...currentUser,
        lastSeen: Date.now()
      });
      updateCollaboratorsUI();
      return;
    }

    // 2. JIKA SUDAH DIBAGIKAN / MASUK LEWAT LINK SHARE (MODE KOLABORASI LIVE):
    activeRoomTopic = `rancangbareng/v1/room_${encodeURIComponent(currentRoomId)}`;

    if (roomNameText) {
      roomNameText.textContent = `Room: #${currentRoomId}`;
    }
    if (roomBadgePill) {
      roomBadgePill.title = `Ruang Kolaborasi Aktif #${currentRoomId}. Klik untuk kelola link & tim.`;
      const dot = roomBadgePill.querySelector('.room-status-dot');
      if (dot) dot.className = 'room-status-dot live';
    }
    if (switchRoomIdInput) switchRoomIdInput.value = currentRoomId;

    const shareUrl = getRoomShareUrl(currentRoomId);
    if (roomShareLinkInput) roomShareLinkInput.value = shareUrl;

    // Disconnect client lama jika ganti room
    if (mqttClient) {
      try { mqttClient.end(true); } catch (_) {}
      mqttClient = null;
    }

    // Fallback lokal: BroadcastChannel (antar-tab di satu perangkat)
    try {
      if (collabChannel) collabChannel.close();
      collabChannel = new BroadcastChannel('rb_collab_' + currentRoomId);
      collabChannel.onmessage = handleCollabMessage;
    } catch (e) {}

    window.addEventListener('storage', (e) => {
      if (currentRoomId && e.key === 'rb_broadcast_' + currentRoomId && e.newValue) {
        try {
          const msg = JSON.parse(e.newValue);
          if (msg && msg.senderId !== currentUser?.id) {
            handleCollabMessage({ data: msg });
          }
        } catch (err) {}
      }
    });

    // KONEKSI ONLINE INTERNET VIA WEBSOCKET MQTT (Hanya aktif jika sudah masuk Room!)
    if (typeof mqtt !== 'undefined') {
      try {
        const clientId = 'rb_' + Math.random().toString(36).substring(2, 9);
        mqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
          clientId,
          clean: true,
          connectTimeout: 5000,
          reconnectPeriod: 3000
        });

        mqttClient.on('connect', () => {
          console.log('[Collab] Online internet sync connected for room:', currentRoomId);
          mqttClient.subscribe(activeRoomTopic, { qos: 0 });
          showToast(`Terhubung ke Ruang Kolaborasi #${currentRoomId}!`, false);
          broadcast({ type: 'user_join', user: currentUser });
          broadcast({ type: 'request_state' });
        });

        mqttClient.on('message', (topic, payload) => {
          if (topic === activeRoomTopic) {
            try {
              const msg = JSON.parse(payload.toString());
              if (msg && msg.senderId !== currentUser?.id) {
                handleCollabMessage({ data: msg });
              }
            } catch (err) {}
          }
        });

        mqttClient.on('error', (err) => {
          console.warn('[Collab] Broker status:', err);
        });
      } catch (err) {
        console.warn('[Collab] Online sync initialization error:', err);
      }
    }

    activeCollaborators.set(currentUser.id, {
      ...currentUser,
      lastSeen: Date.now()
    });
    updateCollaboratorsUI();

    broadcast({ type: 'user_join', user: currentUser });
    broadcast({ type: 'request_state' });

    setInterval(() => {
      if (currentRoomId) {
        broadcastPresence();
        cleanupInactiveCollaborators();
      }
    }, 3500);
  }

  function broadcast(msg) {
    // Mode Pribadi: Jangan broadcast keluar sama sekali!
    if (!currentRoomId || !currentUser) return;

    msg.senderId = currentUser.id;
    msg.timestamp = Date.now();

    const topic = activeRoomTopic || `rancangbareng/v1/room_${encodeURIComponent(currentRoomId)}`;

    // Kirim lewat WebSocket Internet Publik (Real-Time ke rekan tim di room ini)
    if (mqttClient && mqttClient.connected) {
      try {
        mqttClient.publish(topic, JSON.stringify(msg));
      } catch (e) {}
    }

    // Fallback lokal perangkat
    if (collabChannel) {
      try { collabChannel.postMessage(msg); } catch (e) {}
    }
    try {
      localStorage.setItem('rb_broadcast_' + currentRoomId, JSON.stringify(msg));
    } catch (e) {}
  }

  function broadcastPresence() {
    if (!currentRoomId || !currentUser) return;
    broadcast({ type: 'presence_ping', user: currentUser });
    activeCollaborators.set(currentUser.id, {
      ...currentUser,
      lastSeen: Date.now()
    });
    updateCollaboratorsUI();
  }

  function broadcastSync(data) {
    if (!currentRoomId || isReceivingRemoteSync) return;
    broadcast({
      type: 'canvas_sync',
      data: {
        projectTitle: data.projectTitle,
        mainBoxes: data.mainBoxes,
        notes: data.notes,
        connections: data.connections,
        mainBoxCounter: data.mainBoxCounter,
        subCounter: data.subCounter,
        noteCounter: data.noteCounter,
        connCounter: data.connCounter
      }
    });
  }

  function handleCollabMessage(event) {
    const msg = event.data;
    if (!msg || msg.senderId === currentUser?.id) return;

    if (msg.type === 'cursor') {
      renderRemoteCursor(msg.senderId, msg.user, msg.x, msg.y);
    } else if (msg.type === 'canvas_sync') {
      isReceivingRemoteSync = true;
      try {
        if (msg.data) {
          projectTitle = msg.data.projectTitle || projectTitle;
          mainBoxes = msg.data.mainBoxes || mainBoxes;
          notes = msg.data.notes || notes;
          connections = msg.data.connections || connections;
          if (msg.data.mainBoxCounter) mainBoxCounter = msg.data.mainBoxCounter;
          if (msg.data.subCounter) subCounter = msg.data.subCounter;
          if (msg.data.noteCounter) noteCounter = msg.data.noteCounter;
          if (msg.data.connCounter) connCounter = msg.data.connCounter;
          if (projectTitleInput) projectTitleInput.value = projectTitle;
          render();
        }
      } finally {
        isReceivingRemoteSync = false;
      }
    } else if (msg.type === 'request_state') {
      broadcastSync({
        projectTitle,
        mainBoxes,
        notes,
        connections,
        mainBoxCounter,
        subCounter,
        noteCounter,
        connCounter
      });
    } else if (msg.type === 'presence_ping' || msg.type === 'user_join') {
      if (msg.user) {
        activeCollaborators.set(msg.senderId, {
          ...msg.user,
          lastSeen: Date.now()
        });
        updateCollaboratorsUI();
        if (msg.type === 'user_join') {
          showToast(`${msg.user.name} bergabung ke room!`);
        }
      }
    }
  }

  function renderRemoteCursor(senderId, user, x, y) {
    if (!remoteCursorsLayer) return;
    let cursorEl = document.getElementById('cursor-' + senderId);
    if (!cursorEl) {
      cursorEl = document.createElement('div');
      cursorEl.className = 'remote-user-cursor';
      cursorEl.id = 'cursor-' + senderId;

      const color = user?.color || '#2563eb';
      cursorEl.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 3L19 12L12 14L9 20L4 3Z" fill="${color}" stroke="#000000" stroke-width="1.8"/>
        </svg>
        <span class="remote-cursor-flag" style="background:${color};">${escapeHtml(user?.name || 'Rekan')}</span>
      `;
      remoteCursorsLayer.appendChild(cursorEl);
    }

    cursorEl.style.transform = `translate(${x}px, ${y}px)`;
    cursorEl.dataset.lastActive = Date.now();
  }

  function cleanupInactiveCollaborators() {
    const now = Date.now();
    if (remoteCursorsLayer) {
      remoteCursorsLayer.querySelectorAll('.remote-user-cursor').forEach(c => {
        const last = parseInt(c.dataset.lastActive || '0', 10);
        if (now - last > 6000) c.remove();
      });
    }

    for (const [id, user] of activeCollaborators.entries()) {
      if (id !== currentUser?.id && now - user.lastSeen > 12000) {
        activeCollaborators.delete(id);
      }
    }
    updateCollaboratorsUI();
  }

  function updateCollaboratorsUI() {
    if (!collabAvatarsStack) return;

    // Hanya tampilkan avatar pengguna lain jika benar-benar ada orang lain yang terhubung
    const otherUsers = Array.from(activeCollaborators.values()).filter(u => u.id !== currentUser?.id);
    if (otherUsers.length === 0) {
      collabAvatarsStack.innerHTML = '';
      collabAvatarsStack.style.display = 'none';
    } else {
      collabAvatarsStack.style.display = 'flex';
      collabAvatarsStack.innerHTML = otherUsers.slice(0, 4).map(u => `
        <div class="collab-avatar-chip" style="background:${u.color};" title="${escapeHtml(u.name)} (Online)">
          ${escapeHtml(u.name.charAt(0).toUpperCase())}
        </div>
      `).join('') + (otherUsers.length > 4 ? `<div class="collab-avatar-chip" style="background:#000;">+${otherUsers.length - 4}</div>` : '');
    }

    if (modalOnlineList) {
      if (otherUsers.length === 0) {
        modalOnlineList.innerHTML = `
          <div class="onb-item">
            <div class="onb-avatar" style="background:${currentUser?.color || '#3b82f6'};">${escapeHtml((currentUser?.name || 'A').charAt(0).toUpperCase())}</div>
            <span>${escapeHtml(currentUser?.name || 'Kamu')} (Kamu)</span>
          </div>
          <div style="font-size:0.75rem; color:#6b7280; padding:6px 4px;">
            ${currentLang === 'en' ? 'No other teammates connected yet. Share the link above to invite!' : 'Belum ada rekan lain yang terhubung. Bagikan link di atas untuk mengundang!'}
          </div>`;
      } else {
        const fullList = [currentUser, ...otherUsers].filter(Boolean);
        modalOnlineList.innerHTML = fullList.map(u => `
          <div class="onb-item">
            <div class="onb-avatar" style="background:${u.color};">${escapeHtml(u.name.charAt(0).toUpperCase())}</div>
            <span>${escapeHtml(u.name)} ${u.id === currentUser?.id ? '(Kamu)' : '<span style="color:#16a34a; font-size:0.72rem; font-weight:700;">● Online</span>'}</span>
          </div>
        `).join('');
      }
    }
  }

  function openInviteModal() {
    // Jika belum punya room kolaborasi (masih di Mode Pribadi / Solo):
    // Buatkan unique room ID baru otomatis (seperti Excalidraw / Google Docs)!
    if (!currentRoomId) {
      currentRoomId = generateUniqueRoomId();
      const newUrl = `${window.location.pathname}?room=${encodeURIComponent(currentRoomId)}#dashboard`;
      window.history.replaceState({ room: currentRoomId }, '', newUrl);

      // Inisialisasi koneksi multiplayer ke room unik baru ini
      initRealtimeCollab(currentRoomId);

      // Broadcast state kanvas saat ini agar rekan yang join langsung melihat kotaknya
      setTimeout(() => {
        saveToLocalStorage();
      }, 350);

      showToast('Ruang kolaborasi dibuat! Tautan siap dibagikan ke tim.', false);
    }

    const shareUrl = getRoomShareUrl(currentRoomId);
    if (roomShareLinkInput) roomShareLinkInput.value = shareUrl;
    if (switchRoomIdInput) switchRoomIdInput.value = currentRoomId;
    if (inviteModal) inviteModal.classList.add('active');
  }

  function leaveCollabRoom() {
    currentRoomId = null;
    let path = window.location.pathname;
    if (path.endsWith('index.html')) {
      path = path.replace(/index\.html$/, 'workspace.html');
    }
    window.history.replaceState({}, '', path);
    initRealtimeCollab(null);
    if (inviteModal) inviteModal.classList.remove('active');
    showToast('Kembali ke Mode Kanvas Pribadi (Solo).');
  }

  const leaveRoomBtn = document.getElementById('leaveRoomBtn');
  if (leaveRoomBtn) leaveRoomBtn.addEventListener('click', leaveCollabRoom);

  if (shareRoomBtn) {
    shareRoomBtn.addEventListener('click', () => {
      openInviteModal();
      if (roomShareLinkInput && roomShareLinkInput.value) {
        navigator.clipboard.writeText(roomShareLinkInput.value).then(() => {
          showToast('Tautan ruangan kolaborasi disalin ke clipboard!');
        }).catch(() => {});
      }
    });
  }
  if (roomBadgePill) roomBadgePill.addEventListener('click', openInviteModal);
  if (closeInviteModal) closeInviteModal.addEventListener('click', () => inviteModal?.classList.remove('active'));
  if (closeInviteBottomBtn) closeInviteBottomBtn.addEventListener('click', () => inviteModal?.classList.remove('active'));

  if (copyRoomLinkBtn) {
    copyRoomLinkBtn.addEventListener('click', () => {
      if (roomShareLinkInput) {
        navigator.clipboard.writeText(roomShareLinkInput.value).then(() => {
          showToast('Tautan ruangan kolaborasi disalin ke clipboard!');
        });
      }
    });
  }

  if (switchRoomBtn) {
    switchRoomBtn.addEventListener('click', () => {
      const newRoom = switchRoomIdInput?.value?.trim();
      if (!newRoom) return;
      window.location.href = getRoomShareUrl(newRoom);
    });
  }

  // ============================================================
  // VIEW ROUTER: LANDING PAGE <-> DASHBOARD STUDIO
  // ============================================================
  function showDashboard() {
    document.body.className = 'mode-dashboard';
    if (landingPage) landingPage.style.display = 'none';
    if (dashboardApp) dashboardApp.style.display = 'flex';
    setTimeout(() => {
      centerView();
      redrawConnections();
    }, 50);
  }

  function showLanding() {
    if (landingPage) {
      document.body.className = 'mode-landing';
      landingPage.style.display = 'flex';
      if (dashboardApp) dashboardApp.style.display = 'none';
      if (window.location.hash === '#dashboard') {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    } else {
      window.location.href = 'index.html';
    }
  }

  [landingCtaNavBtn, heroStartBtn, heroDemoBtn, splitStartBtn, bannerStartBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', (e) => {
      e.preventDefault();
      showDashboard();
    });
  });

  if (heroJoinRoomBtn) {
    heroJoinRoomBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showDashboard();
      setTimeout(openInviteModal, 200);
    });
  }

  if (backToLandingBtn) {
    backToLandingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showLanding();
    });
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#dashboard') {
      showDashboard();
    } else {
      showLanding();
    }
  });

  // ============================================================
  // TOUCH GESTURES & MOBILE CONTROLS (PC, TABLET, PHONE)
  // ============================================================
  let touchStartDist = 0;
  let touchStartZoom = 1;
  let isTouchPanning = false;
  let touchStartPanX = 0;
  let touchStartPanY = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartZoom = zoom;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      // 1. Port Priority: Sentuh port mana saja (input/output) untuk sambung pipa
      const portEl = target?.closest('.main-port, .sub-port');
      if (portEl) {
        e.preventDefault();
        const boxId = portEl.dataset.boxId;
        const subId = portEl.dataset.subId || null;
        const portLevel = portEl.dataset.portLevel || (subId ? 'sub' : 'main');
        const portType = portEl.dataset.portType || (portEl.classList.contains('input') ? 'input' : 'output');

        isConnecting = true;
        connectFrom = { type: portLevel, boxId, subId, portType };
        viewport.classList.add('connecting');

        if (!tempLine) {
          tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          tempLine.setAttribute('class', 'temp-pipe-path');
          tempConnectionGroup.appendChild(tempLine);
        }

        const boardRect = board.getBoundingClientRect();
        const r = portEl.getBoundingClientRect();
        const sx = (r.left + r.width / 2 - boardRect.left) / zoom;
        const sy = (r.top + r.height / 2 - boardRect.top) / zoom;
        tempLine.dataset.sx = sx;
        tempLine.dataset.sy = sy;
        tempLine.setAttribute('d', `M ${sx} ${sy} L ${sx} ${sy}`);

        highlightAllTargetPorts(boxId, subId);
        return;
      }

      // 2. Resize Kotak / Catatan di HP: Sentuh handle resize di pojok kanan bawah
      const resizeEl = target?.closest('.resize-handle');
      if (resizeEl) {
        e.preventDefault();
        const parentBoxEl = resizeEl.closest('.main-box, .note-box');
        if (parentBoxEl) {
          const item = mainBoxes.find(b => b.id === parentBoxEl.id) || notes.find(n => n.id === parentBoxEl.id);
          if (item) {
            isResizing = true;
            resizeBoxId = item.id;
            resizeStartX = touch.clientX;
            resizeStartY = touch.clientY;
            resizeStartW = item.w || (parentBoxEl.classList.contains('note-box') ? 230 : 240);
            resizeStartH = item.h || (parentBoxEl.classList.contains('note-box') ? 140 : 120);
            selectBox(item.id);
            return;
          }
        }
      }

      // 3. Drag Kotak di HP: Sentuh di mana saja pada kotak/catatan kecuali field ketikan, tombol aksi, dan resize handle
      const boxEl = target?.closest('.main-box, .note-box');
      const isInteractive = target?.closest('input, textarea, button, .sub-features-btn, .sub-del-btn, .box-del-btn, .box-tool-btn, .resize-handle, .color-indicator');
      if (boxEl && !isInteractive) {
        const item = mainBoxes.find(b => b.id === boxEl.id) || notes.find(n => n.id === boxEl.id);
        if (item) {
          e.preventDefault();
          isDraggingBox = true;
          dragBoxId = item.id;
          dragStartMouseX = touch.clientX;
          dragStartMouseY = touch.clientY;
          dragStartBoxX = item.x;
          dragStartBoxY = item.y;
          selectBox(item.id);
          return;
        }
      }

      // 4. Sambungkan jika sedang dalam mode connecting dan sentuh port target
      if (isConnecting && connectFrom) {
        const inPort = findPortTarget(touch.clientX, touch.clientY, connectFrom.boxId, connectFrom.subId);
        if (inPort) {
          e.preventDefault();
          completeConnection(inPort);
          return;
        }
      }

      // 5. Pan kanvas jika sentuh kanvas kosong
      if (!target?.closest('.main-box, .note-box, .nb-hud-zoom, .mobile-floating-bar')) {
        isTouchPanning = true;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartPanX = panX;
        touchStartPanY = panY;
      }
    }
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && touchStartDist > 0) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / touchStartDist;
      setZoom(touchStartZoom * factor);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (isConnecting && tempLine && connectFrom) {
        e.preventDefault();
        const boardRect = board.getBoundingClientRect();
        let mx = (touch.clientX - boardRect.left) / zoom;
        let my = (touch.clientY - boardRect.top) / zoom;

        // Smart snap to any target port across other boxes
        const hoveredTarget = findPortTarget(touch.clientX, touch.clientY, connectFrom.boxId, connectFrom.subId);
        let targetType = null;
        if (hoveredTarget) {
          const hr = hoveredTarget.getBoundingClientRect();
          mx = (hr.left + hr.width / 2 - boardRect.left) / zoom;
          my = (hr.top + hr.height / 2 - boardRect.top) / zoom;
          targetType = hoveredTarget.dataset.portType || (hoveredTarget.classList.contains('input') ? 'input' : 'output');
        }

        const sx = parseFloat(tempLine.dataset.sx);
        const sy = parseFloat(tempLine.dataset.sy);
        tempLine.setAttribute('d', calculateDragBezier(sx, sy, mx, my, connectFrom.portType, targetType));
      } else if (isResizing && resizeBoxId) {
        e.preventDefault();
        const item = mainBoxes.find(b => b.id === resizeBoxId) || notes.find(n => n.id === resizeBoxId);
        if (item) {
          const dx = (touch.clientX - resizeStartX) / zoom;
          const dy = (touch.clientY - resizeStartY) / zoom;
          item.w = Math.max(190, resizeStartW + dx);
          item.h = Math.max(100, resizeStartH + dy);

          const el = document.getElementById(item.id);
          if (el) {
            el.style.width = item.w + 'px';
            el.style.minHeight = item.h + 'px';
          }
          redrawConnections();
        }
      } else if (isDraggingBox && dragBoxId) {
        e.preventDefault();
        const item = mainBoxes.find(b => b.id === dragBoxId) || notes.find(n => n.id === dragBoxId);
        if (item) {
          item.x = dragStartBoxX + (touch.clientX - dragStartMouseX) / zoom;
          item.y = dragStartBoxY + (touch.clientY - dragStartMouseY) / zoom;
          const el = document.getElementById(item.id);
          if (el) {
            el.style.left = item.x + 'px';
            el.style.top = item.y + 'px';
          }
          redrawConnections();
        }
      } else if (isTouchPanning) {
        e.preventDefault();
        panX = touchStartPanX + (touch.clientX - touchStartX);
        panY = touchStartPanY + (touch.clientY - touchStartY);
        applyTransform();
      }
    }
  }, { passive: false });

  document.addEventListener('touchend', (e) => {
    if (isResizing) {
      isResizing = false;
      resizeBoxId = null;
      redrawConnections();
      saveToLocalStorage();
    }
    if (isDraggingBox) {
      isDraggingBox = false;
      dragBoxId = null;
      redrawConnections();
      saveToLocalStorage();
    }
    if (isConnecting && connectFrom) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const inPort = findPortTarget(touch.clientX, touch.clientY, connectFrom.boxId, connectFrom.subId);
        if (inPort) {
          completeConnection(inPort);
        } else {
          cancelConnection();
        }
      } else {
        cancelConnection();
      }
    }
    isTouchPanning = false;
    touchStartDist = 0;
  });

  if (mAddBoxBtn) mAddBoxBtn.addEventListener('click', () => addMainBox());
  if (mAddNoteBtn) mAddNoteBtn.addEventListener('click', () => addNoteBox());
  if (mPromptBtn) mPromptBtn.addEventListener('click', openPromptModal);
  if (mCenterBtn) mCenterBtn.addEventListener('click', centerView);

  const workspaceMobileDrawer = document.getElementById('workspaceMobileDrawer');
  const closeMobileDrawerBtn = document.getElementById('closeMobileDrawerBtn');

  function openMobileDrawer() {
    if (workspaceMobileDrawer) workspaceMobileDrawer.classList.add('active');
  }
  function closeMobileDrawer() {
    if (workspaceMobileDrawer) workspaceMobileDrawer.classList.remove('active');
  }

  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileDrawer();
    });
  }

  if (mSidebarBtn) {
    mSidebarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileDrawer();
    });
  }

  if (closeMobileDrawerBtn) {
    closeMobileDrawerBtn.addEventListener('click', closeMobileDrawer);
  }

  if (workspaceMobileDrawer) {
    workspaceMobileDrawer.addEventListener('click', (e) => {
      if (e.target === workspaceMobileDrawer) closeMobileDrawer();
    });
  }

  const drawerProjectBtn = document.getElementById('drawerProjectBtn');
  if (drawerProjectBtn) {
    drawerProjectBtn.addEventListener('click', () => {
      closeMobileDrawer();
      openProjectModal();
    });
  }

  const drawerPromptBtn = document.getElementById('drawerPromptBtn');
  if (drawerPromptBtn) {
    drawerPromptBtn.addEventListener('click', () => {
      closeMobileDrawer();
      openPromptModal();
    });
  }

  const drawerShareBtn = document.getElementById('drawerShareBtn');
  if (drawerShareBtn) {
    drawerShareBtn.addEventListener('click', () => {
      closeMobileDrawer();
      openInviteModal();
    });
  }

  const drawerExportPngBtn = document.getElementById('drawerExportPngBtn');
  if (drawerExportPngBtn) {
    drawerExportPngBtn.addEventListener('click', () => {
      closeMobileDrawer();
      document.getElementById('pngBtn')?.click();
    });
  }

  const drawerExportMdBtn = document.getElementById('drawerExportMdBtn');
  if (drawerExportMdBtn) {
    drawerExportMdBtn.addEventListener('click', () => {
      closeMobileDrawer();
      document.getElementById('generateMdBtn')?.click();
    });
  }

  if (mPngBtn) mPngBtn.addEventListener('click', () => document.getElementById('pngBtn')?.click());
  if (mMdBtn) mMdBtn.addEventListener('click', () => document.getElementById('generateMdBtn')?.click());

  // ============================================================
  // PAN & ZOOM TRANSFORMS
  // ============================================================
  function applyTransform() {
    board.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    zoomLevelEl.textContent = Math.round(zoom * 100) + '%';
  }

  function setZoom(newZoom, centerX, centerY) {
    newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    const rect = viewport.getBoundingClientRect();
    const cx = centerX !== undefined ? centerX : rect.width / 2;
    const cy = centerY !== undefined ? centerY : rect.height / 2;

    const boardX = (cx - panX) / zoom;
    const boardY = (cy - panY) / zoom;
    zoom = newZoom;
    panX = cx - boardX * zoom;
    panY = cy - boardY * zoom;

    applyTransform();
    saveToLocalStorage();
  }

  document.getElementById('zoomIn').addEventListener('click', () => setZoom(zoom * 1.2));
  document.getElementById('zoomOut').addEventListener('click', () => setZoom(zoom / 1.2));
  document.getElementById('zoomReset').addEventListener('click', () => {
    zoom = 1;
    panX = 80;
    panY = 70;
    applyTransform();
    saveToLocalStorage();
  });

  // Wheel Pan / Zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const rect = viewport.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      setZoom(zoom * factor, cx, cy);
    } else {
      panX -= e.deltaX;
      panY -= e.deltaY;
      applyTransform();
    }
  }, { passive: false });

  // Keyboard Navigation & Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spacePressed && !e.target.matches('input, textarea, select')) {
      spacePressed = true;
      viewport.style.cursor = 'grab';
      e.preventDefault();
    }
    // Delete key
    if ((e.key === 'Delete' || e.key === 'Backspace') && !e.target.matches('input, textarea')) {
      if (selectedConnId) {
        deleteConnection(selectedConnId);
      } else if (selectedBoxId) {
        const box = mainBoxes.find(b => b.id === selectedBoxId);
        const note = notes.find(n => n.id === selectedBoxId);
        if (box) {
          showConfirmDialog({
            title: 'Hapus Kotak Komponen',
            message: `Hapus kotak "${box.label || 'Tanpa Nama'}" beserta seluruh sub-kotak & pipa yang terhubung?`,
            okText: 'Hapus Kotak',
            onConfirm: () => deleteMainBox(selectedBoxId)
          });
        } else if (note) {
          showConfirmDialog({
            title: 'Hapus Catatan',
            message: `Hapus catatan "${note.title || 'Catatan'}" dari kanvas?`,
            okText: 'Hapus Catatan',
            onConfirm: () => deleteNoteBox(selectedBoxId)
          });
        }
      }
    }
    // Escape
    if (e.key === 'Escape') {
      if (isConnecting) cancelConnection();
      closeAllModals();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      spacePressed = false;
      if (!isPanning) viewport.style.cursor = '';
    }
  });

  // Mouse pan background & Middle mouse button pan anywhere
  window.addEventListener('mousedown', (e) => {
    // 1. Guard mutlak: jika di landing page atau bukan di dalam kanvas viewport, JANGAN PERNAH pan kanvas!
    if (document.body.classList.contains('mode-landing') || !e.target.closest('#viewport')) {
      return;
    }

    // 2. Guard mutlak: jika sedang mode menghubungkan pipa, jangan geser kanvas!
    if (isConnecting) {
      return;
    }

    // Tombol mouse tengah (scroll wheel click) -> geser kanvas bebas dari posisi mana pun dalam viewport
    if (e.button === 1) {
      e.preventDefault();
      isPanning = true;
      viewport.classList.add('panning');
      document.body.classList.add('is-panning-canvas');
      panStartX = e.clientX;
      panStartY = e.clientY;
      panStartPanX = panX;
      panStartPanY = panY;
      return;
    }

    // Klik kiri (button === 0): geser kanvas jika klik di luar kotak (area kosong mana pun) ATAU Space + Drag
    if (e.button === 0) {
      const onInteractive = e.target.closest(
        '.main-box, .note-box, .main-port, .sub-port, .pipe-cut-btn, .app-header, .nb-sidebar, .nb-modal-overlay, .nb-hud-zoom, .mobile-floating-bar, .user-auth-area, .project-input-wrap, .room-collab-bar'
      );

      // Jika klik di luar kotak dan elemen kontrol, atau saat Spasi ditekan:
      if (!onInteractive || spacePressed) {
        if (!spacePressed && e.target.closest('.main-port, .sub-port, .pipe-cut-btn')) return;

        isPanning = true;
        viewport.classList.add('panning');
        document.body.classList.add('is-panning-canvas');
        panStartX = e.clientX;
        panStartY = e.clientY;
        panStartPanX = panX;
        panStartPanY = panY;
        selectBox(null);
        selectConnection(null);
      }
    }
  }, { passive: false });

  // Cegah browser default autoscroll saat tekan tombol tengah
  window.addEventListener('auxclick', (e) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isPanning) {
      panX = panStartPanX + (e.clientX - panStartX);
      panY = panStartPanY + (e.clientY - panStartY);
      applyTransform();
      return;
    }

    if (isDraggingBox && dragBoxId) {
      const item = mainBoxes.find(b => b.id === dragBoxId) || notes.find(n => n.id === dragBoxId);
      if (!item) return;
      const deltaX = (e.clientX - dragStartMouseX) / zoom;
      const deltaY = (e.clientY - dragStartMouseY) / zoom;
      item.x = dragStartBoxX + deltaX;
      item.y = dragStartBoxY + deltaY;

      const el = document.getElementById(item.id);
      if (el) {
        el.style.left = item.x + 'px';
        el.style.top = item.y + 'px';
      }
      redrawConnections();
      return;
    }

    if (isResizing && resizeBoxId) {
      const item = mainBoxes.find(b => b.id === resizeBoxId) || notes.find(n => n.id === resizeBoxId);
      if (!item) return;
      const dx = (e.clientX - resizeStartX) / zoom;
      const dy = (e.clientY - resizeStartY) / zoom;
      item.w = Math.max(190, resizeStartW + dx);
      item.h = Math.max(100, resizeStartH + dy);

      const el = document.getElementById(item.id);
      if (el) {
        el.style.width = item.w + 'px';
        el.style.minHeight = item.h + 'px';
      }
      redrawConnections();
      return;
    }

    if (isConnecting && tempLine && connectFrom) {
      const boardRect = board.getBoundingClientRect();
      let mx = (e.clientX - boardRect.left) / zoom;
      let my = (e.clientY - boardRect.top) / zoom;

      // Smart magnetic snap: saat kursor dekat ke port target mana saja di kotak lain
      const hoveredTarget = findPortTarget(e.clientX, e.clientY, connectFrom.boxId, connectFrom.subId);
      let targetType = null;
      if (hoveredTarget) {
        const hr = hoveredTarget.getBoundingClientRect();
        mx = (hr.left + hr.width / 2 - boardRect.left) / zoom;
        my = (hr.top + hr.height / 2 - boardRect.top) / zoom;
        targetType = hoveredTarget.dataset.portType || (hoveredTarget.classList.contains('input') ? 'input' : 'output');
      }

      const sx = parseFloat(tempLine.dataset.sx);
      const sy = parseFloat(tempLine.dataset.sy);
      tempLine.setAttribute('d', calculateDragBezier(sx, sy, mx, my, connectFrom.portType, targetType));
    }

    // Multiplayer cursor broadcast
    const now = Date.now();
    if (now - lastCursorBroadcast > 40 && currentUser && board) {
      lastCursorBroadcast = now;
      const boardRect = board.getBoundingClientRect();
      const bx = (e.clientX - boardRect.left) / zoom;
      const by = (e.clientY - boardRect.top) / zoom;
      broadcast({
        type: 'cursor',
        user: currentUser,
        x: bx,
        y: by
      });
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (isPanning) {
      isPanning = false;
      viewport.classList.remove('panning');
      document.body.classList.remove('is-panning-canvas');
      if (!spacePressed) viewport.style.cursor = 'default';
      saveToLocalStorage();
    }

    if (isDraggingBox) {
      isDraggingBox = false;
      dragBoxId = null;
      redrawConnections();
      saveToLocalStorage();
    }

    if (isResizing) {
      isResizing = false;
      resizeBoxId = null;
      redrawConnections();
      saveToLocalStorage();
    }

    if (isConnecting && connectFrom) {
      const targetPort = findPortTarget(e.clientX, e.clientY, connectFrom.boxId, connectFrom.subId);
      // Jika dilepas tepat di atas port target saat drag: sambungkan!
      if (targetPort) {
        completeConnection(targetPort);
      }
      // PENTING: Jika dilepas di kanvas kosong, JANGAN BATALKAN! Mode 1-klik tetap aktif agar user bisa santai mengarahkan kursor ke pipa berikutnya.
    }
  });

  function cancelConnection() {
    if (tempLine) {
      tempLine.remove();
      tempLine = null;
    }
    isConnecting = false;
    connectFrom = null;
    viewport.classList.remove('connecting');
    clearPortHighlights();
  }

  // Center View Engine
  function centerView() {
    if (mainBoxes.length === 0 && notes.length === 0) {
      panX = 80;
      panY = 70;
      zoom = 1;
      applyTransform();
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    mainBoxes.forEach(b => {
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + (b.w || 240));
      maxY = Math.max(maxY, b.y + (b.h || 120));
    });

    notes.forEach(n => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + (n.w || 230));
      maxY = Math.max(maxY, n.y + (n.h || 140));
    });

    const padding = 100;
    const rect = viewport.getBoundingClientRect();
    const bw = maxX - minX + padding * 2;
    const bh = maxY - minY + padding * 2;
    const scaleX = rect.width / bw;
    const scaleY = rect.height / bh;

    zoom = Math.min(scaleX, scaleY, 1.2);
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
    panX = (rect.width - (maxX - minX) * zoom) / 2 - minX * zoom;
    panY = (rect.height - (maxY - minY) * zoom) / 2 - minY * zoom;

    applyTransform();
    saveToLocalStorage();
  }

  document.getElementById('centerBtn').addEventListener('click', centerView);

  // ============================================================
  // NODE / BOX ENGINE (POLOSAN - USER INPUTS EVERYTHING)
  // ============================================================
  function addMainBox(customProps = {}) {
    const id = 'box-' + (++mainBoxCounter);
    const rect = viewport.getBoundingClientRect();
    const defaultX = (-panX + rect.width / 2) / zoom - 120 + (mainBoxes.length % 4) * 35;
    const defaultY = (-panY + rect.height / 2) / zoom - 60 + Math.floor(mainBoxes.length / 4) * 35;

    const color = BOX_HEADER_COLORS[(mainBoxes.length) % BOX_HEADER_COLORS.length];

    const box = {
      id,
      label: customProps.label || '', // Polosan! User isi sendiri
      color: customProps.color || color,
      x: typeof customProps.x === 'number' ? customProps.x : defaultX,
      y: typeof customProps.y === 'number' ? customProps.y : defaultY,
      w: customProps.w || 240,
      h: customProps.h || 120,
      subs: customProps.subs || []
    };

    mainBoxes.push(box);
    render();
    saveToLocalStorage();

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const inp = el.querySelector('.main-box-title-input');
        if (inp && !box.label) inp.focus();
      }
    }, 50);

    return box;
  }

  document.getElementById('addMainBoxBtn').addEventListener('click', () => addMainBox());
  document.getElementById('emptyAddBtn').addEventListener('click', () => addMainBox());

  function addSubBox(boxId, customProps = {}) {
    const box = mainBoxes.find(b => b.id === boxId);
    if (!box) return;
    const subId = 'sub-' + (++subCounter);
    box.subs.push({
      id: subId,
      name: customProps.name || '',
      features: customProps.features || [],
      tech: customProps.tech || '',
      protocol: customProps.protocol || ''
    });

    render();
    saveToLocalStorage();

    setTimeout(() => {
      const subEl = document.getElementById(subId);
      if (subEl) {
        const inp = subEl.querySelector('.sub-name-input');
        if (inp && !customProps.name) inp.focus();
      }
    }, 50);
  }

  function deleteMainBox(id) {
    mainBoxes = mainBoxes.filter(b => b.id !== id);
    connections = connections.filter(c => c.from.boxId !== id && c.to.boxId !== id);
    if (selectedBoxId === id) selectedBoxId = null;
    render();
    saveToLocalStorage();
    showToast('Kotak dihapus');
  }

  function deleteSubBox(boxId, subId) {
    const box = mainBoxes.find(b => b.id === boxId);
    if (!box) return;
    box.subs = box.subs.filter(s => s.id !== subId);
    connections = connections.filter(c => c.from.subId !== subId && c.to.subId !== subId);
    render();
    saveToLocalStorage();
  }

  function deleteConnection(connId) {
    connections = connections.filter(c => c.id !== connId);
    if (selectedConnId === connId) selectedConnId = null;
    render();
    saveToLocalStorage();
    showToast('Pipa sambungan dihapus');
  }

  // ============================================================
  // KOTAK CATATAN / PERTANYAAN ARSITEKTUR KHUSUS
  // ============================================================
  function addNoteBox(customProps = {}) {
    const id = 'note-' + (++noteCounter);
    const rect = viewport.getBoundingClientRect();
    const defaultX = (-panX + rect.width / 2) / zoom - 90 + (notes.length % 4) * 30;
    const defaultY = (-panY + rect.height / 2) / zoom - 40 + Math.floor(notes.length / 4) * 30;

    const color = NOTE_COLORS[(notes.length) % NOTE_COLORS.length];

    const note = {
      id,
      title: customProps.title || (currentLang === 'en' ? 'Note' : 'Catatan'),
      content: customProps.content || '',
      color: customProps.color || color,
      x: typeof customProps.x === 'number' ? customProps.x : defaultX,
      y: typeof customProps.y === 'number' ? customProps.y : defaultY,
      w: customProps.w || 230,
      h: customProps.h || 140
    };

    notes.push(note);
    render();
    saveToLocalStorage();

    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const ta = el.querySelector('.note-body-textarea');
        if (ta && !note.content) ta.focus();
      }
    }, 60);

    showToast('Kotak catatan ditambahkan! Akan otomatis masuk ke Prompt AI.');
    return note;
  }

  document.getElementById('addNoteBoxBtn').addEventListener('click', () => addNoteBox());

  function deleteNoteBox(id) {
    notes = notes.filter(n => n.id !== id);
    if (selectedBoxId === id) selectedBoxId = null;
    render();
    saveToLocalStorage();
    showToast('Catatan dihapus');
  }

  function cycleNoteColor(note) {
    const curIdx = NOTE_COLORS.indexOf(note.color);
    const nextIdx = (curIdx + 1) % NOTE_COLORS.length;
    note.color = NOTE_COLORS[nextIdx];
    render();
    saveToLocalStorage();
  }

  // ============================================================
  // RENDER CANVASES & ELEMENTS
  // ============================================================
  function render() {
    document.querySelectorAll('.main-box, .note-box').forEach(el => el.remove());
    connectionsGroup.innerHTML = '';

    emptyState.style.display = (mainBoxes.length === 0 && notes.length === 0) ? 'block' : 'none';

    // 1. Gambar semua kotak komponen TERLEBIH DAHULU ke DOM
    mainBoxes.forEach(box => {
      board.appendChild(createMainBoxEl(box));
    });

    // 2. Gambar semua kotak catatan TERLEBIH DAHULU ke DOM
    notes.forEach(note => {
      board.appendChild(createNoteBoxEl(note));
    });

    // 3. BARU gambar semua pipa sambungan (karena port DOM sekarang sudah terpasang!)
    connections.forEach(conn => drawConnection(conn));

    // Auto sinkronkan ke PRD dan Prompt AI
    updateSidebarPanels();
  }

  function createMainBoxEl(box) {
    const div = document.createElement('div');
    div.className = 'main-box' + (selectedBoxId === box.id ? ' selected' : '');
    div.id = box.id;
    div.dataset.boxId = box.id;
    div.style.left = box.x + 'px';
    div.style.top = box.y + 'px';
    div.style.width = (box.w || 240) + 'px';
    div.style.minHeight = (box.h || 120) + 'px';

    // Header
    const header = document.createElement('div');
    header.className = 'main-box-header';
    header.style.background = box.color || '#fef08a';

    const handle = document.createElement('i');
    handle.className = 'fas fa-grip-vertical drag-handle';
    handle.title = 'Tarik untuk memindahkan kotak';
    header.appendChild(handle);

    // Title input polosan
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'main-box-title-input';
    titleInput.placeholder = 'Nama Kotak...';
    titleInput.value = box.label;
    titleInput.maxLength = 60;
    titleInput.addEventListener('input', (e) => {
      box.label = e.target.value;
      updateSidebarPanels();
      saveToLocalStorage();
    });
    titleInput.addEventListener('mousedown', (e) => e.stopPropagation());
    header.appendChild(titleInput);

    // Ganti warna header
    const colorBtn = document.createElement('button');
    colorBtn.type = 'button';
    colorBtn.className = 'box-tool-btn';
    colorBtn.innerHTML = '<i class="fas fa-palette"></i>';
    colorBtn.title = 'Ganti warna header';
    colorBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    colorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cycleBoxColor(box);
    });
    header.appendChild(colorBtn);

    // Delete box
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'box-tool-btn danger';
    delBtn.innerHTML = '<i class="fas fa-xmark"></i>';
    delBtn.title = 'Hapus kotak';
    delBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = box.label.trim() || 'Kotak';
      showConfirmDialog({
        title: 'Hapus Kotak Komponen',
        message: `Hapus "${name}" beserta seluruh sub-kotak & pipa yang terhubung?`,
        okText: 'Hapus Kotak',
        onConfirm: () => deleteMainBox(box.id)
      });
    });
    header.appendChild(delBtn);

    div.appendChild(header);

    // Sub-boxes Container
    const subContainer = document.createElement('div');
    subContainer.className = 'sub-container';
    box.subs.forEach(sub => subContainer.appendChild(createSubBoxEl(box, sub)));
    div.appendChild(subContainer);

    // Tombol Tambah Sub-Kotak
    const addSubBtn = document.createElement('button');
    addSubBtn.type = 'button';
    addSubBtn.className = 'add-sub-btn';
    addSubBtn.innerHTML = '<i class="fas fa-plus"></i> Tambah Sub-Kotak';
    addSubBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    addSubBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addSubBox(box.id);
    });
    div.appendChild(addSubBtn);

    // Ports / Sockets Pipa
    const inPort = document.createElement('div');
    inPort.className = 'main-port input';
    inPort.dataset.boxId = box.id;
    inPort.dataset.portType = 'input';
    inPort.dataset.portLevel = 'main';
    inPort.title = 'Input Pipa: Sambungkan pipa masuk ke sini';
    div.appendChild(inPort);

    const outPort = document.createElement('div');
    outPort.className = 'main-port output';
    outPort.dataset.boxId = box.id;
    outPort.dataset.portType = 'output';
    outPort.dataset.portLevel = 'main';
    outPort.title = 'Output Pipa: Tarik pipa keluar dari sini';
    div.appendChild(outPort);

    // Resize Handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.title = 'Tarik untuk resize kotak';
    const startBoxResize = (clientX, clientY) => {
      isResizing = true;
      resizeBoxId = box.id;
      resizeStartX = clientX;
      resizeStartY = clientY;
      resizeStartW = box.w || 240;
      resizeStartH = box.h || 120;
      selectBox(box.id);
    };
    resizeHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      startBoxResize(e.clientX, e.clientY);
    });
    resizeHandle.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const touch = e.touches[0];
      startBoxResize(touch.clientX, touch.clientY);
    }, { passive: false });
    div.appendChild(resizeHandle);

    // Drag handle & header events
    const startBoxDrag = (e) => {
      e.stopPropagation();
      e.preventDefault();
      selectBox(box.id);
      isDraggingBox = true;
      dragBoxId = box.id;
      dragStartMouseX = e.clientX;
      dragStartMouseY = e.clientY;
      dragStartBoxX = box.x;
      dragStartBoxY = box.y;
    };

    handle.addEventListener('mousedown', startBoxDrag);

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('input, textarea, button, .box-tool-btn, .color-indicator')) return;
      startBoxDrag(e);
    });

    div.addEventListener('mousedown', (e) => {
      if (e.target.closest('.sub-box') || e.target.closest('.add-sub-btn') ||
          e.target.closest('.main-port') || e.target.closest('.box-tool-btn') ||
          e.target.closest('.main-box-title-input') || e.target.closest('.drag-handle') ||
          e.target.closest('.resize-handle') || e.target.closest('.main-box-header')) return;
      startBoxDrag(e);
    });

    return div;
  }

  function createSubBoxEl(parentBox, sub) {
    const div = document.createElement('div');
    div.className = 'sub-box';
    div.id = sub.id;
    div.dataset.subId = sub.id;
    div.dataset.boxId = parentBox.id;

    const bullet = document.createElement('div');
    bullet.className = 'sub-bullet-icon';
    div.appendChild(bullet);

    // Sub-box name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'sub-name-input';
    nameInput.placeholder = 'Nama Sub-Kotak...';
    nameInput.value = sub.name;
    nameInput.maxLength = 50;
    nameInput.addEventListener('input', (e) => {
      sub.name = e.target.value;
      updateSidebarPanels();
      saveToLocalStorage();
    });
    nameInput.addEventListener('mousedown', (e) => e.stopPropagation());
    div.appendChild(nameInput);

    // Tombol Atur Fitur
    const featBtn = document.createElement('button');
    featBtn.type = 'button';
    const featCount = (sub.features && sub.features.length) || 0;
    featBtn.className = 'sub-features-btn' + (featCount > 0 ? ' has' : '');
    featBtn.innerHTML = `<i class="fas fa-list-check"></i> ${featCount > 0 ? featCount : 'Fitur'}`;
    featBtn.title = 'Atur rincian fitur sub-kotak ini';
    featBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    featBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openFeaturesModal(parentBox.id, sub.id);
    });
    div.appendChild(featBtn);

    // Hapus Sub-kotak
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'sub-del-btn';
    delBtn.innerHTML = '<i class="fas fa-xmark"></i>';
    delBtn.title = 'Hapus sub-kotak ini';
    delBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSubBox(parentBox.id, sub.id);
    });
    div.appendChild(delBtn);

    // Sub ports
    const inPort = document.createElement('div');
    inPort.className = 'sub-port input';
    inPort.dataset.boxId = parentBox.id;
    inPort.dataset.subId = sub.id;
    inPort.dataset.portType = 'input';
    inPort.dataset.portLevel = 'sub';
    inPort.title = 'Input Pipa Sub-Kotak';
    div.appendChild(inPort);

    const outPort = document.createElement('div');
    outPort.className = 'sub-port output';
    outPort.dataset.boxId = parentBox.id;
    outPort.dataset.subId = sub.id;
    outPort.dataset.portType = 'output';
    outPort.dataset.portLevel = 'sub';
    outPort.title = 'Output Pipa Sub-Kotak';
    div.appendChild(outPort);

    return div;
  }

  // ============================================================
  // CREATE NOTE BOX ELEMENT (STICKY QUESTION CARD)
  // ============================================================
  function createNoteBoxEl(note) {
    const div = document.createElement('div');
    div.className = 'note-box' + (selectedBoxId === note.id ? ' selected' : '');
    div.id = note.id;
    div.dataset.noteId = note.id;
    div.style.left = note.x + 'px';
    div.style.top = note.y + 'px';
    div.style.width = (note.w || 230) + 'px';
    div.style.minHeight = (note.h || 140) + 'px';
    div.style.background = note.color || '#fef08a';

    // Header
    const header = document.createElement('div');
    header.className = 'note-box-header';

    const pinIcon = document.createElement('i');
    pinIcon.className = 'fas fa-thumbtack note-pin-badge';
    pinIcon.title = 'Tarik untuk memindahkan catatan';
    header.appendChild(pinIcon);

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'note-title-input';
    titleInput.placeholder = t('notePlaceholder');
    titleInput.value = note.title;
    titleInput.maxLength = 60;
    titleInput.addEventListener('input', (e) => {
      note.title = e.target.value;
      updateSidebarPanels();
      saveToLocalStorage();
    });
    titleInput.addEventListener('mousedown', (e) => e.stopPropagation());
    header.appendChild(titleInput);

    // Ganti warna note
    const colorBtn = document.createElement('button');
    colorBtn.type = 'button';
    colorBtn.className = 'box-tool-btn';
    colorBtn.innerHTML = '<i class="fas fa-palette"></i>';
    colorBtn.title = 'Ganti warna catatan';
    colorBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    colorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cycleNoteColor(note);
    });
    header.appendChild(colorBtn);

    // Hapus note
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'box-tool-btn danger';
    delBtn.innerHTML = '<i class="fas fa-xmark"></i>';
    delBtn.title = 'Hapus catatan';
    delBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showConfirmDialog({
        title: 'Hapus Catatan',
        message: `Hapus catatan "${note.title || 'Catatan'}" dari kanvas?`,
        okText: 'Hapus Catatan',
        onConfirm: () => deleteNoteBox(note.id)
      });
    });
    header.appendChild(delBtn);

    div.appendChild(header);

    // Textarea body
    const textarea = document.createElement('textarea');
    textarea.className = 'note-body-textarea';
    textarea.placeholder = currentLang === 'en' ? 'Write architecture notes or questions here...' : 'Tulis catatan atau pertanyaan arsitektur di sini...';
    textarea.value = note.content;
    textarea.addEventListener('input', (e) => {
      note.content = e.target.value;
      updateSidebarPanels(); // Auto-sinkron ke prompt & PRD!
      saveToLocalStorage();
    });
    textarea.addEventListener('mousedown', (e) => e.stopPropagation());
    div.appendChild(textarea);

    // Footer Tag
    const footer = document.createElement('div');
    footer.className = 'note-footer-tag';
    footer.innerHTML = `<span><i class="fas fa-note-sticky"></i> ${t('noteFooter')}</span><span>Auto-Sync</span>`;
    div.appendChild(footer);

    // Resize Handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.title = 'Tarik untuk resize catatan';
    const startNoteResize = (clientX, clientY) => {
      isResizing = true;
      resizeBoxId = note.id;
      resizeStartX = clientX;
      resizeStartY = clientY;
      resizeStartW = note.w || 230;
      resizeStartH = note.h || 140;
      selectBox(note.id);
    };
    resizeHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      startNoteResize(e.clientX, e.clientY);
    });
    resizeHandle.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const touch = e.touches[0];
      startNoteResize(touch.clientX, touch.clientY);
    }, { passive: false });
    div.appendChild(resizeHandle);

    // Drag handle event (pin icon & header)
    const startNoteDrag = (e) => {
      e.stopPropagation();
      e.preventDefault();
      selectBox(note.id);
      isDraggingBox = true;
      dragBoxId = note.id;
      dragStartMouseX = e.clientX;
      dragStartMouseY = e.clientY;
      dragStartBoxX = note.x;
      dragStartBoxY = note.y;
    };

    pinIcon.addEventListener('mousedown', startNoteDrag);

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('.box-tool-btn')) return;
      startNoteDrag(e);
    });

    div.addEventListener('mousedown', (e) => {
      if (e.target.closest('.note-body-textarea') || e.target.closest('.note-title-input') ||
          e.target.closest('.box-tool-btn') || e.target.closest('.resize-handle') ||
          e.target.closest('.note-pin-badge') || e.target.closest('.note-box-header')) return;
      startNoteDrag(e);
    });

    return div;
  }

  function cycleBoxColor(box) {
    const curIdx = BOX_HEADER_COLORS.indexOf(box.color);
    const nextIdx = (curIdx + 1) % BOX_HEADER_COLORS.length;
    box.color = BOX_HEADER_COLORS[nextIdx];
    render();
    saveToLocalStorage();
  }

  function selectBox(id) {
    selectedBoxId = id;
    selectedConnId = null;
    document.querySelectorAll('.main-box, .note-box').forEach(el => {
      el.classList.toggle('selected', el.id === id);
    });
    document.querySelectorAll('.pipe-path').forEach(p => p.classList.remove('selected'));
  }

  function selectConnection(id) {
    selectedConnId = id;
    selectedBoxId = null;
    document.querySelectorAll('.main-box.selected, .note-box.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.pipe-path').forEach(p => {
      const isSel = p.dataset.connId === id;
      p.classList.toggle('selected', isSel);
    });
  }

  // ============================================================
  // PIPA CONNECTION ENGINE & SVG DRAWING
  // ============================================================
  function drawConnection(conn) {
    const fromEl = getPortEl(conn.from);
    const toEl = getPortEl(conn.to);
    if (!fromEl || !toEl) return;

    const boardRect = board.getBoundingClientRect();
    const fRect = fromEl.getBoundingClientRect();
    const tRect = toEl.getBoundingClientRect();

    if (fRect.width === 0 || tRect.width === 0) return;

    const x1 = (fRect.left + fRect.width / 2 - boardRect.left) / zoom;
    const y1 = (fRect.top + fRect.height / 2 - boardRect.top) / zoom;
    const x2 = (tRect.left + tRect.width / 2 - boardRect.left) / zoom;
    const y2 = (tRect.top + tRect.height / 2 - boardRect.top) / zoom;

    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return;

    const fromType = conn.from?.portType || (fromEl.classList.contains('input') ? 'input' : 'output');
    const toType = conn.to?.portType || (toEl.classList.contains('input') ? 'input' : 'output');
    const b1 = getBoxBounds(conn.from?.boxId);
    const b2 = getBoxBounds(conn.to?.boxId);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', calculatePipeElbow(x1, y1, x2, y2, fromType, toType, b1, b2));

    const isSub = conn.connType === 'sub';
    path.setAttribute('class', 'pipe-path' + (isSub ? ' sub-pipe' : '') + (selectedConnId === conn.id ? ' selected' : ''));
    path.dataset.connId = conn.id;

    path.addEventListener('click', (e) => {
      e.stopPropagation();
      selectConnection(conn.id);
    });

    connectionsGroup.appendChild(path);

    // Exact geometric midpoint along the bezier curve
    let midX = (x1 + x2) / 2;
    let midY = (y1 + y2) / 2;

    try {
      if (path.getTotalLength) {
        const totalLen = path.getTotalLength();
        if (totalLen && totalLen > 0) {
          const pt = path.getPointAtLength(totalLen * 0.5);
          if (pt && !isNaN(pt.x) && !isNaN(pt.y)) {
            midX = pt.x;
            midY = pt.y;
          }
        }
      }
    } catch (_) {}

    const cutGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    cutGroup.setAttribute('class', 'pipe-cut-btn');
    cutGroup.dataset.connId = conn.id;

    // Hit-box seluas r=16px
    const cutHit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cutHit.setAttribute('cx', midX);
    cutHit.setAttribute('cy', midY);
    cutHit.setAttribute('r', '16');
    cutHit.setAttribute('class', 'cut-hit');

    const cutCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cutCircle.setAttribute('cx', midX);
    cutCircle.setAttribute('cy', midY);
    cutCircle.setAttribute('r', '11');
    cutCircle.setAttribute('class', 'cut-circle');

    const cutX = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    cutX.setAttribute('d', `M ${midX - 4} ${midY - 4} L ${midX + 4} ${midY + 4} M ${midX + 4} ${midY - 4} L ${midX - 4} ${midY + 4}`);
    cutX.setAttribute('class', 'cut-x');

    const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleEl.textContent = t('pipeCut');
    cutGroup.appendChild(titleEl);

    cutGroup.appendChild(cutHit);
    cutGroup.appendChild(cutCircle);
    cutGroup.appendChild(cutX);

    // Efek hover: pipa memerah saat kursor di tombol X
    cutGroup.addEventListener('mouseenter', () => {
      path.classList.add('pipe-will-cut');
    });
    cutGroup.addEventListener('mouseleave', () => {
      path.classList.remove('pipe-will-cut');
    });

    // Klik untuk memutus pipa langsung
    cutGroup.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteConnection(conn.id);
    });

    connectionsGroup.appendChild(cutGroup);
  }

  function getPortEl(ref) {
    if (!ref) return null;
    if (ref.subId) {
      const subEl = document.getElementById(ref.subId) || document.querySelector(`[data-sub-id="${ref.subId}"]`);
      if (!subEl) return null;
      return subEl.querySelector('.sub-port.' + ref.portType);
    } else if (ref.boxId) {
      const boxEl = document.getElementById(ref.boxId) || document.querySelector(`[data-box-id="${ref.boxId}"]`);
      if (!boxEl) return null;
      return boxEl.querySelector('.main-port.' + ref.portType);
    }
    return null;
  }

  function redrawConnections() {
    connectionsGroup.innerHTML = '';
    connections.forEach(conn => drawConnection(conn));
  }

  // Sambungkan pipa (support multi-connect, sub-to-sub, main-to-sub, kanan-ke-kiri, kiri-ke-kanan, kanan-ke-kanan, kiri-ke-kiri)
  function completeConnection(targetPort) {
    if (!connectFrom || !targetPort) return;
    const toBoxId = targetPort.dataset.boxId;
    const toSubId = targetPort.dataset.subId || null;
    const toPortType = targetPort.dataset.portType || (targetPort.classList.contains('input') ? 'input' : 'output');
    const toLevel = targetPort.dataset.portLevel || (toSubId ? 'sub' : 'main');

    const isSelf = (connectFrom.boxId === toBoxId && connectFrom.subId === toSubId);
    if (!isSelf) {
      const fromItem = { boxId: connectFrom.boxId, subId: connectFrom.subId, portType: connectFrom.portType };
      const toItem = { boxId: toBoxId, subId: toSubId, portType: toPortType };

      const duplicate = connections.some(c =>
        (c.from.boxId === fromItem.boxId && c.from.subId === fromItem.subId && c.from.portType === fromItem.portType &&
         c.to.boxId === toItem.boxId && c.to.subId === toItem.subId && c.to.portType === toItem.portType) ||
        (c.from.boxId === toItem.boxId && c.from.subId === toItem.subId && c.from.portType === toItem.portType &&
         c.to.boxId === fromItem.boxId && c.to.subId === fromItem.subId && c.to.portType === fromItem.portType)
      );

      if (!duplicate) {
        const connType = (connectFrom.type === 'sub' || toLevel === 'sub') ? 'sub' : 'main';
        connections.push({
          id: 'pipe-' + (++connCounter),
          from: fromItem,
          to: toItem,
          connType,
          label: ''
        });

        // AUTO SYNC KE PRD & PROMPT
        render();
        saveToLocalStorage();
        showToast(t('pipeConnected'));
      } else {
        showToast(t('pipeExists'), true);
      }
    }
    cancelConnection();
  }

  let connectionStartTime = 0;

  // Tarik & Sambung Pipa: Cukup 1x klik pada port mana pun (output atau input), lalu klik pada port tujuan!
  document.addEventListener('mousedown', (e) => {
    // 1. Jika SEDANG dalam mode menghubungkan pipa:
    if (isConnecting && connectFrom) {
      // Periksa apakah user klik target port tujuan di kotak mana saja
      const targetPort = findPortTarget(e.clientX, e.clientY, connectFrom.boxId, connectFrom.subId);
      if (targetPort) {
        e.stopPropagation();
        e.preventDefault();
        completeConnection(targetPort);
        return;
      }

      // Periksa jika user klik port yang sama persis -> batalkan mode
      const samePort = e.target.closest('.main-port, .sub-port');
      if (samePort) {
        const boxId = samePort.dataset.boxId;
        const subId = samePort.dataset.subId || null;
        if (connectFrom.boxId === boxId && connectFrom.subId === subId) {
          e.stopPropagation();
          e.preventDefault();
          cancelConnection();
          return;
        }
      }

      // Jika klik di area kosong dan bukan klik awal (<120ms): batalkan mode
      if (Date.now() - connectionStartTime > 120 && !e.target.closest('.main-port, .sub-port')) {
        cancelConnection();
        return;
      }
    }

    // 2. Klik pada port MANAPUN (output atau input) untuk MEMULAI mode sambung
    const portEl = e.target.closest('.main-port, .sub-port');
    if (portEl) {
      e.stopPropagation();
      e.preventDefault();

      const boxId = portEl.dataset.boxId;
      const subId = portEl.dataset.subId || null;
      const portLevel = portEl.dataset.portLevel || (subId ? 'sub' : 'main');
      const portType = portEl.dataset.portType || (portEl.classList.contains('input') ? 'input' : 'output');

      isConnecting = true;
      connectFrom = { type: portLevel, boxId, subId, portType };
      connectionStartTime = Date.now();
      viewport.classList.add('connecting');

      if (!tempLine) {
        tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempLine.setAttribute('class', 'temp-pipe-path');
        tempConnectionGroup.appendChild(tempLine);
      }

      const boardRect = board.getBoundingClientRect();
      const r = portEl.getBoundingClientRect();
      const sx = (r.left + r.width / 2 - boardRect.left) / zoom;
      const sy = (r.top + r.height / 2 - boardRect.top) / zoom;
      tempLine.dataset.sx = sx;
      tempLine.dataset.sy = sy;
      tempLine.setAttribute('d', `M ${sx} ${sy} L ${sx} ${sy}`);
      highlightAllTargetPorts(boxId, subId);
    }
  });

  function highlightAllTargetPorts(excludeBoxId = null, excludeSubId = null) {
    document.querySelectorAll('.main-port, .sub-port').forEach(p => {
      if (isSamePortRef(p, excludeBoxId, excludeSubId)) return;
      p.style.background = '#fde047';
      p.style.transform = 'translateY(-50%) scale(1.4)';
      p.style.boxShadow = '0 0 0 3px #000000';
    });
  }

  function highlightOppositePorts(startType) {
    highlightAllTargetPorts();
  }

  function highlightInputPorts() {
    highlightOppositePorts('output');
  }

  function clearPortHighlights() {
    document.querySelectorAll('.main-port, .sub-port').forEach(p => {
      p.style.background = '';
      p.style.transform = '';
      p.style.boxShadow = '';
    });
  }

  // ============================================================
  // SIDEBAR & LIVE PRD AUTO-SINKRON
  // ============================================================
  projectTitleInput.addEventListener('input', (e) => {
    projectTitle = e.target.value;
    updateSidebarPanels();
    saveToLocalStorage();
  });

  function updateSidebarPanels() {
    const title = projectTitle.trim() || 'Untitled Project';
    sbProjectName.textContent = title;

    // Hitung Statistik
    const nodeCount = mainBoxes.length;
    let subCount = 0;
    let featCount = 0;
    mainBoxes.forEach(b => {
      subCount += b.subs.length;
      b.subs.forEach(s => {
        featCount += (s.features ? s.features.length : 0);
      });
    });

    statNodes.textContent = nodeCount;
    statSubs.textContent = subCount;
    statFeatures.textContent = featCount;
    statPipes.textContent = connections.length;
    pipeCountBadge.textContent = connections.length;
    if (noteCountBadge) noteCountBadge.textContent = notes.length;

    // Tree Output Komponen
    if (mainBoxes.length === 0) {
      prdTreeContent.innerHTML = `
        <div class="empty-tree-placeholder">
          <i class="fas fa-folder-open"></i>
          <span>Belum ada kotak yang dibuat.</span>
        </div>`;
    } else {
      let treeHtml = '';
      mainBoxes.forEach(box => {
        const boxLabel = box.label.trim() || '(Kotak tanpa nama)';
        treeHtml += `
          <div class="tree-card-node">
            <div class="tree-card-title">
              <span style="display:inline-block; width:10px; height:10px; background:${box.color || '#fef08a'}; border:1.5px solid #000; border-radius:2px;"></span>
              <span>${escapeHtml(boxLabel)}</span>
            </div>`;

        if (box.subs.length > 0) {
          treeHtml += `<div class="tree-sub-group">`;
          box.subs.forEach(sub => {
            const subTitle = sub.name.trim() || '(Sub-kotak tanpa nama)';
            treeHtml += `
              <div class="tree-sub-unit">
                <div class="tree-sub-name">
                  <i class="fas fa-caret-right" style="color:#000;"></i>
                  ${escapeHtml(subTitle)}
                </div>`;
            if (sub.features && sub.features.length > 0) {
              sub.features.forEach(f => {
                treeHtml += `<div class="tree-feat-item">${escapeHtml(f)}</div>`;
              });
            }
            treeHtml += `</div>`;
          });
          treeHtml += `</div>`;
        }

        treeHtml += `</div>`;
      });
      prdTreeContent.innerHTML = treeHtml;
    }

    // Daftar Pipa Sambungan
    if (connections.length === 0) {
      pipesListContent.innerHTML = `
        <div class="empty-tree-placeholder">
          <i class="fas fa-link-slash"></i>
          <span>Belum ada pipa yang tersambung. Tarik titik hitam di kanan kotak ke kiri kotak lain.</span>
        </div>`;
      let pipeHtml = '';
      const isEn = currentLang === 'en';
      connections.forEach((c, i) => {
        const fromName = getRefName(c.from);
        const toName = getRefName(c.to);
        const isSub = c.connType === 'sub';
        const connText = isEn ? 'connected with' : 'terhubung dengan';
        pipeHtml += `
          <div class="pipe-row-card">
            <div class="pipe-path-label" title="${escapeHtml(fromName)} ${connText} ${escapeHtml(toName)}">
              <span class="pipe-num">${i + 1}.</span>
              <span class="pipe-name-node">${escapeHtml(fromName)}</span>
              <span class="pipe-link-badge"><i class="fas fa-link"></i> ${connText}</span>
              <span class="pipe-name-node">${escapeHtml(toName)}</span>
              ${isSub ? '<span style="font-size:0.6rem; background:#e9d5ff; border:1px solid #000; padding:1px 4px; border-radius:3px;">Sub</span>' : ''}
            </div>
            <button class="pipe-del-btn" data-pipe-del="${c.id}" title="${isEn ? 'Delete pipe connection' : 'Hapus sambungan pipa'}">
              <i class="fas fa-trash-can"></i>
            </button>
          </div>`;
      });
      pipesListContent.innerHTML = pipeHtml;

      pipesListContent.querySelectorAll('[data-pipe-del]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteConnection(btn.dataset.pipeDel);
        });
      });
    }

    // Daftar Catatan & Pertanyaan di Sidebar Tab 3
    if (notesListContent) {
      if (notes.length === 0) {
        notesListContent.innerHTML = `
          <div class="empty-tree-placeholder">
            <i class="fas fa-note-sticky"></i>
            <span>Belum ada kotak catatan / pertanyaan. Klik tombol "+ Catatan" untuk menambahkan.</span>
          </div>`;
      } else {
        let noteHtml = '';
        notes.forEach((n, i) => {
          noteHtml += `
            <div class="note-sb-card">
              <div class="note-sb-header">
                <span><i class="fas fa-thumbtack" style="color:#000;"></i> ${escapeHtml(n.title || `Catatan ${i + 1}`)}</span>
                <button class="pipe-del-btn" data-note-del="${n.id}" title="Hapus catatan">
                  <i class="fas fa-trash-can"></i>
                </button>
              </div>
              <div class="note-sb-body">${escapeHtml(n.content || '(Belum ada isi pertanyaan/catatan)')}</div>
            </div>`;
        });
        notesListContent.innerHTML = noteHtml;

        notesListContent.querySelectorAll('[data-note-del]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const noteId = btn.dataset.noteDel;
            const targetNote = notes.find(n => n.id === noteId);
            const name = targetNote ? (targetNote.title || 'Catatan') : 'Catatan';
            showConfirmDialog({
              title: 'Hapus Catatan',
              message: `Hapus catatan "${name}" dari kanvas?`,
              okText: 'Hapus Catatan',
              onConfirm: () => deleteNoteBox(noteId)
            });
          });
        });
      }
    }

    // SINKRONISASI OTOMATIS: Update juga isi prompt AI secara live!
    if (promptModal.classList.contains('active')) {
      generateAIPrompt();
    }
  }

  function getRefName(ref) {
    const box = mainBoxes.find(b => b.id === ref.boxId);
    if (!box) return '?';
    const boxName = box.label.trim() || '(Kotak)';
    if (ref.subId) {
      const sub = box.subs.find(s => s.id === ref.subId);
      const subName = sub ? (sub.name.trim() || 'Sub') : 'Sub';
      return `${boxName} › ${subName}`;
    }
    return boxName;
  }

  // Sidebar Tab Switching
  document.querySelectorAll('.sidebar-tabs .sb-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-tabs .sb-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.sidebar-body .sb-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const tabMap = { prd: 'panePrd', pipes: 'panePipes', notes: 'paneNotes' };
      const pane = document.getElementById(tabMap[btn.dataset.tab] || 'panePrd');
      if (pane) pane.classList.add('active');
    });
  });

  // Sidebar Collapse Toggle
  document.getElementById('sidebarToggleBtn').addEventListener('click', () => {
    sidebarPanel.classList.toggle('collapsed');
    const icon = document.querySelector('#sidebarToggleBtn i');
    if (sidebarPanel.classList.contains('collapsed')) {
      icon.className = 'fas fa-chevron-left';
    } else {
      icon.className = 'fas fa-chevron-right';
    }
  });

  // ============================================================
  // FEATURES MODAL (KELOLA FITUR & SPESIFIKASI SUB-KOTAK)
  // ============================================================
  function openFeaturesModal(boxId, subId) {
    const box = mainBoxes.find(b => b.id === boxId);
    if (!box) return;
    const sub = box.subs.find(s => s.id === subId);
    if (!sub) return;

    editingFeatures = { boxId, subId };
    modalFeatureTitle.textContent = `Fitur: ${sub.name.trim() || 'Sub-Kotak'}`;
    modalFeatureSubtitle.textContent = `Parent: ${box.label.trim() || 'Kotak'}`;

    modalFeaturesTextarea.value = (sub.features || []).join('\n');
    modalTechInput.value = sub.tech || '';
    modalProtocolInput.value = sub.protocol || '';

    featuresModal.classList.add('active');
    setTimeout(() => modalFeaturesTextarea.focus(), 80);
  }

  function closeFeaturesModal() {
    featuresModal.classList.remove('active');
    editingFeatures = null;
  }

  document.getElementById('closeFeaturesModal').addEventListener('click', closeFeaturesModal);
  document.getElementById('cancelFeaturesModal').addEventListener('click', closeFeaturesModal);

  document.getElementById('saveFeaturesModal').addEventListener('click', () => {
    if (!editingFeatures) return;
    const box = mainBoxes.find(b => b.id === editingFeatures.boxId);
    if (!box) return;
    const sub = box.subs.find(s => s.id === editingFeatures.subId);
    if (!sub) return;

    sub.features = modalFeaturesTextarea.value
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    sub.tech = modalTechInput.value.trim();
    sub.protocol = modalProtocolInput.value.trim();

    closeFeaturesModal();
    render();
    saveToLocalStorage();
    showToast('Fitur sub-kotak berhasil disimpan!');
  });

  // ============================================================
  // EXPORT PNG (ROCK-SOLID NATIVE 2D CANVAS ENGINE - 100% PIPE INTEGRITY)
  // ============================================================
  document.getElementById('pngBtn').addEventListener('click', async () => {
    exportDropdownWrap?.classList.remove('open');

    if (mainBoxes.length === 0 && notes.length === 0) {
      showToast('Tidak ada konten di kanvas untuk di-export', true);
      return;
    }

    showToast('Sedang membuat PNG resolusi tinggi...');

    const boardRect = board.getBoundingClientRect();

    // 1. Dapatkan posisi port presisi tanpa mengubah transform board
    function getBoardPortCoords(ref) {
      const el = getPortEl(ref);
      if (el) {
        const r = el.getBoundingClientRect();
        return {
          x: (r.left + r.width / 2 - boardRect.left) / zoom,
          y: (r.top + r.height / 2 - boardRect.top) / zoom
        };
      }
      if (ref && ref.boxId) {
        const box = mainBoxes.find(b => b.id === ref.boxId);
        if (!box) return null;
        const isOut = ref.portType === 'output';
        const bw = box.w || 250;
        if (ref.subId) {
          const sIdx = box.subs.findIndex(s => s.id === ref.subId);
          return {
            x: isOut ? box.x + bw : box.x,
            y: box.y + 42 + (sIdx >= 0 ? sIdx * 48 + 24 : 26)
          };
        } else {
          return {
            x: isOut ? box.x + bw : box.x,
            y: box.y + 20
          };
        }
      }
      return null;
    }

    // 2. Kumpulkan seluruh titik pipa
    const activePipes = [];
    connections.forEach(conn => {
      const p1 = getBoardPortCoords(conn.from);
      const p2 = getBoardPortCoords(conn.to);
      if (p1 && p2) {
        activePipes.push({ conn, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
      }
    });

    // 3. Hitung bounding box menyeluruh (kotak, catatan, dan lengkungan pipa)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    mainBoxes.forEach(b => {
      const el = document.getElementById(b.id);
      const w = el ? el.offsetWidth : (b.w || 250);
      const h = el ? el.offsetHeight : (b.h || 160);
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + w);
      maxY = Math.max(maxY, b.y + h);
    });

    notes.forEach(n => {
      const el = document.getElementById(n.id);
      const w = el ? el.offsetWidth : (n.w || 260);
      const h = el ? el.offsetHeight : (n.h || 140);
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + w);
      maxY = Math.max(maxY, n.y + h);
    });

    activePipes.forEach(p => {
      minX = Math.min(minX, p.x1 - 30, p.x2 - 30);
      minY = Math.min(minY, p.y1 - 30, p.y2 - 30);
      maxX = Math.max(maxX, p.x1 + 30, p.x2 + 30);
      maxY = Math.max(maxY, p.y1 + 30, p.y2 + 30);
    });

    if (!isFinite(minX) || !isFinite(minY)) {
      minX = 0; minY = 0; maxX = 800; maxY = 600;
    }

    const padding = 75;
    const cropW = Math.max(500, Math.ceil(maxX - minX + padding * 2));
    const cropH = Math.max(380, Math.ceil(maxY - minY + padding * 2));
    const dpr = 2; // HD Retina 2x

    const canvas = document.createElement('canvas');
    canvas.width = cropW * dpr;
    canvas.height = cropH * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const offsetX = -minX + padding;
    const offsetY = -minY + padding;

    // Helper: Rounded Rectangle
    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    // A. Latar Belakang Kanvas Dot Grid Neo-Brutalist
    ctx.fillStyle = '#f5f4ee';
    ctx.fillRect(0, 0, cropW, cropH);

    ctx.fillStyle = '#d4d3cc';
    const gridSize = 24;
    const startDotX = ((offsetX % gridSize) + gridSize) % gridSize;
    const startDotY = ((offsetY % gridSize) + gridSize) % gridSize;
    for (let gx = startDotX; gx < cropW; gx += gridSize) {
      for (let gy = startDotY; gy < cropH; gy += gridSize) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // B. Gambar SEMUA Pipa Terhubung (Bahkan jika 1000+ kotak terhubung)
    activePipes.forEach(({ conn, x1, y1, x2, y2 }) => {
      const sx = x1 + offsetX;
      const sy = y1 + offsetY;
      const tx = x2 + offsetX;
      const ty = y2 + offsetY;

      const dx = tx - sx;
      const dy = ty - sy;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      let curvature;
      if (dx >= 20) {
        curvature = Math.max(40, Math.min(260, absDx * 0.45 + absDy * 0.08));
      } else {
        curvature = Math.max(50, Math.min(200, (20 - dx) * 0.35 + absDy * 0.15));
      }

      const cp1x = sx + curvature;
      const cp1y = sy;
      const cp2x = tx - curvature;
      const cp2y = ty;

      const isSub = conn.connType === 'sub';

      // Jalur kurva bezier pipa
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tx, ty);
      ctx.lineWidth = isSub ? 2.8 : 3.6;
      ctx.strokeStyle = isSub ? '#2563eb' : '#000000';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Panah solid di ujung pipa (tx, ty)
      const angle = Math.atan2(ty - cp2y, tx - cp2x);
      const arrowLen = isSub ? 11 : 13;
      const arrowWidth = isSub ? 7 : 8.5;

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(
        tx - arrowLen * Math.cos(angle) + arrowWidth * Math.sin(angle),
        ty - arrowLen * Math.sin(angle) - arrowWidth * Math.cos(angle)
      );
      ctx.lineTo(
        tx - arrowLen * Math.cos(angle) - arrowWidth * Math.sin(angle),
        ty - arrowLen * Math.sin(angle) + arrowWidth * Math.cos(angle)
      );
      ctx.closePath();
      ctx.fillStyle = isSub ? '#2563eb' : '#000000';
      ctx.fill();

      // Badge potong pipa [X] di titik tengah geometris kurva
      const tVal = 0.5;
      const u = 0.5;
      const mx = u*u*u*sx + 3*u*u*tVal*cp1x + 3*u*tVal*tVal*cp2x + tVal*tVal*tVal*tx;
      const my = u*u*u*sy + 3*u*u*tVal*cp1y + 3*u*tVal*tVal*cp2y + tVal*tVal*tVal*ty;

      ctx.beginPath();
      ctx.arc(mx, my, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mx - 3, my - 3);
      ctx.lineTo(mx + 3, my + 3);
      ctx.moveTo(mx + 3, my - 3);
      ctx.lineTo(mx - 3, my + 3);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = '#dc2626';
      ctx.stroke();
    });

    // C. Gambar Seluruh Kotak Komponen
    mainBoxes.forEach(box => {
      const el = document.getElementById(box.id);
      const bw = el ? el.offsetWidth : (box.w || 250);
      const bh = el ? el.offsetHeight : (box.h || 160);
      const bx = box.x + offsetX;
      const by = box.y + offsetY;

      // Bayangan tebal Neo-Brutalist
      roundRect(bx + 4, by + 4, bw, bh, 14);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // Badan kotak
      roundRect(bx, by, bw, bh, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Header kotak berwarna
      ctx.save();
      roundRect(bx, by, bw, bh, 14);
      ctx.clip();

      const headerH = 38;
      ctx.fillStyle = box.color || '#fef08a';
      ctx.fillRect(bx, by, bw, headerH);

      ctx.beginPath();
      ctx.moveTo(bx, by + headerH);
      ctx.lineTo(bx + bw, by + headerH);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Judul kotak komponen
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'middle';
      const labelText = box.label || 'Kotak Komponen';
      ctx.fillText(labelText, bx + 16, by + headerH / 2);
      ctx.restore();

      // Port Utama Input (kiri) & Output (kanan)
      ctx.beginPath();
      ctx.arc(bx, by + 20, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, by + 20, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(bx + bw, by + 20, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx + bw, by + 20, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Gambar Sub-kotak di dalam kotak komponen
      if (box.subs && box.subs.length > 0) {
        box.subs.forEach(sub => {
          const subEl = document.getElementById(sub.id);
          let subX = bx + 12;
          let subY = by + headerH + 12;
          let subW = bw - 24;
          let subH = 38;

          if (subEl) {
            const sr = subEl.getBoundingClientRect();
            subX = (sr.left - boardRect.left) / zoom + offsetX;
            subY = (sr.top - boardRect.top) / zoom + offsetY;
            subW = sr.width / zoom;
            subH = sr.height / zoom;
          }

          roundRect(subX, subY, subW, subH, 8);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = '#000000';
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(subX + 12, subY + subH / 2, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#000000';
          ctx.fill();

          ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#000000';
          ctx.textBaseline = 'middle';
          const sName = (sub.name || 'Sub-kotak').slice(0, 28);
          ctx.fillText(sName, subX + 22, subY + subH / 2);

          const fCount = (sub.features && sub.features.length) || 0;
          if (fCount > 0) {
            const pillText = `✓ ${fCount}`;
            ctx.font = 'bold 10px monospace';
            const pw = ctx.measureText(pillText).width + 12;
            const px = subX + subW - pw - 10;
            const py = subY + (subH - 18) / 2;
            roundRect(px, py, pw, 18, 9);
            ctx.fillStyle = '#dcfce7';
            ctx.fill();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = '#16a34a';
            ctx.stroke();

            ctx.fillStyle = '#15803d';
            ctx.fillText(pillText, px + 6, py + 9);
          }

          // Port Sub-kotak
          ctx.beginPath();
          ctx.arc(subX, subY + subH / 2, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = '#000000';
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(subX, subY + subH / 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#2563eb';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(subX + subW, subY + subH / 2, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#2563eb';
          ctx.fill();
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = '#000000';
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(subX + subW, subY + subH / 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        });
      }
    });

    // D. Gambar Seluruh Kartu Catatan Arsitektur
    notes.forEach(note => {
      const el = document.getElementById(note.id);
      const nw = el ? el.offsetWidth : (note.w || 260);
      const nh = el ? el.offsetHeight : (note.h || 140);
      const nx = note.x + offsetX;
      const ny = note.y + offsetY;

      roundRect(nx + 4, ny + 4, nw, nh, 12);
      ctx.fillStyle = '#000000';
      ctx.fill();

      roundRect(nx, ny, nw, nh, 12);
      ctx.fillStyle = note.color || '#fef08a';
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'middle';
      ctx.fillText('📌 ' + (note.title || 'Catatan Arsitektur'), nx + 12, ny + 20);

      ctx.beginPath();
      ctx.moveTo(nx + 10, ny + 34);
      ctx.lineTo(nx + nw - 10, ny + 34);
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.stroke();

      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.textBaseline = 'top';

      const content = note.content || '';
      const words = content.split(/\s+/);
      let line = '';
      let textY = ny + 44;
      const maxTextW = nw - 24;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextW && i > 0) {
          ctx.fillText(line, nx + 12, textY);
          line = words[i] + ' ';
          textY += 18;
          if (textY > ny + nh - 30) {
            ctx.fillText(line + '...', nx + 12, textY);
            break;
          }
        } else {
          line = testLine;
        }
      }
      if (textY <= ny + nh - 30 && line) {
        ctx.fillText(line, nx + 12, textY);
      }

      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#64748b';
      ctx.textBaseline = 'bottom';
      ctx.fillText('CATATAN · AUTO-SYNC', nx + 12, ny + nh - 8);
    });

    // E. Watermark Studio di Sudut Kanan Bawah
    const brandText = 'RANCANG BARENG · rancangbareng.studio';
    ctx.font = 'bold 11px monospace';
    const bw = ctx.measureText(brandText).width + 24;
    const bh = 26;
    const wbx = cropW - bw - 20;
    const wby = cropH - bh - 20;

    roundRect(wbx + 2, wby + 2, bw, bh, 6);
    ctx.fillStyle = '#000000';
    ctx.fill();

    roundRect(wbx, wby, bw, bh, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'middle';
    ctx.fillText(brandText, wbx + 12, wby + bh / 2);

    // F. Unduh Sebagai Berkas PNG
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('Gagal memproses gambar PNG', true);
          return;
        }
        const title = projectTitle.trim() || 'rancang-bareng-arsitektur';
        const filename = title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.png';

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        showToast('Gambar PNG HD (Pipa Utuh 100%) berhasil diunduh!');
      }, 'image/png');
    } catch (err) {
      console.error(err);
      showToast('Gagal unduh PNG: ' + err.message, true);
    }
  });

  // ============================================================
  // MARKDOWN RPD (.MD) EXPORTER - AUTO SYNCED WITH PIPES & NOTES
  // ============================================================
  function buildMarkdownDocument() {
    const isEn = currentLang === 'en';
    const title = projectTitle.trim() || (isEn ? 'Untitled Architecture' : 'Arsitektur Tanpa Judul');
    const now = new Date().toLocaleString(isEn ? 'en-US' : 'id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    let md = '';
    md += `# ${title}\n\n`;
    md += `> **Product & Requirements Architecture Document (${isEn ? 'PRD / ADD' : 'RPD / PRD'})**  \n`;
    md += `> ${isEn ? 'Created' : 'Dibuat'}: ${now}  \n`;
    md += `> ${isEn ? 'Design' : 'Desain'}: Neo-Brutalism Modular Blueprint\n\n`;
    md += `---\n\n`;

    md += `## 1. ${isEn ? 'Executive Summary & System Overview' : 'Ringkasan Eksekutif & Struktur Sistem'}\n\n`;
    md += `| ${isEn ? 'Metric' : 'Metrik'} | ${isEn ? 'Count' : 'Jumlah'} |\n`;
    md += `|---|---|\n`;
    md += `| **${isEn ? 'Architecture Name' : 'Nama Arsitektur'}** | ${title} |\n`;
    md += `| **${isEn ? 'Total Component Boxes' : 'Total Kotak Komponen'}** | ${mainBoxes.length} |\n`;
    md += `| **${isEn ? 'Total Sub-Boxes' : 'Total Sub-Kotak'}** | ${mainBoxes.reduce((a, b) => a + b.subs.length, 0)} |\n`;
    md += `| **${isEn ? 'Total Pipe Connections' : 'Total Sambungan Pipa'}** | ${connections.length} |\n`;
    md += `| **${isEn ? 'Total Notes & Questions' : 'Total Catatan & Pertanyaan Kunci'}** | ${notes.length} |\n`;
    md += `| **${isEn ? 'Total Features Listed' : 'Total Rincian Fitur'}** | ${mainBoxes.reduce((a, b) => a + b.subs.reduce((c, s) => c + (s.features ? s.features.length : 0), 0), 0)} |\n\n`;

    md += `## 2. ${isEn ? 'Component Specifications & Module Responsibilities' : 'Rincian Komponen & Tanggung Jawab Modul'}\n\n`;
    mainBoxes.forEach((box, i) => {
      const boxName = box.label.trim() || `${isEn ? 'Box' : 'Kotak'} ${i + 1}`;
      md += `### 2.${i + 1} ${boxName}\n\n`;
      if (box.subs.length === 0) {
        md += `_${isEn ? 'No sub-boxes registered yet.' : 'Belum ada sub-kotak terdaftar.'}_\n\n`;
      } else {
        box.subs.forEach((sub, j) => {
          const subName = sub.name.trim() || `${isEn ? 'Sub-box' : 'Sub-kotak'} ${j + 1}`;
          md += `#### 2.${i + 1}.${j + 1} ${subName}\n`;
          if (sub.tech) md += `- **${isEn ? 'Technology / Notes:' : 'Teknologi / Catatan:'}** \`${sub.tech}\`\n`;
          if (sub.protocol) md += `- **${isEn ? 'Protocol / Port:' : 'Protokol / Port:'}** \`${sub.protocol}\`\n`;
          if (sub.features && sub.features.length > 0) {
            md += `- **${isEn ? 'Features / Specifications:' : 'Daftar Fitur / Spesifikasi:'}**\n`;
            sub.features.forEach(f => {
              md += `  - [x] ${f}\n`;
            });
          } else {
            md += `- _${isEn ? 'No features specified.' : 'Belum ada rincian fitur.'}_\n`;
          }
          md += `\n`;
        });
      }
    });

    md += `## 3. ${isEn ? 'Data Pipeline Specifications & Component Interconnections' : 'Spesifikasi Sambungan Pipa & Integrasi Antar-Komponen'}\n\n`;
    if (connections.length === 0) {
      md += `_${isEn ? 'No connected pipes on canvas yet.' : 'Belum ada sambungan pipa antar kotak yang terpasang di kanvas.'}_\n\n`;
    } else {
      md += `### 3.1 ${isEn ? 'Interconnection Graph (Mermaid)' : 'Diagram Hubungan Antar-Komponen (Mermaid)'}\n\n`;
      md += `\`\`\`mermaid\ngraph LR\n`;
      const connLabel = isEn ? 'connected with' : 'terhubung dengan';
      connections.forEach(c => {
        const fromName = getRefName(c.from).replace(/[^\w\s-]/g, '');
        const toName = getRefName(c.to).replace(/[^\w\s-]/g, '');
        md += `  "${fromName}" ---|"${connLabel}"| "${toName}"\n`;
      });
      md += `\`\`\`\n\n`;

      md += `### 3.2 ${isEn ? 'Component Connection & Data Integration Matrix' : 'Matriks Sambungan Pipa & Integrasi Data Antar-Komponen'}\n\n`;
      md += `| No | ${isEn ? 'Component 1' : 'Komponen 1'} | ${isEn ? 'Relationship' : 'Hubungan'} | ${isEn ? 'Component 2' : 'Komponen 2'} | ${isEn ? 'Pipe Type' : 'Tipe Pipa'} | ${isEn ? 'Integration Contract & Flow' : 'Deskripsi Integrasi & Kontrak Data'} |\n`;
      md += `|:--:|:----------------|:------------:|:----------------|:-----------|:------------------------------------|\n`;
      connections.forEach((c, idx) => {
        const fromName = getRefName(c.from);
        const toName = getRefName(c.to);
        const tipe = c.connType === 'sub' ? (isEn ? 'Sub-to-Sub' : 'Sub-ke-Sub') : (isEn ? 'Main-Box' : 'Kotak Utama');
        const rel = isEn ? '🔗 connected with' : '🔗 terhubung dengan';
        const desc = isEn
          ? `**${fromName}** is directly connected with **${toName}**. Establish typed interface, shared state, or API/event bridge between them.`
          : `**${fromName}** terhubung langsung dengan **${toName}**. Buat kontrak API, event bus, atau interface data terstandar antara kedua komponen ini.`;
        md += `| ${idx + 1} | **${fromName}** | ${rel} | **${toName}** | ${tipe} | ${desc} |\n`;
      });
      md += `\n`;
    }

    if (notes.length > 0) {
      md += `## 4. ${isEn ? 'Architecture Notes & Strategic Decisions' : 'Catatan Kunci & Keputusan Arsitektur (Dilema Pengguna)'}\n\n`;
      notes.forEach((n, idx) => {
        md += `### 4.${idx + 1} 📌 ${n.title || `${isEn ? 'Note' : 'Catatan'} ${idx + 1}`}\n\n`;
        if (n.content && n.content.trim()) {
          md += `> ${n.content.trim().replace(/\n/g, '\n> ')}\n\n`;
        } else {
          md += `_${isEn ? 'No content specified.' : 'Tidak ada rincian pertanyaan teks.'}_\n\n`;
        }
      });
    }

    md += `## 5. ${isEn ? 'Autonomous Vibe Coding Blueprint (Ready to Send to AI Agent)' : 'Panduan Eksekusi Vibe Coding (Langsung Kirim ke AI Agent)'}\n\n`;
    md += `> ${isEn
      ? 'Feed this markdown document directly into your AI Coding Agent (Antigravity IDE, Cursor, Claude Code, Windsurf, Devin) to immediately build the complete application.'
      : 'Kirimkan dokumen Markdown ini langsung ke AI Coding Agent kamu (Antigravity IDE, Cursor, Claude Code, Windsurf, Devin) agar agen AI langsung memahami arsitektur dan meng-generate seluruh kode aplikasi secara utuh.'}\n\n`;
    md += `### 5.1 ${isEn ? 'AI Coding Agent Direct Command' : 'Perintah Langsung untuk AI Coding Agent'}\n\n`;
    md += `\`\`\`text\n`;
    md += `${isEn
      ? `You are an Autonomous Principal Software Engineer. Build the complete, production-ready codebase for "${title}" based on the component boxes, sub-boxes, sticky note architecture decisions, and connected pipes in this document. Implement 100% complete runnable code without any placeholders or TODOs.`
      : `Kamu adalah Autonomous Principal Software Engineer. Bangun seluruh codebase aplikasi untuk "${title}" sesuai spesifikasi komponen, fitur, keputusan catatan arsitektur, dan sambungan pipa yang tertera di dokumen ini. Tulis kode 100% lengkap siap jalan tanpa placeholder atau TODO.`}\n`;
    md += `\`\`\`\n\n`;

    md += `## 6. ${isEn ? 'Implementation & Delivery Checklist' : 'Checklist Eksekusi & Implementasi'}\n\n`;
    let anyFeat = false;
    mainBoxes.forEach(box => {
      box.subs.forEach(sub => {
        if (sub.features && sub.features.length > 0) {
          anyFeat = true;
          const sName = sub.name.trim() || (isEn ? 'Sub-box' : 'Sub-kotak');
          md += `### ${box.label || (isEn ? 'Box' : 'Kotak')} - ${sName}\n`;
          sub.features.forEach(f => {
            md += `- [ ] ${isEn ? 'Implement:' : 'Kerjakan:'} ${f}\n`;
          });
          md += `\n`;
        }
      });
    });

    if (!anyFeat) {
      md += `_${isEn ? 'No features registered for checklist yet.' : 'Belum ada fitur terdaftar untuk checklist.'}_\n\n`;
    }

    md += `---\n`;
    md += `_${isEn ? 'This Architecture Document was automatically generated by Rancang Bareng Studio' : 'Dokumen RPD ini otomatis disinkronkan oleh Rancang Bareng Studio (Neo-Brutalism Edition)'}_\n`;
    return md;
  }

  document.getElementById('generateMdBtn').addEventListener('click', () => {
    exportDropdownWrap?.classList.remove('open');
    if (mainBoxes.length === 0 && notes.length === 0) {
      showToast('Tambahkan kotak atau catatan terlebih dahulu', true);
      return;
    }

    const md = buildMarkdownDocument();
    const title = projectTitle.trim() || 'rpd-arsitektur';
    const filename = title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-rpd.md';

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast('Dokumen RPD (.md) berhasil di-download!');
  });

  document.getElementById('copyRpdBtn').addEventListener('click', () => {
    if (mainBoxes.length === 0 && notes.length === 0) {
      showToast('Belum ada konten untuk disalin', true);
      return;
    }
    const md = buildMarkdownDocument();
    navigator.clipboard.writeText(md).then(() => {
      showToast('Ringkasan RPD berhasil disalin ke Clipboard!');
    }).catch(() => {
      showToast('Gagal menyalin ke clipboard', true);
    });
  });

  // ============================================================
  // MASTER AI PROMPT GENERATOR - WITH USER QUESTION NOTES INJECTION
  // ============================================================
  function generateAIPrompt() {
    const isEn = (promptLanguage.value === 'en') || (currentLang === 'en' && promptLanguage.value !== 'id');
    const title = projectTitle.trim() || (isEn ? 'Integrated System Architecture' : 'Arsitektur Sistem Terintegrasi');
    const mode = promptModeSelect.value;
    const targetModel = promptTargetModel.value;
    const lang = promptLanguage.value;
    const depthEl = document.querySelector('input[name="promptDepth"]:checked');
    const depth = depthEl ? depthEl.value : 'detailed';
    const extraNotes = promptExtraNotes.value.trim();

    // Rangkuman kotak & sub-kotak
    const boxesSummary = [];
    mainBoxes.forEach((box, i) => {
      const boxName = box.label.trim() || `${isEn ? 'Box' : 'Kotak'} ${i + 1}`;
      const subsInfo = box.subs.map(s => {
        let text = `- Sub: ${s.name || (isEn ? 'Sub-box' : 'Sub-kotak')}`;
        if (s.tech) text += ` [${isEn ? 'Tech/Notes' : 'Catatan/Teknologi'}: ${s.tech}]`;
        if (s.protocol) text += ` [${isEn ? 'Protocol/Port' : 'Protokol/Port'}: ${s.protocol}]`;
        if (s.features && s.features.length > 0) {
          text += `\n    ${isEn ? 'Registered Features:' : 'Fitur Terdaftar:'}\n    * ${s.features.join('\n    * ')}`;
        }
        return text;
      }).join('\n  ');

      boxesSummary.push(`${isEn ? 'COMPONENT BOX' : 'KOTAK'} ${i + 1}: "${boxName}"\n  ${subsInfo || (isEn ? '(No sub-boxes registered)' : '(Tidak ada sub-kotak terdaftar)')}`);
    });

    // Rangkuman pipa yang tersambung (Hubungan dua arah antar-komponen)
    const pipesSummary = [];
    connections.forEach((c, i) => {
      const from = getRefName(c.from);
      const to = getRefName(c.to);
      const isSub = c.connType === 'sub';
      const pipeType = isSub
        ? (isEn ? 'Sub-Component Connection' : 'Koneksi Sub-Komponen')
        : (isEn ? 'Main Component Connection' : 'Koneksi Kotak Utama');
      pipesSummary.push(isEn
        ? `${i + 1}. [CONNECTED PIPE] "${from}" is connected with "${to}" (${pipeType})\n   * Integration Meaning: "${from}" and "${to}" must be directly integrated and exchange data/events. Design the exact data contract, API endpoints, or shared state between them.`
        : `${i + 1}. [KONEKSI PIPA] "${from}" terhubung dengan "${to}" (${pipeType})\n   * Maksud Integrasi: "${from}" dan "${to}" terhubung langsung dan bertukar data/event. Rancang kontrak data, API endpoints, atau state bridge nyata antara kedua komponen ini.`);
    });

    // Rangkuman Kotak Catatan / Keputusan Pengguna (Wajib dijawab & diterapkan AI)
    const notesSummary = [];
    notes.forEach((n, i) => {
      const noteTitle = n.title.trim() || `${isEn ? 'Architecture Decision' : 'Keputusan Arsitektur'} ${i + 1}`;
      const noteBody = n.content.trim() || (isEn ? '(No detailed text)' : '(Tidak ada rincian teks)');
      const actionText = isEn
        ? '*Mandatory AI Implementation Directive:* Resolve this dilemma/question decisively, select the optimal technical pattern, and implement the chosen solution directly in the code!'
        : '*Instruksi Wajib AI:* Ambil keputusan tegas untuk menyelesaikan pertanyaan/dilema ini, pilih solusi teknologi terbaik, dan langsung terapkan solusinya ke dalam kode proyek!';
      notesSummary.push(`${i + 1}. 📌 **[${noteTitle}]**:\n   > "${noteBody}"\n   ${actionText}`);
    });

    let personaHeader = '';
    let deliverables = '';
    let languageInstruction = '';

    if (isEn) {
      languageInstruction = 'Respond strictly in professional, publication-ready English (Senior Staff / Principal Systems Architect level). Keep all technical schemas, contracts, and explanations in fluent English.';
    } else if (lang === 'mixed') {
      languageInstruction = 'Gunakan gaya bahasa bilingual industri tech (penjelasan dalam Bahasa Indonesia yang lugas dan tajam, artefak teknis, skema, dan kontrak API dalam bahasa Inggris).';
    } else {
      languageInstruction = 'Gunakan Bahasa Indonesia profesional standar teknis industri software (istilah teknis kunci tetap gunakan bahasa Inggris baku seperti payload, idempotency, throughput, latency, webhook, RPC).';
    }

    if (mode === 'vibe_coding') {
      if (isEn) {
        personaHeader = `You are an Autonomous Principal AI Software Engineer & Full-Stack Architect executing in a modern AI coding agent environment (Antigravity IDE, Cursor, Claude Code, Windsurf, Devin).
Your mission is to autonomously build the complete, production-ready, fully working codebase for "${title}" based on the canvas architecture specification below.`;
        deliverables = `
VIBE CODING AUTONOMOUS IMPLEMENTATION DIRECTIVES:
1. END-TO-END SYSTEM ARCHITECTURE COMPREHENSION:
   - Thoroughly review all Component Boxes, their Sub-Boxes, features, and interconnection pipes.
   - Every connection indicates a direct functional integration or data pipeline between the two components:
     * For example, if "Kotak B" is connected with "Kotak A", integrate them with real API endpoints, typed interfaces, or shared state.
     * If "Sub A" (inside Kotak A) is connected with "Kotak C", wire their specific event/handler contracts.

2. MANDATORY ARCHITECTURAL DECISIONS & USER NOTES RESOLUTION:
   - Any question, dilemma, or sticky note attached by the user is a MANDATORY requirement. Resolve each note decisively, choose the optimal technical pattern, and implement it directly in the codebase with clear architectural rationale.

3. TECH STACK & MODULAR DIRECTORY LAYOUT:
   - Recommend and configure the ideal modern tech stack (e.g. Next.js / Vite React, Tailwind CSS, TypeScript, Node.js / FastAPI, SQLite / PostgreSQL / Redis).
   - Lay out the clean, scalable project folder/file tree.
   - Provide exact configuration files (package.json, tsconfig, env variables, etc.).

4. COMPLETE PRODUCTION-READY CODE (ZERO PLACEHOLDERS):
   - Write 100% complete, fully implemented code files for each module.
   - STRICT BAN: NO placeholders, NO "// TODO: implement later", NO ellipsis "...". Every function and component must be fully fleshed out.
   - Include TypeScript interfaces, state management, API routes, data validation, and responsive UI components.

5. VERIFICATION & RUN COMMANDS:
   - Provide exact step-by-step terminal commands to install dependencies, run locally, test, and verify the entire system.`;
      } else {
        personaHeader = `Kamu adalah Autonomous Principal AI Software Engineer & Senior Full-Stack Architect kelas dunia yang bekerja di lingkungan AI coding mutakhir (Antigravity IDE, Cursor, Claude Code, Windsurf, Devin).
Tugasmu adalah merealisasikan dan membangun SELURUH codebase aplikasi "${title}" secara lengkap, siap jalan (production-ready), dan berfungsi 100% berdasarkan blueprint arsitektur kanvas di bawah ini.`;
        deliverables = `
PANDUAN EKSEKUSI VIBE CODING SIAP JALAN:
1. PEMAHAMAN TOTAL ARSITEKTUR & SAMBUNGAN PIPA:
   - Analisis setiap Kotak Komponen, Sub-Kotak, dan rincian fitur terdaftar.
   - Analisis setiap sambungan pipa: Pipa menandakan kedua komponen saling terhubung dan bertukar data secara langsung.
     * Contoh: Jika "Kotak B" terhubung dengan "Kotak A", buat integrasi nyata antara keduanya (REST endpoint / tRPC / WebSocket / shared service).
     * Jika "Sub A" (di Kotak A) terhubung dengan "Kotak C", sambungkan handler/event dari Sub A langsung ke Kotak C.

2. PENYELESAIAN KUNCI UNTUK CATATAN / PERTANYAAN PENGGUNA:
   - Pengguna menempelkan catatan pertanyaan/dilema arsitektur di kanvas. Kamu WAJIB mengambil keputusan teknologi terbaik, memberikan rekomendasi mantap, dan LANGSUNG menerapkan solusinya ke dalam kode proyek.

3. STRUKTUR PROYEK & REKOMENDASI TECH STACK:
   - Berikan rekomendasi stack modern terbaik (misal: Next.js / Vite React, Tailwind CSS, TypeScript, Node.js / Python FastAPI, SQLite / PostgreSQL / Redis).
   - Jabarkan struktur folder & file proyek secara rapi dan modular.
   - Sediakan konfigurasi dependencies (package.json / requirements.txt).

4. KODE LENGKAP SIAP JALAN (ZERO PLACEHOLDER):
   - Tulis kode produksi yang lengkap dan utuh untuk setiap modul yang dirancang.
   - DILARANG KERAS menggunakan placeholder seperti "// TODO: buat nanti", "// logic goes here", atau potongan kode yang menggantung.
   - Lengkapi dengan TypeScript types/interface, penanganan error, validasi data, dan integrasi antar-pipa.

5. INSTRUKSI CARA MENJALANKAN (VERIFIKASI):
   - Berikan perintah terminal langkah demi langkah untuk instalasi dependencies, menjalankan server dev lokal, dan menguji fitur secara end-to-end.`;
      }
    } else if (mode === 'architect') {
      if (isEn) {
        personaHeader = `You are a world-class Principal Enterprise Software Architect and Senior Systems Engineer specializing in distributed systems, scalability, and technical architecture specifications.`;
        deliverables = `
PRIMARY OBJECTIVES:
Design a comprehensive Architecture Design Document (ADD) & Technical Specification based on the canvas components, data pipes, and user notes:

1. ARCHITECTURAL DECISIONS & USER NOTES RESOLUTION:
   - Provide concrete, definitive solutions for every item in the "ARCHITECTURE NOTES & USER QUESTIONS" section.
   - Provide best-practice architectural recommendations (e.g., frontend pattern, database engine, microservices vs modular monolith) with detailed trade-off analysis.

2. DOMAIN BOUNDARIES & COMPONENT RESPONSIBILITIES:
   - Define domain boundaries and responsibilities for each Box and Sub-box listed.
   - Justify architectural style (Microservices, Event-Driven, Modular Monolith) based on throughput and team topology.

3. DEEP-DIVE INTO DATA PIPELINES (${connections.length} Connected Pipes):
   - For every connection ("Source" ➔ "Target"):
     a. Optimal communication protocol (REST HTTPS, gRPC, WebSocket, Message Queue / Event Bus, etc.).
     b. Data payload contract (Request/Response JSON schema or Protobuf specification).
     c. Communication paradigm (Synchronous blocking vs Asynchronous event-driven).
     d. Failure handling & resilience: Retry policy, Exponential Backoff, Circuit Breaker, and Fallbacks.
     e. SLA targets (P99 latency budget) and pipeline security (mTLS, JWT Bearer Token, HMAC).

4. DATA STORAGE & INFRASTRUCTURE TOPOLOGY:
   - Storage strategy, caching layers (Redis/Memcached), and deployment topology without Single Point of Failure (SPOF).`;
      } else {
        personaHeader = `Kamu adalah seorang Principal Enterprise Software Architect dan Senior Systems Engineer kelas dunia yang ahli dalam merancang spesifikasi teknis dan sistem terdistribusi.`;
        deliverables = `
TUGAS UTAMA:
Rancang Architecture Design Document (ADD) & Spesifikasi Teknis Lengkap berdasarkan kotak komponen, sambungan pipa data, dan pertanyaan catatan pengguna:

1. JAWABAN TUNTAS UNTUK PERTANYAAN / CATATAN PENGGUNA:
   - Jawab setiap pertanyaan arsitektural yang tertera pada bagian "DAFTAR PERTANYAAN & CATATAN KHUSUS PENGGUNA".
   - Berikan rekomendasi arsitektur terbaik (misal: rekomendasi arsitektur frontend, stack database, framework, atau pola komunikasi) lengkap dengan alasan dan trade-off.

2. ANALISIS KOTAK & PEMBAGIAN TANGGUNG JAWAB:
   - Definisikan domain boundary dan tanggung jawab setiap Kotak dan Sub-kotak yang terdaftar.
   - Pola arsitektural yang paling cocok (Microservices, Event-Driven, Modular Monolith) dengan justifikasi teknis mendalam.

3. BEDAH MENDALAM SETIAP SAMBUNGAN PIPA DATA (${connections.length} Sambungan Terdaftar):
   - Untuk setiap sambungan pipa ("Sumber" ➔ "Tujuan"), tentukan protokol, data contract JSON, retry policy, dan keamanan.

4. DATABASE & INFRASTRUCTURE TOPOLOGY:
   - Desain penyimpanan data, strategi caching, dan topologi cloud deployment tanpa single point of failure (SPOF).`;
      }
    } else if (mode === 'prd_complete') {
      if (isEn) {
        personaHeader = `You are a Group Product Manager & VP of Engineering at a leading tech company specializing in comprehensive Product Requirement Documents (PRD) and Technical Specifications.`;
        deliverables = `
PRIMARY OBJECTIVES:
Generate an exhaustive, engineering-ready Product Requirements Document (PRD) based on this system architecture:

1. USER STORIES & ACCEPTANCE CRITERIA:
   - Comprehensive User Stories formatted as "As a [User], I want [Action], so that [Value]" with Given-When-Then Acceptance Criteria.

2. RESOLUTION OF USER NOTES & STRATEGIC QUESTIONS:
   - Address all notes and strategic dilemmas highlighted on the canvas from a product feasibility and engineering perspective.

3. USER JOURNEY DATA FLOW ACROSS PIPELINES:
   - Map user journeys across the connected components and data pipelines, specifying edge cases, UX fallbacks, and error states.`;
      } else {
        personaHeader = `Kamu adalah Group Product Manager & VP of Engineering di perusahaan teknologi terkemuka yang ahli dalam membuat Product Requirement Document (PRD) dan Requirements & Product Document (RPD) super lengkap.`;
        deliverables = `
TUGAS UTAMA:
Hasilkan Dokumen PRD / RPD Lengkap dan Presisi untuk dieksekusi oleh tim engineering, QA, dan stakeholders:
1. Jawab secara tuntas pertanyaan/catatan pengguna yang tertera di kanvas.
2. User Stories lengkap format "As a [User], I want [Action], so that [Value]" beserta Acceptance Criteria.
3. Spesifikasi alur data pipa dari sudut pandang produk dan user journey.`;
      }
    } else if (mode === 'roadmap_sprint') {
      if (isEn) {
        personaHeader = `You are a Senior Engineering Manager and Agile Delivery Lead specializing in implementation roadmaps and sprint breakdowns ready for Jira/Linear.`;
        deliverables = `
PRIMARY OBJECTIVES:
Deconstruct this modular architecture, data pipelines, and user notes into an actionable Roadmap & Sprint Execution Plan:

1. ACTIONABLE ANSWERS TO ARCHITECTURE NOTES:
   - Provide concrete technical directions for all questions before teams initiate sprint execution.

2. IMPLEMENTATION PHASES (Milestones 1 to 4):
   - Phase 1: Foundation data layer & core modules.
   - Phase 2: Pipeline connections and inter-service communication.
   - Phase 3: Sub-component features integration and end-to-end testing.
   - Phase 4: Load testing, security hardening, and production rollout.

3. DETAILED SPRINT TICKETS:
   - Specific tasks per box and data pipe with dependency mapping and Definition of Done (DoD).`;
      } else {
        personaHeader = `Kamu adalah Senior Engineering Manager dan Agile Delivery Lead yang ahli dalam menyusun Roadmap Implementasi & Pembagian Sprint Tugas siap pakai di Jira/Linear.`;
        deliverables = `
TUGAS UTAMA:
Bedah arsitektur kotak, pertanyaan catatan pengguna, dan sambungan pipa ini menjadi Roadmap Pelaksanaan & Sprint Breakdown yang realistis (Fase 1 s/d 4 beserta tiket sprint terperinci).`;
      }
    } else if (mode === 'schema_api') {
      if (isEn) {
        personaHeader = `You are a Database Architect & API Design Specialist specializing in database schema DDL and inter-service data transmission contracts.`;
        deliverables = `
PRIMARY OBJECTIVES:
Design comprehensive Database DDL Schemas and API Contract Specifications based on the boxes, notes, and connected pipelines:

1. PRODUCTION SQL DATABASE SCHEMA:
   - Complete SQL DDL schemas (Tables, Primary Keys, Foreign Keys, Column Types, Indexes, Constraints).

2. API CONTRACT SPECIFICATIONS FOR EVERY DATA PIPE:
   - For each pipeline: HTTP Method & Endpoint Path, Request Headers, Request Body JSON schema, Response Body JSON, and HTTP Status Codes.`;
      } else {
        personaHeader = `Kamu adalah Database Architect & API Design Specialist yang ahli dalam skema basis data dan kontrak transmisi data antar-layanan.`;
        deliverables = `
TUGAS UTAMA:
Rancang Database Schema DDL dan Spesifikasi Kontrak API Lengkap berdasarkan kotak, catatan pertanyaan, dan pipa yang tersambung.`;
      }
    } else {
      if (isEn) {
        personaHeader = `You are a Lead Security Architect & Site Reliability Engineer (SRE) specializing in resilient infrastructure and system security.`;
        deliverables = `
PRIMARY OBJECTIVES:
Design a Security, Resilience, and Disaster Recovery Blueprint for all boxes, pipelines, and architecture notes:
1. Threat modeling (STRIDE) across each connected data pipe.
2. Zero-trust network security, encryption in-transit (TLS 1.3), and token verification.
3. Resilience patterns: Circuit breaking, Rate limiting, Bulkheading, and Chaos engineering scenarios.`;
      } else {
        personaHeader = `Kamu adalah Lead Security Architect & Site Reliability Engineer (SRE) yang ahli dalam keamanan sistem dan ketahanan infrastruktur.`;
        deliverables = `
TUGAS UTAMA:
Rancang Cetak Biru Keamanan, Ketahanan, dan Penanganan Error untuk seluruh sambungan pipa, kotak, dan catatan arsitektur ini.`;
      }
    }

    let targetModelTuning = '';
    if (isEn) {
      if (targetModel === 'vibe_agent') targetModelTuning = 'Format output for autonomous multi-file generation. Begin with the complete project folder tree, followed by full runnable code files with clear file path headings (e.g. `### \\`src/index.ts\\``). Never truncate or skip code.';
      else if (targetModel === 'claude') targetModelTuning = 'Use extended technical reasoning to thoroughly evaluate trade-offs before outputting final deliverables.';
      else if (targetModel === 'deepseek') targetModelTuning = 'Apply rigorous step-by-step reasoning and evaluate failure points across all data pipelines.';
      else if (targetModel === 'cursor') targetModelTuning = 'Format the output as actionable guidance ready for .cursorrules or ARCHITECTURE.md.';
    } else {
      if (targetModel === 'vibe_agent') targetModelTuning = 'Format keluaran agar siap dieksekusi oleh AI coding agent. Awali dengan pohon struktur direktori proyek, lalu tuliskan seluruh file kode lengkap dengan header path file (contoh: `### \\`src/index.ts\\``). Jangan potong kode dengan ellipsis.';
      else if (targetModel === 'claude') targetModelTuning = 'Gunakan penalaran mendalam (extended thinking) untuk mengevaluasi trade-off arsitektural sebelum memberikan dokumen final.';
      else if (targetModel === 'deepseek') targetModelTuning = 'Gunakan penalaran runut dan evaluasi titik kritis kegagalan pada setiap pipa data.';
      else if (targetModel === 'cursor') targetModelTuning = 'Format dokumen agar siap dijadikan file panduan coding (.cursorrules atau ARCHITECTURE.md).';
    }

    let depthInstruction = '';
    if (isEn) {
      if (depth === 'compact') depthInstruction = 'Deliver concise, to-the-point specifications with zero filler fluff.';
      else if (depth === 'exhaustive') depthInstruction = 'Deliver an exhaustive, deeply granular specification including Mermaid diagrams, complete JSON payloads, and config snippets.';
      else depthInstruction = 'Deliver high technical depth, structured with clean Markdown headers, bullet points, and data contract tables.';
    } else {
      if (depth === 'compact') depthInstruction = 'Sajikan secara padat, to-the-point, hilangkan kata pengantar bertele-tele, langsung sajikan intisari spesifikasi.';
      else if (depth === 'exhaustive') depthInstruction = 'Sajikan secara sangat mendalam dan exhaustive, sertakan diagram alur Mermaid syntax, contoh payload JSON konkret untuk setiap pipa, dan blok kode konfigurasi.';
      else depthInstruction = 'Sajikan dengan kedalaman teknis tinggi, berbobot, terstruktur rapi dengan Markdown headers, bullet points, dan tabel kontrak data.';
    }

    // Assemble Prompt
    const promptHeader = isEn ? '### SYSTEM ROLE & INSTRUCTIONS' : '### PERAN & INSTRUKSI SISTEM';
    const contextHeader = isEn ? '### CANVAS ARCHITECTURE CONTEXT (AUTO-SYNCED)' : '### KONTEKS ARSITEKTUR KANVAS (AUTO-SYNCED)';
    const contextIntro = isEn ? 'Here is the modular architecture blueprint designed on the canvas:' : 'Berikut adalah blueprint arsitektur yang dirancang pengguna secara kustom:';
    const labelTitle = isEn ? 'Project / Architecture Name:' : 'Nama Proyek / Arsitektur:';
    const labelBoxes = isEn ? 'Total Component Boxes:' : 'Total Kotak Komponen:';
    const labelPipes = isEn ? 'Total Active Data Pipes:' : 'Total Sambungan Pipa Aktif:';
    const labelNotes = isEn ? 'Total Architecture Notes & Questions:' : 'Total Catatan & Pertanyaan Pengguna:';
    const h1Boxes = isEn ? '#### 1. LIST OF COMPONENT BOXES & SUB-BOXES:' : '#### 1. DAFTAR KOTAK & SUB-KOTAK:';
    const h2Pipes = isEn ? '#### 2. ACTIVE DATA PIPES ON CANVAS:' : '#### 2. DAFTAR SAMBUNGAN PIPA DATA YANG AKTIF DI KANVAS:';
    const h3Notes = isEn ? '#### 3. ARCHITECTURE NOTES & USER QUESTIONS (MANDATORY AI RESOLUTION):' : '#### 3. DAFTAR PERTANYAAN ARSITEKTUR & CATATAN KHUSUS PENGGUNA (WAJIB DIJAWAB OLEH AI):';
    const notesIntro = isEn
      ? 'The user attached specific architecture questions or decision points directly on the canvas. As an AI, you MUST address each question specifically, provide recommendations, and explain your technical rationale:'
      : 'Pengguna telah menempelkan catatan khusus berupa pertanyaan atau dilema arsitektur langsung di kanvas. Sebagai AI, kamu WAJIB menjawab pertanyaan-pertanyaan ini secara spesifik, lugas, dan memberikan rekomendasi teknis terbaik lengkap dengan alasannya:';
    const h4Extra = isEn ? '#### 4. USER ADDITIONAL REQUIREMENTS:' : '#### 4. CATATAN & PERMINTAAN TAMBAHAN PENGGUNA:';
    const deliverablesHeader = isEn ? '### REQUIRED DELIVERABLES:' : '### DELIVERABLES YANG HARUS KAMU BUAT:';
    const closingInstruction = isEn
      ? 'Ensure you thoroughly answer every question in the notes section above and analyze every connected data pipe. Format output with clean Markdown tables and code blocks.'
      : 'Pastikan kamu menjawab semua pertanyaan yang ada pada kotak catatan di atas secara detail dan menganalisis setiap sambungan pipa data yang terpasang di kanvas. Format keluaran menggunakan Markdown yang rapi dengan tabel dan blok kode.';

    const prompt = `${promptHeader}
${personaHeader}
${languageInstruction}
${targetModelTuning}
${depthInstruction}

---

${contextHeader}
${contextIntro}

**${labelTitle}** ${title}
**${labelBoxes}** ${mainBoxes.length}
**${labelPipes}** ${connections.length}
**${labelNotes}** ${notes.length}

${h1Boxes}
${boxesSummary.length ? boxesSummary.join('\n\n') : (isEn ? '(No component boxes added yet)' : '(Pengguna belum menambahkan kotak komponen)')}

${h2Pipes}
${pipesSummary.length ? pipesSummary.join('\n') : (isEn ? '(No pipes connected yet. Recommend optimal pipeline flow between components above.)' : '(Belum ada pipa yang tersambung di kanvas. Rekomendasikan alur pipa terbaik antar kotak di atas.)')}

${notesSummary.length > 0 ? `${h3Notes}
${notesIntro}

${notesSummary.join('\n\n')}\n` : ''}

${extraNotes ? `${h4Extra}\n${extraNotes}\n` : ''}
---

${deliverablesHeader}
${deliverables}

---
${closingInstruction}`;

    promptResultTextarea.value = prompt;

    // Token estimation
    const approxTokens = Math.round(prompt.length / 3.8);
    promptTokenEstimate.textContent = `~${approxTokens.toLocaleString()} tokens`;
    const subCount = mainBoxes.reduce((a, b) => a + b.subs.length, 0);
    promptIncludedSummary.textContent = isEn
      ? `${mainBoxes.length} Boxes, ${subCount} Sub-boxes, ${connections.length} Pipes, ${notes.length} Notes`
      : `${mainBoxes.length} Kotak, ${subCount} Sub-kotak, ${connections.length} Pipa, ${notes.length} Catatan/Tanya`;
  }

  function openPromptModal() {
    generateAIPrompt();
    promptModal.classList.add('active');
  }

  function closeAllModals() {
    featuresModal.classList.remove('active');
    promptModal.classList.remove('active');
    if (projectModal) projectModal.classList.remove('active');
    if (googleAuthModal) googleAuthModal.classList.remove('active');
    if (inviteModal) inviteModal.classList.remove('active');
    if (sidebarPanel) sidebarPanel.classList.remove('mobile-open');
    hideConfirmDialog();
  }

  document.getElementById('generatePromptBtn').addEventListener('click', openPromptModal);
  document.getElementById('quickPromptBtn').addEventListener('click', openPromptModal);
  document.getElementById('closePromptModal').addEventListener('click', () => promptModal.classList.remove('active'));
  document.getElementById('closePromptBottomBtn').addEventListener('click', () => promptModal.classList.remove('active'));

  // Live update prompt when inputs change
  promptModeSelect.addEventListener('change', generateAIPrompt);
  promptTargetModel.addEventListener('change', generateAIPrompt);
  promptLanguage.addEventListener('change', generateAIPrompt);
  promptExtraNotes.addEventListener('input', generateAIPrompt);

  document.querySelectorAll('input[name="promptDepth"]').forEach(r => {
    r.addEventListener('change', (e) => {
      document.querySelectorAll('.nb-radio-pill').forEach(p => p.classList.remove('active'));
      e.target.closest('.nb-radio-pill').classList.add('active');
      generateAIPrompt();
    });
  });

  // Copy Prompt
  function copyPromptToClipboard() {
    const text = promptResultTextarea.value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast('AI Prompt berhasil disalin! Silakan paste ke ChatGPT / Claude / Gemini');
    }).catch(() => {
      promptResultTextarea.select();
      document.execCommand('copy');
      showToast('AI Prompt berhasil disalin!');
    });
  }

  document.getElementById('copyPromptResultBtn').addEventListener('click', copyPromptToClipboard);
  document.getElementById('copyPromptPrimaryBtn').addEventListener('click', copyPromptToClipboard);

  // Download Prompt .txt
  document.getElementById('downloadPromptResultBtn').addEventListener('click', () => {
    const text = promptResultTextarea.value;
    if (!text) return;
    const title = projectTitle.trim() || 'prompt-arsitektur';
    const filename = title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-prompt.txt';

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast('File prompt berhasil diunduh!');
  });

  // ============================================================
  // BERSIHKAN KANVAS
  // ============================================================
  document.getElementById('clearBtn').addEventListener('click', () => {
    if (mainBoxes.length === 0 && notes.length === 0) return;
    showConfirmDialog({
      title: 'Kosongkan Kanvas',
      message: 'Apakah kamu yakin ingin mengosongkan semua kotak komponen, catatan, dan pipa di kanvas?',
      okText: 'Kosongkan Kanvas',
      onConfirm: () => {
        mainBoxes = [];
        notes = [];
        connections = [];
        mainBoxCounter = 0;
        subCounter = 0;
        noteCounter = 0;
        connCounter = 0;
        selectedBoxId = null;
        selectedConnId = null;
        render();
        saveToLocalStorage();
        showToast('Kanvas telah dibersihkan');
      }
    });
  });

  // ============================================================
  // TOAST NOTIFIKASI
  // ============================================================
  let toastTimer = null;
  function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('.toast-icon-wrap i');

    toastMsg.textContent = msg;
    toast.classList.toggle('error', isError);
    toastIcon.className = isError ? 'fas fa-xmark' : 'fas fa-check';

    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ============================================================
  // UTILITIES
  // ============================================================
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  // ============================================================
  // INITIALIZATION (POLOSAN DENGAN DEMO KOTAK & CATATAN PERTANYAAN)
  // ============================================================
  const importedSnapshot = checkUrlSnapshotImport();
  const loaded = importedSnapshot ? true : loadFromLocalStorage();
  if (!loaded || (mainBoxes.length === 0 && notes.length === 0)) {
    // Demo starter polosan
    const box1 = addMainBox({
      label: 'Kotak Client',
      color: '#fef08a',
      x: 100, y: 160, w: 250, h: 160,
      subs: [
        { id: 'sub-1', name: 'UI Tampilan', features: ['Form Input User', 'Tampilkan Data'] }
      ]
    });

    const box2 = addMainBox({
      label: 'Kotak Server API',
      color: '#bae6fd',
      x: 480, y: 160, w: 250, h: 160,
      subs: [
        { id: 'sub-2', name: 'Handler Endpoint', features: ['Validasi Request', 'Kirim Response JSON'] }
      ]
    });

    connections.push({
      id: 'pipe-1',
      from: { boxId: box1.id, subId: null, portType: 'output' },
      to: { boxId: box2.id, subId: null, portType: 'input' },
      connType: 'main',
      label: ''
    });

    connections.push({
      id: 'pipe-2',
      from: { boxId: box1.id, subId: 'sub-1', portType: 'output' },
      to: { boxId: box2.id, subId: 'sub-2', portType: 'input' },
      connType: 'sub',
      label: ''
    });
    connCounter = 2;

    // Contoh Kotak Catatan
    addNoteBox({
      title: 'Catatan Arsitektur Front-End',
      content: 'nanti pake arsitektur apa ya front end nya? (Next.js App Router, SPA React/Vite, atau Micro-frontend?)',
      color: '#fef08a',
      x: 100, y: 360, w: 260, h: 140
    });

    render();
    centerView();
    saveToLocalStorage();
  } else {
    applyTransform();
    render();
  }

  window.addEventListener('resize', () => {
    redrawConnections();
  });

  // Language Switchers Listeners
  const bindLangButtons = () => {
    ['landingLangId', 'dashLangId'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => setLanguage('id'));
    });
    ['landingLangEn', 'dashLangEn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => setLanguage('en'));
    });
  };
  bindLangButtons();
  setLanguage(currentLang);

  // Inisialisasi Auth, Real-time Collaboration & Router
  initUserAuth();
  initRealtimeCollab();

  if (!landingPage || window.location.hash === '#dashboard' || new URLSearchParams(window.location.search).has('room')) {
    showDashboard();
  } else {
    showLanding();
  }

})();
