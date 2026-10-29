'use strict';

/* =============================================
   1. SFX GENERATOR (Web Audio API)
   ============================================= */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'squeak') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1300, ctx.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'tada') {
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
        o.start(ctx.currentTime + i * 0.08);
        o.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    }
  } catch (e) {
    console.log('Audio Context Error:', e);
  }
}

/* Mascot Interaction */
document.getElementById('plushie-mascot')?.addEventListener('click', () => {
  playSound('squeak');
  alert('🧸 Teddy bilang: Tetap tersenyum dan gemoy selalu yaa Alfan! 💕');
});

/* =============================================
   2. CANVAS FLOATING BACKGROUND PARTICLES
   ============================================= */
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 14 + 10;
      this.speed = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.symbol = ['🌸', '✨', '💖', '🎀', '⭐'][Math.floor(Math.random() * 5)];
    }
    update() {
      this.y -= this.speed;
      if (this.y < -50) this.reset();
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px sans-serif`;
      ctx.fillText(this.symbol, this.x, this.y);
    }
  }

  for (let i = 0; i < 25; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* =============================================
   3. CONFETTI EMOJI RAIN
   ============================================= */
function triggerEmojiConfetti() {
  playSound('tada');
  const emojis = ['🧸', '🐰', '🐥', '🎀', '🌸', '💖', '🎂', '🎈', '✨', '💫'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-emoji';
      confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4500);
    }, i * 60);
  }
}

/* Mouse Sparkle Trails */
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTrailTime > 80) {
    lastTrailTime = now;
    const heart = document.createElement('div');
    heart.className = 'cursor-heart';
    const emojis = ['🧸', '🐰', '✨', '🎀', '🌸', '💖'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    heart.style.setProperty('--tx', (Math.random() - 0.5) * 50 + 'px');
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }
});

/* =============================================
   4. LOADING SCREEN & OPENING
   ============================================= */
window.addEventListener('load', () => {
  const loading = document.getElementById('loading-screen');
  if (!loading) return;
  setTimeout(() => {
    loading.classList.add('fade-out');
    setTimeout(() => {
      loading.style.display = 'none';
      initOpeningSection();
    }, 800);
  }, 1800);
});

function initOpeningSection() {
  const lines = document.querySelectorAll('.typing-line');
  const btn = document.getElementById('btn-open');
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('visible'), i * 1000 + 200);
  });
  if (btn) {
    setTimeout(() => btn.classList.add('visible'), lines.length * 1000 + 300);
  }
}

document.getElementById('btn-open')?.addEventListener('click', () => {
  playSound('pop');
  document.getElementById('section-birthday')?.scrollIntoView({ behavior: 'smooth' });
});

/* =============================================
   5. SCROLL PROGRESS & INTERSECTION OBSERVER
   ============================================= */
window.addEventListener('scroll', () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / totalScroll) * 100;
  const progress = document.getElementById('scroll-progress');
  if (progress) progress.style.width = scrolled + '%';

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }

  /* Timeline dynamic height */
  const timeline = document.getElementById('section-timeline');
  const tProgress = document.getElementById('timeline-progress');
  if (timeline && tProgress) {
    const rect = timeline.getBoundingClientRect();
    const total = timeline.offsetHeight;
    const current = Math.max(0, -rect.top + window.innerHeight / 2);
    const p = Math.min(100, (current / total) * 100);
    tProgress.style.height = p + '%';
  }
});

/* Intersection Observer for Scroll Animations */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.getElementById('back-to-top')?.addEventListener('click', () => {
  playSound('pop');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   6. GALLERY & LIGHTBOX MODAL
   ============================================= */
const galleryImages = [
  { type: 'image', src: 'foto1.jpg', caption: '✨ Senyum Alfan yang selalu manis!' },
  { type: 'image', src: 'foto2.jpg', caption: '💕 Pria yang bijaksana' },
  { type: 'image', src: 'foto3.jpg', caption: '🎂 Alfan pria tampan!' },
  { type: 'image', src: 'foto4.jpg', caption: '🎥 Handsome' },
];

let lbIndex = 0;
const grid = document.getElementById('gallery-grid');

if (grid) {
  galleryImages.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'gallery-item reveal';
    card.innerHTML = `
      <div class="washi-tape"></div>
      ${
        item.type === 'video'
          ? `<video class="gallery-video" muted loop playsinline preload="metadata">
               <source src="${item.src}" type="video/mp4">
             </video>`
          : `<img src="${item.src}" alt="Gallery ${i}">`
      }
      <div class="polaroid-caption">${item.caption}</div>
    `;
    card.addEventListener('click', () => {
      playSound('pop');
      openLightbox(i);
    });
    grid.appendChild(card);
    revealObserver.observe(card);
  });
}

/* Auto-play gallery videos when in viewport */
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.gallery-video').forEach(v => videoObserver.observe(v));

function openLightbox(i) {
  lbIndex = i;
  const lb = document.getElementById('lightbox');
  const container = document.getElementById('lightbox-media-container');
  const caption = document.getElementById('lightbox-caption');
  
  if (lb && container) {
    const item = galleryImages[i];
    if (item.type === 'video') {
      container.innerHTML = `<video src="${item.src}" controls autoplay playsinline style="max-width:85vw; max-height:70vh; border-radius:16px; border:4px solid var(--pink-soft);"></video>`;
    } else {
      container.innerHTML = `<img src="${item.src}" alt="Lightbox Media" style="max-width:85vw; max-height:70vh; border-radius:16px; border:4px solid var(--pink-soft);">`;
    }
    if (caption) caption.textContent = item.caption;
    lb.classList.add('active');
  }
}

document.getElementById('lightbox-close')?.addEventListener('click', () => {
  playSound('pop');
  document.getElementById('lightbox')?.classList.remove('active');
});
document.getElementById('lightbox-prev')?.addEventListener('click', () => {
  playSound('pop');
  lbIndex = (lbIndex - 1 + galleryImages.length) % galleryImages.length;
  openLightbox(lbIndex);
});
document.getElementById('lightbox-next')?.addEventListener('click', () => {
  playSound('pop');
  lbIndex = (lbIndex + 1) % galleryImages.length;
  openLightbox(lbIndex);
});

/* =============================================
   7. POP THE BALLOON GAME
   ============================================= */
const balloonArena = document.getElementById('balloon-arena');
const balloonEmojis = ['🧸', '🐰', '🐥', '🐻', '🐱', '🎀'];
const balloonWishes = [
  'Semoga makin gemoy!',
  'Rezeki lancar selalu!',
  'Makin pintar dan sukses!',
  'Sehat dan happy terus!',
  'Tetap jadi cowok ceria!',
  'Impianmu segera terwujud!'
];

function spawnBalloon() {
  if (!balloonArena) return;
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  const randomIndex = Math.floor(Math.random() * balloonEmojis.length);
  const currentEmoji = balloonEmojis[randomIndex]; // Tangkap emoji boneka yang terpilih
  balloon.textContent = currentEmoji;
  balloon.style.left = Math.random() * 85 + 5 + '%';

  balloon.addEventListener('click', () => {
    playSound('pop');

    // Munculkan custom modal alih-alih alert()
    const popup = document.getElementById('balloon-popup');
    const textEl = document.getElementById('balloon-popup-text');
    const emojiEl = document.getElementById('balloon-popup-emoji');

    if (textEl && popup && emojiEl) {
      emojiEl.textContent = currentEmoji; // Menampilkan emoji boneka yang diklik
      textEl.textContent = `"${balloonWishes[randomIndex]}" ✨`;
      popup.classList.add('active');
    }

    balloon.remove();
  });

  balloonArena.appendChild(balloon);
  setTimeout(() => { if (balloon.parentNode) balloon.remove(); }, 6000);
}

setInterval(spawnBalloon, 1600);

// Tombol tutup modal pop-up balon
document.getElementById('balloon-popup-close')?.addEventListener('click', () => {
  playSound('pop');
  document.getElementById('balloon-popup')?.classList.remove('active');
});


/* =============================================
   8. REASONS CARDS GENERATOR
   ============================================= */
const reasonEmojis = ['🌟', '😊', '💖', '🔥', '🤗', '👁️', '⚡', '😂', '💪', '🎨', '🌸', '🌈', '💎', '🌺', '💬', '🌱', '🏆', '🦋'];
const reasonTexts = [
  'Selalu bisa bikin suasana jadi lebih seru.',
  'Senyumnya bikin hari terasa lebih cerah.',
  'Orangnya baik dan penuh perhatian.',
  'Selalu punya semangat baru.',
  'Mudah membuat orang nyaman.',
  'Punya cara unik melihat dunia.',
  'Selalu membawa energi positif.',
  'Humornya bikin ketawa.',
  'Pantang menyerah.',
  'Kreatif.',
  'Ramah.',
  'Ceria.',
  'Tulus.',
  'Baik hati.',
  'Menyenangkan diajak ngobrol.',
  'Selalu berkembang jadi pribadi yang lebih baik.',
  'Layak mendapatkan kebahagiaan.',
  'Karena dia adalah Alfan. 💕'
];

function buildReasonCards() {
  const grid = document.getElementById('reasons-grid');
  if (!grid) return;
  reasonTexts.forEach((text, i) => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `
      <div class="reason-card-inner">
        <div class="reason-card-front">
          <div>
            <span class="emoji">${reasonEmojis[i]}</span>
            <div class="num">${i + 1}</div>
          </div>
        </div>
        <div class="reason-card-back">
          <p>${text}</p>
        </div>
      </div>
    `;
    card.addEventListener('click', () => {
      playSound('pop');
      card.classList.toggle('flipped');
    });
    grid.appendChild(card);
  });
}
buildReasonCards();

/* =============================================
   9. ENVELOPE / LETTER TOGGLE
   ============================================= */
document.getElementById('envelope')?.addEventListener('click', () => {
  playSound('squeak');
  const env = document.getElementById('envelope');
  const paper = document.getElementById('letter-paper');
  if (env) env.classList.add('open');
  if (paper) paper.classList.add('visible');
});

/* =============================================
   10. GIFT GAME
   ============================================= */
const giftBoxesContainer = document.getElementById('gift-boxes');
const gameMessage = document.getElementById('game-message');
const resetBtn = document.getElementById('game-reset');

function initGame() {
  if (!giftBoxesContainer) return;
  giftBoxesContainer.innerHTML = '';
  const winIndex = Math.floor(Math.random() * 3);
  
  for (let i = 0; i < 3; i++) {
    const box = document.createElement('div');
    box.className = 'gift-box';
    box.textContent = '🎁';
    box.addEventListener('click', () => {
      if (i === winIndex) {
        playSound('tada');
        box.textContent = '🎉';
        if (gameMessage) gameMessage.innerHTML = '✨ SELAMAT! Kamu menangin pelukan & doa terbaik di umur 18 ini! 💕';
        if (resetBtn) resetBtn.style.display = 'inline-flex';
        triggerEmojiConfetti();
      } else {
        playSound('pop');
        box.textContent = '😅';
        if (gameMessage) gameMessage.textContent = 'Zonk! Coba tebak kotak yang lain ya! 😜';
      }
    });
    giftBoxesContainer.appendChild(box);
  }
}
initGame();

resetBtn?.addEventListener('click', () => {
  playSound('pop');
  if (gameMessage) gameMessage.textContent = 'Kira-kira mana ya kado yang isinya kejutan? 🤔';
  resetBtn.style.display = 'none';
  initGame();
});

/* =============================================
   11. WISH & BLOW CANDLE
   ============================================= */
document.getElementById('btn-wish')?.addEventListener('click', () => {
  triggerEmojiConfetti();
  const res = document.getElementById('wish-result');
  if (res) res.classList.add('visible');
});

document.getElementById('btn-blow')?.addEventListener('click', () => {
  playSound('pop');
  triggerEmojiConfetti();
  const flames = document.querySelectorAll('.flame-blow');
  flames.forEach(f => f.classList.add('blown'));
  const msg = document.getElementById('blow-message');
  if (msg) msg.classList.add('visible');
});

/* =============================================
   12. MUSIC PLAYER & EASTER EGG
   ============================================= */
const musicBtn = document.getElementById('music-player');
const audio = document.getElementById('birthday-audio');
let isPlaying = false;

musicBtn?.addEventListener('click', () => {
  playSound('pop');
  if (!audio) return;
  if (isPlaying) {
    audio.pause();
    musicBtn.textContent = '🎵';
  } else {
    audio.play().catch(() => {});
    musicBtn.textContent = '🎶';
  }
  isPlaying = !isPlaying;
});

document.getElementById('easter-egg-btn')?.addEventListener('click', () => {
  playSound('squeak');
  document.getElementById('easter-popup')?.classList.add('active');
});
document.getElementById('easter-close')?.addEventListener('click', () => {
  playSound('pop');
  document.getElementById('easter-popup')?.classList.remove('active');
});

/* =============================================
   13. REAL-TIME COUNTDOWN
   ============================================= */
function updateCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const target = new Date('2026-10-20T00:00:00');
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    el.textContent = '🎉 Selamat Ulang Tahun Alfan! 🎉';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);

  el.textContent = `${days} Hari : ${hours} Jam : ${mins} Menit`;
}
updateCountdown();
setInterval(updateCountdown, 60000);

/* =============================================
   AUTOPLAY MUSIC ON FIRST MOBILE TOUCH
   ============================================= */
let hasInteractedMobile = false;

function handleMobileTouch() {
  if (hasInteractedMobile) return;
  
  const audio = document.getElementById('birthday-audio');
  const musicBtn = document.getElementById('music-player');
  
  if (audio && !isPlaying) {
    audio.play().then(() => {
      isPlaying = true;
      if (musicBtn) musicBtn.textContent = '🎶';
      hasInteractedMobile = true;
      
      // Hapus event listener setelah musik berhasil menyala sekali
      window.removeEventListener('touchstart', handleMobileTouch);
      window.removeEventListener('click', handleMobileTouch);
    }).catch((err) => {
      console.log('Mobile autoplay waiting:', err);
    });
  }
}

// Merekam sentuhan atau tap pertama kali di layar HP
window.addEventListener('touchstart', handleMobileTouch, { once: true });
window.addEventListener('click', handleMobileTouch, { once: true });
