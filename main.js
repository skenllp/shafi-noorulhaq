/* ══════════════════════════════════════════════════════════
   COVER → VIDEO → HERO  flow
══════════════════════════════════════════════════════════ */
(function () {
  var cover     = document.getElementById('cover');
  var overlay   = document.getElementById('video-overlay');
  var video     = document.getElementById('reveal-video');
  var skipBtn   = document.getElementById('skip-btn');
  var fadeMask  = document.getElementById('video-fade-mask');
  var openBtn   = document.getElementById('open-btn');
  var hero      = document.getElementById('hero');

  var skipTimer = null;
  var dismissed = false;

  /* ── Background music ── */
  var bgAudio = new Audio('hulm-al-takhruj.mp3');
  bgAudio.loop   = true;
  bgAudio.volume = 0.75;

  function playAudio() {
    bgAudio.play().catch(function () { /* autoplay policy – silently ignore */ });
  }

  function stopAudio() {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  }

  /* Stop when tab is hidden or closed */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAudio(); else playAudio();
  });
  window.addEventListener('pagehide',     stopAudio);
  window.addEventListener('beforeunload', stopAudio);

  /* ── Step 2: video ends or skip → crossfade into hero ── */
  function goToHero() {
    if (dismissed) return;
    dismissed = true;

    clearTimeout(skipTimer);
    skipBtn.style.display = 'none';

    // 1) Scroll hero into position instantly (no animation yet, it's hidden behind overlay)
    hero.scrollIntoView({ behavior: 'instant' });

    // 2) Fade the white mask over the video (0 → 1 over 600 ms)
    if (fadeMask) {
      fadeMask.style.transition = 'opacity 0.6s ease';
      fadeMask.classList.add('active');
    }

    // 3) After white mask covers video, fade the whole overlay out → reveals hero underneath
    setTimeout(function () {
      overlay.style.transition = 'opacity 0.7s ease';
      overlay.style.opacity = '0';

      // 4) After overlay gone, clean up DOM
      setTimeout(function () {
        overlay.style.display = 'none';
        cover.remove();
        overlay.remove();
      }, 720);
    }, 580);
  }

  /* ── Step 1: button click → hide cover, show & play video ── */
  function startVideo() {
    openBtn.disabled = true;

    // Start background music
    playAudio();

    // Instantly hide the cover
    cover.style.transition = 'opacity 0.35s ease';
    cover.style.opacity    = '0';
    cover.style.pointerEvents = 'none';

    // Show video overlay on top (z-index 1001)
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    overlay.classList.add('active');

    // Play
    video.play().catch(function () {
      // Autoplay blocked – show native controls as fallback
      video.controls = true;
    });

    // Show skip button after 2 s
    skipTimer = setTimeout(function () {
      skipBtn.classList.add('visible');
    }, 2000);
  }

  /* ── Wire events ── */
  openBtn.addEventListener('click', startVideo);
  skipBtn.addEventListener('click', goToHero);
  video.addEventListener('ended', goToHero);

  // ESC / Space skips when video is playing
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === ' ') && overlay.classList.contains('active')) {
      e.preventDefault();
      goToHero();
    }
  });
})();


/* ══════════════════════════════════════════════════════════
   LIVE COUNTDOWN  –  21 Dec 2026 · 11:00 AM IST (UTC+5:30) — Nikkah
══════════════════════════════════════════════════════════ */
(function () {
  var target = new Date('2026-12-21T11:00:00+05:30').getTime();

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'].forEach(function (id) {
        document.getElementById(id).textContent = '00';
      });
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000)  / 60000);
    var s = Math.floor((diff % 60000)    / 1000);

    document.getElementById('cd-days').textContent    = pad(d);
    document.getElementById('cd-hours').textContent   = pad(h);
    document.getElementById('cd-minutes').textContent = pad(m);
    document.getElementById('cd-seconds').textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ══════════════════════════════════════════════════════════
   SCROLL FADE-IN  (IntersectionObserver)
══════════════════════════════════════════════════════════ */
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });
})();


/* ══════════════════════════════════════════════════════════
   SCRATCH-TO-REVEAL HEART  +  CONFETTI POPPERS
══════════════════════════════════════════════════════════ */
(function () {
  var canvas     = document.getElementById('scratchCanvas');
  var hint       = document.getElementById('scratchHint');
  var subText    = document.getElementById('scratchSub');
  var confCanvas = document.getElementById('confettiCanvas');

  if (!canvas || !confCanvas) return;

  /* ── Size canvas to container ── */
  var W = 360, H = 330;
  canvas.width  = W;
  canvas.height = H;
  confCanvas.width  = window.innerWidth;
  confCanvas.height = window.innerHeight;

  window.addEventListener('resize', function () {
    confCanvas.width  = window.innerWidth;
    confCanvas.height = window.innerHeight;
  });

  var ctx = canvas.getContext('2d');

  /* ── Paint scratch surface (solid gold, full fill) ── */
  function paintScratchSurface() {
    ctx.clearRect(0, 0, W, H);

    // Solid opaque gold fill — covers 100% of the heart
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,    '#F2DC9B');
    bg.addColorStop(0.3,  '#D4AF37');
    bg.addColorStop(0.65, '#B8960C');
    bg.addColorStop(1,    '#8C7208');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle luxury diagonal highlight
    var shine = ctx.createLinearGradient(W * 0.15, H * 0.05, W * 0.65, H * 0.6);
    shine.addColorStop(0,   'rgba(255,255,240,0)');
    shine.addColorStop(0.45,'rgba(255,255,240,0.18)');
    shine.addColorStop(1,   'rgba(255,255,240,0)');
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, W, H);

    // "✦ SCRATCH TO REVEAL ✦" label
    ctx.fillStyle = 'rgba(60, 38, 4, 0.90)';
    ctx.font = '600 13px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦  SCRATCH TO REVEAL  ✦', W / 2, H * 0.42);

    // Heart ♡ hint
    ctx.fillStyle = 'rgba(60, 38, 4, 0.45)';
    ctx.font = '32px serif';
    ctx.fillText('♡', W / 2, H * 0.58);
  }

  paintScratchSurface();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (!started && !revealed) paintScratchSurface();
    });
  }

  var isDrawing = false;
  var brushR    = 42;
  var revealed  = false;
  var started   = false;

  function getPos(e, el) {
    var r = el.getBoundingClientRect();
    var t = e.touches ? e.touches[0] : e;
    var scaleX = W / r.width;
    var scaleY = H / r.height;
    return {
      x: (t.clientX - r.left) * scaleX,
      y: (t.clientY - r.top)  * scaleY
    };
  }

  var scratchReveal = document.getElementById('scratchReveal');

  function scratch(e) {
    if (!isDrawing) return;
    if (scratchReveal && !scratchReveal.classList.contains('revealing')) {
      scratchReveal.classList.add('revealing');
    }
    var p = getPos(e, canvas);

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(p.x, p.y, brushR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (!started) {
      started = true;
      if (hint) hint.classList.add('hidden');
    }

    checkReveal();
  }

  function checkReveal() {
    if (revealed) return;
    var data   = ctx.getImageData(0, 0, W, H).data;
    var total  = 0, transparent = 0;
    for (var i = 3; i < data.length; i += 4) {
      total++;
      if (data[i] < 128) transparent++;
    }
    if (transparent / total > 0.48) {
      revealed = true;
      if (scratchReveal) scratchReveal.classList.add('revealed');
      // Wipe remaining canvas smoothly
      setTimeout(function () {
        ctx.clearRect(0, 0, W, H);
      }, 250);

      if (subText) {
        setTimeout(function () {
          subText.textContent = '✦ You\'re Invited! Insha Allah ✦';
          subText.classList.add('revealed');
        }, 500);
      }

      // Fire confetti!
      setTimeout(launchConfetti, 350);
    }
  }

  canvas.addEventListener('mousedown',  function (e) { isDrawing = true; scratch(e); });
  canvas.addEventListener('mousemove',  function (e) { scratch(e); });
  canvas.addEventListener('mouseup',    function ()  { isDrawing = false; });
  canvas.addEventListener('mouseleave', function ()  { isDrawing = false; });
  canvas.addEventListener('touchstart', function (e) { e.preventDefault(); isDrawing = true; scratch(e); }, { passive: false });
  canvas.addEventListener('touchmove',  function (e) { e.preventDefault(); scratch(e); }, { passive: false });
  canvas.addEventListener('touchend',   function ()  { isDrawing = false; });


  /* ══════════════════════════════════════════════════════════
     CONFETTI POPPERS
  ══════════════════════════════════════════════════════════ */
  function launchConfetti() {
    confCanvas.classList.add('active');
    var cctx  = confCanvas.getContext('2d');
    var W     = confCanvas.width;
    var H     = confCanvas.height;
    var pieces = [];
    var colors = ['#D4AF37','#E8B4A0','#C9906A','#FFFFFF','#FFD700','#FF8FA3','#98D8C8','#B8860B','#FFF2CE'];

    /* Emit 3 poppers: left, centre, right */
    var origins = [
      { x: 0.1,  vy: -22, spread: 55  },
      { x: 0.5,  vy: -28, spread: 80  },
      { x: 0.9,  vy: -22, spread: 55  }
    ];

    origins.forEach(function (o) {
      for (var i = 0; i < 65; i++) {
        var angle = (Math.random() * o.spread - o.spread / 2) * (Math.PI / 180);
        pieces.push({
          x:  o.x * W,
          y:  H,
          vx: Math.sin(angle) * (6 + Math.random() * 10),
          vy: o.vy - Math.random() * 8,
          rot: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
          color: colors[Math.floor(Math.random() * colors.length)],
          w: 7 + Math.random() * 7,
          h: 4 + Math.random() * 4,
          alpha: 1,
          shape: Math.random() > 0.45 ? 'rect' : 'circle'
        });
      }
    });

    var gravity = 0.55;
    var frame   = 0;
    var maxFrames = 220;

    function animate() {
      if (frame >= maxFrames) {
        cctx.clearRect(0, 0, W, H);
        confCanvas.classList.remove('active');
        return;
      }
      frame++;
      cctx.clearRect(0, 0, W, H);

      pieces.forEach(function (p) {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += gravity;
        p.vx  *= 0.99;
        p.rot += p.rotSpeed;
        if (frame > 140) p.alpha -= 0.012;
        p.alpha = Math.max(0, p.alpha);

        cctx.save();
        cctx.globalAlpha = p.alpha;
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot * Math.PI / 180);
        cctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          cctx.beginPath();
          cctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          cctx.fill();
        } else {
          cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        cctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

})();
