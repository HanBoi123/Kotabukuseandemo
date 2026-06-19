/* ─────────────────────────────────────────────────────────────────────────────
   SW Bookstore Rewards — GSAP Animations
   Sections are added here one by one as they are built out.
───────────────────────────────────────────────────────────────────────────── */

gsap.registerPlugin(ScrollTrigger);

/* ── Shared helper: split h2 text into per-word inline spans ── */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  return words.map(word => {
    const outer = document.createElement('span');
    const inner = document.createElement('span');
    outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
    inner.style.display = 'inline-block';
    inner.textContent = word;
    outer.appendChild(inner);
    el.appendChild(outer);
    el.appendChild(document.createTextNode(' ')); // preserve word spacing
    return inner;
  });
}

/* ─── HERO SECTION ─────────────────────────────────────────────────────────── */
(function heroAnimations() {

  /* ── 1. Set initial hidden states ── */
  gsap.set('.hero-copy .eyebrow',        { opacity: 0, y: 44 });
  gsap.set('.hero-copy h1',              { opacity: 0, y: 44 });
  gsap.set('.hero-copy .hero-subtitle',  { opacity: 0, y: 44 });
  gsap.set('.hero-copy .scroll-trigger', { opacity: 0, y: 44 });
  gsap.set('.vault-stage',               { opacity: 0, x: 70 });
  gsap.set('.vault-aura',                { opacity: 0, scale: 0.6 });

  // Panels + their inner content all start hidden
  gsap.set('.vault-panel',               { opacity: 0 });
  gsap.set('.vault-panel span, .vault-panel strong', { opacity: 0 });

  /* ── 2. Page-load entrance timeline (copy + vault stage) ── */
  const heroTl = gsap.timeline({ delay: 0.15 });

  heroTl
    .to('.hero-copy .eyebrow', {
      opacity: 1, y: 0, duration: 0.65, ease: 'power3.out'
    })
    .to('.hero-copy h1', {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out'
    }, '-=0.4')
    .to('.hero-copy .hero-subtitle', {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out'
    }, '-=0.45')
    .to('.hero-copy .scroll-trigger', {
      opacity: 1, y: 0, duration: 0.55, ease: 'power3.out'
    }, '-=0.35')
    .to('.vault-stage', {
      opacity: 1, x: 0, duration: 1.0, ease: 'power3.out', clearProps: 'x,transform'
    }, '-=1.1')
    .to('.vault-aura', {
      opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out'
    }, '-=0.6');

  /* ── 3. Vault panels — fly in from 4 corners + flip + text reveal ── */
  const panels = document.querySelectorAll('.vault-panel');

  // Each panel enters from a different corner
  const directions = [
    { x: -160, y: -70  },  // 01: top-left
    { x:  160, y: -50  },  // 02: top-right
    { x: -140, y:  70  },  // 03: bottom-left
    { x:  140, y:  90  },  // 04: bottom-right
  ];

  panels.forEach((panel, i) => {
    const d     = directions[i];
    const badge = panel.querySelector('span');
    const label = panel.querySelector('strong');

    gsap.set(panel, { x: d.x, y: d.y, rotateY: -8 });

    const ptl = gsap.timeline({ delay: 0.7 + i * 0.32 });

    // Idle float params — each card gets a unique feel
    const idle = [
      { y: -8,  duration: 2.8, delay: 0.0 },
      { y: -5,  duration: 3.3, delay: 0.6 },
      { y: -10, duration: 2.5, delay: 1.1 },
      { y: -7,  duration: 3.0, delay: 0.3 },
    ][i];

    ptl
      // Step 1: glide in from corner
      .to(panel, {
        opacity: 1, x: 0, y: 0,
        duration: 0.75, ease: 'power2.out'
      })

      // Step 2: flip first half
      .to(panel, {
        rotateY: 90,
        duration: 0.26, ease: 'sine.in'
      })

      // Step 3: flip second half
      .to(panel, {
        rotateY: -8,
        duration: 0.26, ease: 'sine.out'
      })

      // Step 4: text fades in
      .to([badge, label], {
        opacity: 1, duration: 0.35, ease: 'power2.out'
      }, '-=0.12')

      // Step 5: after flip done, start looping idle float
      // Each card has its own amplitude, period and phase so they drift independently
      .call(() => {
        gsap.to(panel, {
          y: idle.y,
          rotateY: -5,          // subtle tilt sway back toward flat
          duration: idle.duration,
          delay: idle.delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
  });

  /* ── 4. Mystery panel (#03) — smooth box-shadow pulse after flip ── */
  // filter: brightness() causes GPU flicker — animate boxShadow instead
  // delay = panel 03 start (0.7 + 2*0.32) + fly(0.75) + flip(0.52) + text(0.35)
  gsap.delayedCall(0.7 + 2 * 0.32 + 0.75 + 0.52 + 0.35, () => {
    gsap.to('.vault-panel.mystery', {
      boxShadow: [
        'inset 0 1px 0 rgba(74,158,255,0.35)',
        '0 0 0 2px rgba(74,158,255,0.55)',
        '0 20px 60px rgba(30,80,220,0.55)',
        '0 0 60px rgba(74,158,255,0.6)',
      ].join(', '),
      repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut'
    });
  });

  /* ── 5. Wave divider — two layers drift at different speeds on scroll ── */
  const wavePaths = document.querySelectorAll('.hero-wave path');
  if (wavePaths.length === 2) {
    // Back wave drifts left
    gsap.to(wavePaths[0], {
      x: -30, ease: 'none',
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2
      }
    });
    // Front wave drifts right (opposite direction = depth illusion)
    gsap.to(wavePaths[1], {
      x: 20, ease: 'none',
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5
      }
    });
  }

  /* ── 6. Ambient grid — slow continuous drift ── */
  gsap.to('.ambient-grid', {
    rotation: 8, scale: 1.06,
    duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  /* ── 6. Scroll parallax ── */
  gsap.to('.vault-stage', {
    yPercent: -18, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2
    }
  });

  gsap.to('.hero-copy', {
    yPercent: -10, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.0
    }
  });

  gsap.to('.hero-scroll-hint', {
    opacity: 0, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: '15% top', scrub: true
    }
  });

})();

/* ─── REWARD 01 — BLIND BOX ─────────────────────────────────────────────────── */
(function reward01Animations() {

  const section = document.querySelector('.blind-box');
  if (!section) return;

  /* ── 1. Visual stage — fade + lift on enter ── */
  gsap.from('.blind-box .visual-stage', {
    opacity: 0, y: 50, duration: 1.0, ease: 'power3.out',
    scrollTrigger: {
      trigger: section, start: 'top 82%', toggleActions: 'play none none none'
    }
  });

  /* ── 2. Stage orbit — slow rotation tied to scroll ── */
  gsap.to('.blind-box .stage-orbit', {
    rotation: 180, ease: 'none',
    scrollTrigger: {
      trigger: section, start: 'top bottom', end: 'bottom top', scrub: 4
    }
  });

  /* ── 3. Cards fan out — scrubbed to scroll ──
     CSS base transforms:
       lc-back-2:  rotate(-9deg)   translate(-9px, -20px)
       lc-back-1:  rotate(-4.5deg) translate(-4px, -10px)
       lc-front:   no transform (sits flat)
     GSAP animates FROM those CSS values TO fanned-out positions.         ── */
  const cardST = {
    trigger: section,
    start: 'top 65%',
    end: 'center 20%',
    scrub: 2
  };

  gsap.fromTo('.lc-back-2',
    { rotation: -9,   x: -9,  y: -20 },
    { rotation: -24,  x: -105, y: -5, ease: 'none', scrollTrigger: cardST }
  );

  gsap.fromTo('.lc-back-1',
    { rotation: -4.5, x: -4,  y: -10 },
    { rotation: 14,   x: 85,  y: -2,  ease: 'none', scrollTrigger: cardST }
  );

  gsap.fromTo('.lc-front',
    { y: 0 },
    { y: -22, ease: 'none', scrollTrigger: cardST }
  );

  /* ── 4. Reward index eyebrow — fades up on enter ── */
  gsap.from('.blind-box .reward-index', {
    opacity: 0, y: 18, duration: 0.5, ease: 'power2.out',
    scrollTrigger: {
      trigger: '.blind-box .section-copy', start: 'top 68%',
      toggleActions: 'play none none none'
    }
  });

  /* ── 5. H2 — word-by-word reveal from behind mask ── */
  const h2 = section.querySelector('h2');
  if (h2) {
    const wordInners = splitWords(h2);
    gsap.from(wordInners, {
      y: '105%',
      stagger: 0.07,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.blind-box .section-copy', start: 'top 65%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* ── 6. Body copy + CTA — fade up after heading ── */
  gsap.from('.blind-box .section-copy > p:last-of-type', {
    opacity: 0, y: 22, duration: 0.6, ease: 'power2.out',
    scrollTrigger: {
      trigger: '.blind-box .section-copy', start: 'top 60%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('.blind-box .scroll-trigger', {
    opacity: 0, y: 18, duration: 0.5, ease: 'power2.out', delay: 0.12,
    scrollTrigger: {
      trigger: '.blind-box .section-copy', start: 'top 60%',
      toggleActions: 'play none none none'
    }
  });

  /* ── 7. Prize ribbon — scrubbed ticker ──
     Trigger on the SECTION (not the ribbon itself which is abs-positioned
     at the bottom). Start when section is half in view, finish well
     before the section bottom so all tags are visible in time.          ── */
  const ribbonSpans = section.querySelectorAll('.prize-ribbon span');
  gsap.set(ribbonSpans, { x: 80, autoAlpha: 0 });

  gsap.to(ribbonSpans, {
    x: 0, autoAlpha: 1,
    stagger: 0.16,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top 45%',
      end: 'top -10%',
      scrub: 1.2
    }
  });

})();

/* ─── CARD LAUNCH TRANSITION (Reward 01 → Reward 02) ───────────────────────
   The EXISTING .lc-front card becomes the transition card — no foreign card.
   onEnter captures its bounding rect and teleports .card-launch-face there,
   hiding the original so the swap is seamless. The face then spins + scales
   to fill the viewport. onLeave hides the overlay AND force-scrolls to
   #reward-02 so there's no awkward gap after the pin releases.              ── */
(function cardLaunchTransition() {
  const section    = document.querySelector('.blind-box');
  const lcFront    = section ? section.querySelector('.lc-front') : null;
  const cardStack  = section ? section.querySelector('.luxury-card-stack') : null;
  const launchEl   = document.querySelector('.card-launch');
  const launchFace = document.querySelector('.card-launch-face');
  const launchWash = document.querySelector('.card-launch-wash');
  if (!section || !lcFront || !launchEl || !launchFace || !launchWash) return;

  /* Position face to exactly match where .lc-front sits on screen.
     .card-launch is a centered flex container, so x/y are offsets from
     viewport centre. Called each time the transition activates.            */
  function snapFaceToCard() {
    const rect = lcFront.getBoundingClientRect();
    const vcx  = window.innerWidth  / 2;
    const vcy  = window.innerHeight / 2;
    gsap.set(launchFace, {
      transformPerspective: 900,
      width:   rect.width,
      height:  rect.height,
      x: (rect.left + rect.width  / 2) - vcx,
      y: (rect.top  + rect.height / 2) - vcy,
      rotateY: 0,
      scale: 1,
      autoAlpha: 1
    });
  }

  /* Show the transition: stop float, snap face to card, fire plain fly-in */
  function showTransition() {
    if (cardStack) cardStack.style.animation = 'none';
    snapFaceToCard();                         // position face exactly over lc-front
    gsap.set(lcFront,  { autoAlpha: 0 });    // hide original
    gsap.set(launchEl, { autoAlpha: 1 });    // reveal overlay container
    /* Plain (non-scrubbed) tween — always smooth, no from-value race */
    gsap.to(launchFace, {
      x: 0, y: 0,
      duration: 0.65,
      ease: 'power2.inOut',
      overwrite: 'auto'
    });
  }

  /* Hide the transition: kill fly-in if still running, restore real card */
  function hideTransition() {
    gsap.killTweensOf(launchFace, 'x,y');
    gsap.set(launchEl, { autoAlpha: 0 });
    gsap.set(lcFront,  { autoAlpha: 1 });
    if (cardStack) cardStack.style.animation = '';
  }

  /* ── Scrubbed timeline ────────────────────────────────────────────────── */
  /* x/y (fly to centre) is intentionally NOT in this timeline.
     It runs as a plain gsap.to() in onEnter so there is no from-value
     race condition with the scrub — the card always glides smoothly.     */
  const tl = gsap.timeline();

  /* Phase 1 (0–30 %): section content fades out */
  tl.to(
    ['.blind-box .section-copy', '.blind-box .prize-ribbon'],
    { autoAlpha: 0, duration: 0.3 },
    0
  );

  /* Phase 2 (30–90 %): one spin + scale to fill viewport */
  tl.to(launchFace, {
    rotateY: 360, scale: 14,
    duration: 0.6, ease: 'power2.inOut'
  }, 0.3);

  /* Phase 3 (90–100 %): cream wash */
  tl.to(launchWash, { autoAlpha: 1, duration: 0.1 }, 0.9);

  /* ── ScrollTrigger: pin + scrub ─────────────────────────────────────── */
  ScrollTrigger.create({
    trigger:    section,
    start:      'bottom bottom',
    end:        '+=120%',        /* shorter runway = pin releases sooner */
    pin:        true,
    pinSpacing: true,
    scrub:      1.0,
    animation:  tl,
    onEnter:     showTransition,
    onEnterBack: showTransition,
    onLeaveBack: hideTransition,
    onLeave: () => {
      hideTransition();
      /* Force-jump to Reward 02 top so there's no scroll gap */
      setTimeout(() => {
        document.getElementById('reward-02')
          ?.scrollIntoView({ behavior: 'instant' });
      }, 50);
    }
  });
})();

/* ─── REWARD 02 — MEGA DRAW ─────────────────────────────────────────────────
   Three layers:
   1. Editorial entrance — word-split h2, fade-ups, rule sweep (scroll-triggered)
   2. Prize board spotlight — beam sweeps L→R, cards materialise column by
      column, SVG icons draw themselves on (pinned + scrubbed)
   3. Card hover tilt — mouse-driven rotationX/Y on each prize card          ── */
(function reward02Animations() {
  const section = document.querySelector('.mega-draw');
  if (!section) return;

  /* ── 1. Editorial entrance (paused; played on pin onEnter) ─────────── */
  const h2    = section.querySelector('h2');
  const words = h2 ? splitWords(h2) : [];

  /* Set initial hidden states now so elements are invisible on page load  */
  gsap.set('.mega-editorial .reward-index', { opacity: 0, y: 14 });
  if (words.length) gsap.set(words, { y: '105%' });
  gsap.set(['.mega-editorial-meta p', '.mega-entry-strip', '.mega-draw .scroll-trigger'],
           { opacity: 0, y: 16 });
  gsap.set('.mega-rule', { scaleX: 0, transformOrigin: 'left center' });

  const editTl = gsap.timeline({ paused: true });
  editTl
    .to('.mega-editorial .reward-index',
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0)
    .to(words,
        { y: '0%', stagger: 0.045, duration: 0.60, ease: 'power3.out' }, 0.05)
    .to(['.mega-editorial-meta p', '.mega-entry-strip', '.mega-draw .scroll-trigger'],
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.45, ease: 'power2.out' }, 0.26)
    .to('.mega-rule',
        { scaleX: 1, duration: 0.50, ease: 'power2.inOut' }, 0.36);

  /* ── 2. Prize board spotlight (pin + scrub) ────────────────────────── */
  const board = section.querySelector('.mega-prize-board');
  if (!board) return;

  /* Beam injected inside clipping wrapper — stays within grid bounds      */
  const beamWrap = document.createElement('div');
  beamWrap.style.cssText =
    'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:6;border-radius:16px';
  const beam = document.createElement('div');
  beam.className = 'mega-beam';
  beamWrap.appendChild(beam);
  board.appendChild(beamWrap);

  /* DOM card order:
     [0] Bicycle (large)   [1] iPad (gold)   [2] iPhone
     [3] You're In         [4] Laptop (coral) [5] Game console (wide)
     [6] VR goggles (gold)                                                 */
  const allCards = [...board.querySelectorAll('.mega-prize-card')];

  /* Left-to-right column reveal order:
     col 1-2 → col 3 → col 3-4 centre → col 4                            */
  const byColumn = [
    allCards[0],  // Bicycle        (col 1-2, row 1-2)
    allCards[5],  // Game console   (col 1-2, row 3)
    allCards[1],  // iPad           (col 3, row 1)
    allCards[6],  // VR goggles     (col 3, row 3)  ← FIXED (was allCards[5])
    allCards[3],  // You're In      (col 3-4, row 2)
    allCards[2],  // iPhone         (col 4, row 1)
    allCards[4],  // Laptop         (col 4, row 3)
  ].filter(Boolean);

  /* SVG draw-on: measure path lengths WHILE cards are still visible,
     then set full dashoffset so strokes start invisible.
     Store per-card so we can animate each card's paths at the right time. */
  const cardSVGPaths = byColumn.map(card => {
    const paths = [...(card?.querySelectorAll('svg path, svg circle, svg rect') ?? [])];
    paths.forEach(p => {
      try {
        const len = p.getTotalLength();
        if (len > 0) gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      } catch(e) {}
    });
    return paths;
  });

  /* Hide all cards and position beam after SVG setup                      */
  gsap.set(allCards, { autoAlpha: 0, scale: 0.92 });
  gsap.set(beam, { x: () => -board.offsetWidth * 0.28 });

  /* ── Scrubbed spotlight timeline ── */
  const tl = gsap.timeline();

  /* First beam sweep (full width, 0 → 0.65) */
  tl.to(beam, {
    x: () => board.offsetWidth * 1.08,
    ease: 'power1.inOut', duration: 0.65
  }, 0);

  /* Cards materialise column by column as beam passes                     */
  /* Col 1-2 */
  tl.to([byColumn[0], byColumn[1]],
      { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.15, stagger: 0.07 }, 0.04);
  /* Col 3 (iPad + VR) */
  tl.to([byColumn[2], byColumn[3]],
      { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.13, stagger: 0.07 }, 0.24);
  /* You're In (col 3-4 span) */
  tl.to(byColumn[4],
      { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.13 }, 0.33);
  /* Col 4 (iPhone + Laptop) */
  tl.to([byColumn[5], byColumn[6]],
      { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.13, stagger: 0.07 }, 0.43);

  /* YOU'RE IN h3 bounce-in */
  const youreInH3 = board.querySelector('.mega-prize-card.youre-in h3');
  if (youreInH3) {
    gsap.set(youreInH3, { scale: 0 });
    tl.to(youreInH3, { scale: 1, ease: 'back.out(1.7)', duration: 0.16 }, 0.39);
  }

  /* Per-card SVG draw-on — fires right after each card appears:
     byColumn idx  card            reveal t   draw-on t
     0             Bicycle         0.04        0.12
     1             Game console    0.11        0.19
     2             iPad            0.24        0.32
     3             VR goggles      0.31        0.39
     4             You're In       0.33        (no SVG)
     5             iPhone          0.43        0.51
     6             Laptop          0.50        0.58                        */
  const drawOnTimes = [0.12, 0.19, 0.32, 0.39, -1, 0.51, 0.58];
  byColumn.forEach((card, i) => {
    const t     = drawOnTimes[i];
    const paths = cardSVGPaths[i];
    if (t < 0 || !paths.length) return;
    tl.to(paths, {
      strokeDashoffset: 0, ease: 'power2.out', duration: 0.16,
      stagger: { each: 0.04, from: 'start' }
    }, t);
  });

  /* Second shine — quick beam reset + re-sweep after everything is drawn  */
  tl.to(beam, { x: () => -board.offsetWidth * 0.12, duration: 0.04, ease: 'none' }, 0.68)
    .to(beam, {
      x: () => board.offsetWidth * 1.08,
      ease: 'power2.inOut', duration: 0.16
    }, 0.72)
    .to(beam, { autoAlpha: 0, duration: 0.06 }, 0.88);

  /* Pin + scrub — total timeline duration ≈ 0.94
     Editorial plays on onEnter (not in the scrubbed tl) so it always
     animates visibly as the section arrives.                              */
  ScrollTrigger.create({
    trigger:    section,
    start:      'top top',
    end:        '+=160%',
    pin:        true,
    pinSpacing: true,
    scrub:      1.2,
    animation:  tl,
    onEnter:     () => editTl.play(),
    onEnterBack: () => { editTl.progress(1); },  // already complete going back
    onLeaveBack: () => editTl.reverse(),
  });

  /* ── 3. Card hover tilt (always-on, mouse-driven) ──────────────────── */
  allCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width  - 0.5;
      const cy = (e.clientY - r.top)  / r.height - 0.5;
      gsap.to(card, {
        rotationY: cx * 14, rotationX: -cy * 10,
        transformPerspective: 900, ease: 'power2.out',
        duration: 0.35, overwrite: 'auto'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0, rotationX: 0,
        ease: 'power2.out', duration: 0.5, overwrite: 'auto'
      });
    });
  });
})();

/* ─── REWARD 03 — AI CLASS (Diagonal Split) ─────────────────────────────────
   Stage 1 (scrub):  dark panel clip-path expands as user scrolls in
   Stage 2 (timed):  label → heading lines (slow, line-by-line mask) →
                     subheading waits until heading done → CTA pops in
   Stage 3 (timed):  terminal window slides up; each line types character-by-
                     character via clip-path + steps() ease                   ── */
(function reward03Animations() {
  const section   = document.querySelector('.ai-class');
  if (!section) return;

  const darkPanel = section.querySelector('.ai-dark-panel');
  const termWrap  = section.querySelector('.ai-terminal-wrap');
  const termLines = [...section.querySelectorAll('.tl')];

  const copyEl = section.querySelector('.ai-light-panel .section-copy');
  const label  = copyEl?.querySelector('.reward-index');
  const h2     = copyEl?.querySelector('h2');
  const subp   = copyEl?.querySelector('p:not(.reward-index)');
  const cta    = copyEl?.querySelector('.scroll-trigger');

  /* ── 1. Build line-by-line mask split for h2
         "FREE AI CLASS." → two block lines: "FREE AI" + "CLASS."
         Each inner span slides up from y:105% inside an overflow:hidden wrapper.
         margin-bottom on first outer gives the visual breathing room between lines. ── */
  const h2Lines = [];
  if (h2) {
    const lineTexts = ['FREE AI', 'CLASS.'];
    h2.innerHTML = '';
    lineTexts.forEach((text, i) => {
      const outer = document.createElement('span');
      const inner = document.createElement('span');
      outer.style.cssText = 'display:block;overflow:hidden;';
      if (i === 0) outer.style.marginBottom = '0.1em';
      inner.style.display = 'inline-block';
      inner.textContent   = text;
      outer.appendChild(inner);
      h2.appendChild(outer);
      h2Lines.push(inner);
    });
  }

  /* ── 2. Set starting states ── */
  gsap.set(darkPanel, { clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)' });

  if (label)          gsap.set(label,   { autoAlpha: 0, y: 12 });
  if (h2Lines.length) gsap.set(h2Lines, { y: '105%' });
  if (subp)           gsap.set(subp,    { autoAlpha: 0, y: 14 });
  if (cta)            gsap.set(cta,     { autoAlpha: 0, scale: 0.88 });

  gsap.set(termWrap, { autoAlpha: 0, y: 22 });
  // Terminal lines: visible but fully clipped (will type in via steps ease)
  termLines.forEach(l => gsap.set(l, { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' }));

  /* ── 3. Stage 1 (scrub) — dark panel diagonal expands ── */
  const scrubTl = gsap.timeline();
  scrubTl.to(darkPanel, {
    clipPath: 'polygon(0 0, 57% 0, 41% 100%, 0 100%)',
    ease: 'power1.inOut',
    duration: 1,
  });

  /* ── 4. Stage 2 + 3 (timed) — content fires on enter ── */
  const enterTl = gsap.timeline({ paused: true });

  // Heading: 0.14s stagger between lines, 0.9s each — deliberately slow & weighty
  const h2End = 0.08 + (h2Lines.length - 1) * 0.14 + 0.90; // ≈ 1.12s

  enterTl
    .to(label,   { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0)
    .to(h2Lines, { y: '0%', stagger: 0.14, duration: 0.90, ease: 'power3.out' }, 0.08)
    // Subheading waits until heading is fully done (fixed delay after heading, not scroll-linked)
    .to(subp, { autoAlpha: 1, y: 0, duration: 0.48, ease: 'power2.out' }, h2End + 0.22)
    .to(cta,  { autoAlpha: 1, scale: 1, duration: 0.44, ease: 'back.out(1.6)' },  h2End + 0.60);

  // Terminal window slides up alongside the heading
  enterTl.to(termWrap, { autoAlpha: 1, y: 0, duration: 0.52, ease: 'power2.out' }, 0.20);

  // Each line types in sequentially via clip-path + steps ease
  let t = 0.46;
  termLines.forEach(line => {
    const chars = Math.max(6, line.textContent.trim().length);
    const dur   = parseFloat((chars * 0.013).toFixed(3)); // ~13ms per char
    enterTl.to(line, {
      clipPath: `inset(0 0% 0 0)`,
      duration: dur,
      ease:     `steps(${chars})`,
    }, t);
    t += dur + 0.06; // 60ms gap between lines
  });

  /* ── 5. ScrollTrigger: pin + scrub (stage 1) + onEnter (stage 2-3) ── */
  ScrollTrigger.create({
    trigger:    section,
    start:      'top top',
    end:        '+=130%',
    pin:        true,
    pinSpacing: true,
    scrub:      1.1,
    animation:  scrubTl,
    onEnter:     () => enterTl.play(),
    onEnterBack: () => { enterTl.progress(1); },
    onLeaveBack: () => enterTl.reverse(),
  });
})();

/* ─── REWARD 04 — PREMIUM BOOK (Page flip on scroll) ────────────────────────
   Layout: open book with spine + left page (category name + ruled lines) +
           right page (ruled lines). Section pins; 3 curtain-wipe animations
           divide the scroll into 4 chapters: Novel → Comic → Exercise → AI.
   Curtain: a scaleX overlay on the right page that wipes right→left (in)
            then left→right (out), bridging the content switch on the left page.
   Content switch: happens in onUpdate at progress 0.25 / 0.50 / 0.75.       ── */
(function reward04Animations() {
  const section    = document.querySelector('.books');
  if (!section) return;

  const bookWrap   = section.querySelector('.book-wrap');
  const editorial  = section.querySelector('.book-editorial');
  const rewardIdx  = editorial?.querySelector('.reward-index');
  const h2         = editorial?.querySelector('h2');
  const contents   = [...section.querySelectorAll('.bk-content')];
  const dots       = [...section.querySelectorAll('.book-dot')];
  const navLabel   = section.querySelector('.book-nav-label');
  const flipPages  = [...section.querySelectorAll('.book-flip-page')];
  const leftShadow = section.querySelector('.book-page-shadow');
  const bookNav    = section.querySelector('.book-nav');
  const cta        = section.querySelector('.scroll-trigger');

  const catNames  = ['Novel', 'Comic', 'Exercise', 'AI'];
  let   currentIdx = 0;

  /* ── 1. Initial hidden states ── */
  gsap.set(contents,    { autoAlpha: 0 });
  gsap.set(contents[0], { autoAlpha: 1 });          // Novel visible first
  if (rewardIdx)  gsap.set(rewardIdx,  { autoAlpha: 0, y: 14 });
  if (h2)         gsap.set(h2,         { autoAlpha: 0, y: 20 });
  if (bookWrap)   gsap.set(bookWrap,   { autoAlpha: 0, y: 36 });
  if (bookNav)    gsap.set(bookNav,    { autoAlpha: 0, y: 14 });
  if (cta)        gsap.set(cta,        { autoAlpha: 0, y: 14 });
  if (leftShadow) gsap.set(leftShadow, { autoAlpha: 0 });

  /* ── 2. Flip page 3-D setup ──
     Each flip page: perspective applied via GSAP so no parent filter can block it.
     Transform origin at LEFT EDGE = the book's spine / centre.
     Only the FRONT face is visible initially; BACK face is hidden via JS. */
  flipPages.forEach(fp => {
    gsap.set(fp, {
      rotateY:             0,
      transformPerspective: 1200,
      transformOrigin:     'left center',
      zIndex:              1,
    });
    gsap.set(fp.querySelector('.bfp-front'), { autoAlpha: 1 });
    gsap.set(fp.querySelector('.bfp-back'),  { autoAlpha: 0 });
  });

  dots[0].classList.add('active');

  /* ── 3. Content + dot-nav switcher ── */
  function switchPage(idx) {
    if (idx === currentIdx) return;
    gsap.set(contents[currentIdx], { autoAlpha: 0 });
    gsap.set(contents[idx],        { autoAlpha: 1 });
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    if (navLabel) navLabel.textContent = catNames[idx];
    currentIdx = idx;
  }

  /* ── 4. Face-swap (JS backface simulation) ──
     Timeline flip midpoints (progress where rotateY hits -90°, i.e. edge-on):
       Flip 1 mid: 0.19  |  Flip 2 mid: 0.51  |  Flip 3 mid: 0.83
     Before midpoint → show FRONT (page folding away from right).
     After  midpoint → show BACK  (new category content landing on left). */
  const FACE_MIDS   = [0.19, 0.51, 0.83];
  const faceIsBack  = [false, false, false];   // current face state per flip page

  function updateFaces(p) {
    flipPages.forEach((fp, i) => {
      const wantBack = p > FACE_MIDS[i];
      if (faceIsBack[i] === wantBack) return;
      faceIsBack[i] = wantBack;
      gsap.set(fp.querySelector('.bfp-front'), { autoAlpha: wantBack ? 0 : 1 });
      gsap.set(fp.querySelector('.bfp-back'),  { autoAlpha: wantBack ? 1 : 0 });
    });
  }

  /* ── 5. Active-flip z-index ──
     The ACTIVE flip page must be on top so it renders above the idle pages.
     Thresholds: chapter 1 ends at 0.35, chapter 2 ends at 0.67. */
  let activeFlipIdx = -1;
  function updateZIndex(p) {
    const next = p < 0.35 ? 0 : p < 0.67 ? 1 : 2;
    if (next === activeFlipIdx) return;
    activeFlipIdx = next;
    flipPages.forEach((fp, i) => gsap.set(fp, { zIndex: i === next ? 10 : 1 }));
  }

  /* ── 6. Entrance timeline ── */
  const enterTl = gsap.timeline({ paused: true });
  const h2Words = h2 ? splitWords(h2) : [];
  if (h2Words.length) gsap.set(h2Words, { y: '105%' });

  enterTl
    .to(rewardIdx, { autoAlpha: 1, y: 0, duration: 0.40, ease: 'power2.out' }, 0)
    .to(h2,        { autoAlpha: 1, y: 0, duration: 0.01 },                     0)
    .to(h2Words,   { y: '0%', stagger: 0.07, duration: 0.70, ease: 'power3.out' }, 0.08)
    .to(bookWrap,  { autoAlpha: 1, y: 0, duration: 0.80, ease: 'power3.out' },  0.18)
    .to(bookNav,   { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },  0.48)
    .to(cta,       { autoAlpha: 1, y: 0, duration: 0.40, ease: 'power2.out' },  0.58);

  /* ── 7. Scrubbed flip timeline ──
     Each flip: rotateY 0 → -180 with power2.inOut (slow-fast-slow, like a real
     page being picked up, swinging past spine, then landing).
     Shadow on left page peaks at each midpoint.

     Timeline positions:
       Flip 1 (Novel → Comic)    : t = 0.08 → 0.30  (mid 0.19)
       Flip 2 (Comic → Exercise) : t = 0.40 → 0.62  (mid 0.51)
       Flip 3 (Exercise → AI)    : t = 0.72 → 0.94  (mid 0.83)
       Dwell at end              : 0.94 → 1.00                  */
  const flipTl = gsap.timeline();

  flipPages.forEach((fp, i) => {
    const t   = [0.08, 0.40, 0.72][i];
    const mid = FACE_MIDS[i];

    // Page rotation: 0° → -180° (pivot at spine, left edge of right page)
    flipTl.to(fp, { rotateY: -180, ease: 'power2.inOut', duration: 0.22 }, t);

    // Shadow on left page rises then falls as the page sweeps over it
    if (leftShadow) {
      flipTl.to(leftShadow, { autoAlpha: 0.22, ease: 'power1.in',  duration: 0.11 }, t);
      flipTl.to(leftShadow, { autoAlpha: 0,    ease: 'power1.out', duration: 0.11 }, mid);
    }
  });

  flipTl.to({}, { duration: 0.06 }, 0.94);   // pad to 1.0

  /* ── 8. ScrollTrigger: pin + scrub + all onUpdate logic ── */
  ScrollTrigger.create({
    trigger:    section,
    start:      'top top',
    end:        '+=350%',
    pin:        true,
    pinSpacing: true,
    scrub:      1.2,
    animation:  flipTl,
    onEnter:     () => enterTl.play(),
    onEnterBack: () => { enterTl.progress(1); },
    onLeaveBack: () => enterTl.reverse(),
    onUpdate:   self => {
      const p = self.progress;

      // Dot nav: switch at each flip midpoint
      const idx = p < 0.19 ? 0 : p < 0.51 ? 1 : p < 0.83 ? 2 : 3;
      switchPage(idx);

      // Face visibility and active z-index
      updateFaces(p);
      updateZIndex(p);
    },
  });
})();

/* ─── REWARD STACK SECTION ──────────────────────────────────────────────────
   Phase A (on enter, before pin): editorial entrance
   Phase B (pin + scrub, +=560%):
     0-9.2s  — cards deal in one by one, spotlight shifts, note pops in
     9.2-11.5s — rest (user sees full spread)
     11.5-17.7s — collapse: cards 4→3→2 glide to card 1 position sequentially
     17.7-22.7s — 5s buffer so scrub lag (1.8s) fully resolves before pin ends
   NO gsap.set, NO zIndex, NO onLeave force-complete — only x/y/scale/autoAlpha
   ── */
(function stackSectionAnimations() {
  const section = document.querySelector('.stack-section');
  if (!section) return;

  const eyebrow = section.querySelector('.eyebrow');
  const h2      = section.querySelector('h2');
  const subp    = section.querySelector('.stack-copy p:not(.eyebrow)');
  const cta     = section.querySelector('.scroll-trigger');
  const cards   = [...section.querySelectorAll('.stack-card')];
  const note    = section.querySelector('.stack-note');
  const orbit   = section.querySelector('.stack-orbit');

  /* ── 1. h2 word-mask split ── */
  const h2Words = [];
  if (h2) {
    const words = h2.textContent.trim().split(/\s+/);
    h2.innerHTML = '';
    words.forEach(w => {
      const outer = document.createElement('span');
      const inner = document.createElement('span');
      outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
      inner.style.cssText = 'display:inline-block;transform:translateY(110%);';
      inner.textContent   = w;
      outer.appendChild(inner);
      h2.appendChild(outer);
      h2.appendChild(document.createTextNode(' '));
      h2Words.push(inner);
    });
    gsap.set(h2, { autoAlpha: 1 });
  }

  /* ── 2. Initial hidden states ── */
  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, y: 20 });
  if (subp)    gsap.set(subp,    { autoAlpha: 0, y: 16 });
  if (cta)     gsap.set(cta,     { autoAlpha: 0, y: 14 });
  if (note)    gsap.set(note,    { autoAlpha: 0, y: 18 });
  if (orbit)   gsap.set(orbit,   { autoAlpha: 0, rotation: -12 });

  /* ── Measure natural card positions BEFORE any transforms are applied ──
     Cards are position:relative in flow, so offsetTop gives real distance
     from card 1. Collapse animation uses these to travel exactly the right
     amount regardless of card height or viewport size.
  ── */
  const card1Top = cards[0].offsetTop;
  const collapseY = cards.map(c => -(c.offsetTop - card1Top));
  const collapseX = cards.map(c => -(parseFloat(getComputedStyle(c).marginLeft) || 0));

  gsap.set(cards, { autoAlpha: 0, x: 90 });

  /* ── 3. Editorial entrance timeline (played on enter, before pin) ── */
  const editTl = gsap.timeline({ paused: true });

  if (eyebrow)    editTl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 0);
  if (h2Words.length) {
    editTl.to(h2Words, { y: '0%', stagger: 0.055, duration: 0.6, ease: 'power3.out' }, 0.1);
  }
  const h2End = 0.1 + (h2Words.length - 1) * 0.055 + 0.6;
  if (subp) editTl.to(subp, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power2.out' }, h2End + 0.08);
  if (cta)  editTl.to(cta,  { autoAlpha: 1, y: 0, duration: 0.34, ease: 'back.out(1.7)' }, h2End + 0.22);

  /* ── 4. Card deal + collapse scrub timeline ── */
  const dealTl = gsap.timeline();

  /* Orbit rotates in and keeps spinning through the full 22.7s range */
  if (orbit) {
    dealTl
      .to(orbit, { autoAlpha: 0.7, duration: 1.0, ease: 'power1.out' }, 0)
      .to(orbit, { rotation: 90, duration: 18.2, ease: 'none' }, 0);
  }

  /* ── PHASE A: Deal cards in one by one ── */
  const dealStart = [0.4, 2.4, 4.4, 6.4];
  cards.forEach((card, i) => {
    const t = dealStart[i];

    /* Card flies in from the right */
    dealTl.to(card, {
      autoAlpha: 1, x: 0,
      duration: 1.1, ease: 'back.out(1.5)',
    }, t);

    /* Spotlight: scale up + active class */
    dealTl.to(card, {
      scale: 1.028,
      duration: 0.5, ease: 'power2.out',
      onStart() { card.classList.add('is-active'); },
    }, t + 0.6);

    /* Dim the previous card as spotlight shifts */
    if (i > 0) {
      const prev = cards[i - 1];
      dealTl.to(prev, {
        opacity: 0.45, scale: 1,
        duration: 0.5, ease: 'power1.out',
        onStart() { prev.classList.remove('is-active'); },
      }, t + 0.6);
    }
  });

  /* All cards normalize + stack-note pops in (~t=8.2) */
  dealTl
    .to(cards, {
      opacity: 1, scale: 1,
      duration: 0.7, ease: 'power1.out',
      onStart() { cards.forEach(c => c.classList.remove('is-active')); },
    }, 8.2)
    .to(note, {
      autoAlpha: 1, y: 0,
      duration: 0.55, ease: 'back.out(1.6)',
    }, 8.6);

  /* ── PHASE B: Collapse — cards stack back to card 1 one by one ──
     Cards are position:relative in normal flow (vertical list like the reference).
     collapseY/collapseX were measured from actual offsetTop/marginLeft before
     any transforms were applied, so they're exact regardless of card height.
     Rest: 9.15 → 10.0 (1s — user sees all 4 cards fully revealed)
     Card 4 leads (most travel), then 3, then 2 — staggered 1.2s apart.
  ── */

  /* Note fades out smoothly as collapse begins */
  dealTl.to(note, { autoAlpha: 0, y: -8, duration: 0.9, ease: 'power1.inOut' }, 10.0);

  /* Card 4: most travel, leads first */
  dealTl.to(cards[3], {
    x: collapseX[3], y: collapseY[3], scale: 0.96,
    duration: 2.4, ease: 'power3.inOut',
  }, 10.5);

  /* Card 3: starts 1.2s after card 4 */
  dealTl.to(cards[2], {
    x: collapseX[2], y: collapseY[2], scale: 0.97,
    duration: 2.2, ease: 'power3.inOut',
  }, 11.7);

  /* Card 2: starts 1.2s after card 3 */
  dealTl.to(cards[1], {
    x: collapseX[1], y: collapseY[1], scale: 0.98,
    duration: 2.0, ease: 'power3.inOut',
  }, 12.9);

  /* Deck settles — card 1 gets a gentle pulse */
  dealTl
    .to(cards[0], { scale: 1.025, duration: 0.4, ease: 'power2.out' }, 15.3)
    .to(cards[0], { scale: 1.0,   duration: 0.5, ease: 'power2.in'  }, 15.7);

  /* 2s scrub-lag buffer (down from 5s) — scrub:1.8 still catches up in time */
  dealTl.to({}, { duration: 2 }, 16.2);

  /* ── 5. Pin + scrub ScrollTrigger ──
     420% pin (down from 560%) — tighter now that rest + buffer are shorter.
     NO onLeave: the 2s buffer absorbs the 1.8s scrub lag naturally.
  ── */
  ScrollTrigger.create({
    trigger:     section,
    start:       'top top',
    end:         '+=420%',
    pin:         true,
    pinSpacing:  true,
    scrub:       1.8,
    animation:   dealTl,
    onEnter:     () => editTl.play(),
    onEnterBack: () => editTl.progress(1),
    onLeaveBack: () => editTl.reverse(),
  });
})();

/* ─── AI UPGRADE SECTION ────────────────────────────────────────────────────
   Left side:
   1. Eyebrow underline sweeps in (scaleX 0→1) then text fades up
   2. h2 word-mask reveal — each word slides up from overflow clip, staggered
   3. Subheading fades after h2 completes
   4. Ticker card bounces up with back.out overshoot
   5. Scramble loop auto-cycles every 2.4s

   Right side (bonus card):
   6. Card slides in from right preserving rotation + skew (GSAP owns transform)
   7. After entrance: subtle infinite float y ±6px
   8. Ribbon gold shimmer sweeps on a 3s loop
   9. Gift tags stagger pop in with back.out
   10. Hover: card straightens slightly on mouseenter, returns on mouseleave
   ── */
(function aiUpgradeAnimations() {
  const section    = document.querySelector('.ai-upgrade');
  if (!section) return;

  const eyebrow    = section.querySelector('.eyebrow');
  const h2         = section.querySelector('h2');
  const subp       = section.querySelector('.spotlight-copy > p');
  const ticker     = section.querySelector('.ai-outcome-ticker');
  const scramble   = section.querySelector('#tickerScramble');
  const bonus      = section.querySelector('.bonus-strip');
  const shine      = section.querySelector('.ribbon-shine');
  const giftTags   = [...section.querySelectorAll('.bonus-gift-row span')];

  /* ── Scramble config ── */
  const labels  = ['STUDY FASTER', 'CREATE SMARTER', 'FUTURE READY'];
  const CHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let currentIdx = 0;
  let loopTimer  = null;
  let running    = false;

  function scrambleText(el, target) {
    const totalFrames = 20;
    let frame = 0;
    const iv = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        clearInterval(iv);
        el.textContent = target;
        return;
      }
      const reveal = frame > totalFrames * 0.55
        ? Math.floor((frame - totalFrames * 0.55) / (totalFrames * 0.45) * target.length)
        : 0;
      el.textContent =
        target.slice(0, reveal) +
        Array.from({ length: target.length - reveal }, (_, i) =>
          target[reveal + i] === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('');
    }, 48);
  }

  function cycle() {
    currentIdx = (currentIdx + 1) % labels.length;
    /* flash the ticker card briefly */
    gsap.fromTo(ticker, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    scrambleText(scramble, labels[currentIdx]);
  }

  function startLoop() {
    if (running) return;
    running = true;
    loopTimer = setInterval(cycle, 2400);
  }
  function stopLoop() {
    running = false;
    clearInterval(loopTimer);
  }

  /* ── 1. Word-mask split on h2 ── */
  const h2Words = [];
  if (h2) {
    const words = h2.textContent.trim().split(/\s+/);
    h2.innerHTML = '';
    words.forEach(w => {
      const outer = document.createElement('span');
      const inner = document.createElement('span');
      outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
      inner.style.cssText = 'display:inline-block;transform:translateY(110%);';
      inner.textContent   = w;
      outer.appendChild(inner);
      h2.appendChild(outer);
      h2.appendChild(document.createTextNode(' '));
      h2Words.push(inner);
    });
    gsap.set(h2, { autoAlpha: 1 });
  }

  /* ── 2. Initial hidden states ── */
  if (eyebrow)  gsap.set(eyebrow,  { autoAlpha: 0, y: 20 });
  if (subp)     gsap.set(subp,     { autoAlpha: 0, y: 18 });
  if (ticker)   gsap.set(ticker,   { autoAlpha: 0, y: 36 });
  if (bonus)    gsap.set(bonus,    { autoAlpha: 0, x: 70, rotation: 4, skewY: 2, transformOrigin: 'center center' });
  if (giftTags.length) gsap.set(giftTags, { autoAlpha: 0, scale: 0.72, transformOrigin: 'center center' });

  /* ── 3. Entrance timeline ── */
  const enterTl = gsap.timeline({
    paused: true,
    onComplete: () => {
      startLoop();
      startFloat();
      startRibbonShimmer();
    }
  });

  /* Eyebrow */
  if (eyebrow) enterTl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0);

  /* h2 word cascade */
  if (h2Words.length) {
    enterTl.to(h2Words, {
      y: '0%',
      stagger: 0.07,
      duration: 0.65,
      ease: 'power3.out',
    }, 0.14);
  }

  /* Subheading — waits until words finish */
  const h2End = 0.14 + (h2Words.length - 1) * 0.07 + 0.65;
  if (subp) enterTl.to(subp, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out' }, h2End + 0.12);

  /* Ticker card */
  if (ticker) enterTl.to(ticker, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'back.out(1.8)' }, h2End + 0.04);

  /* Bonus card — slides in from right keeping rotation */
  if (bonus) {
    enterTl.to(bonus, {
      autoAlpha: 1, x: 0,
      duration: 0.70, ease: 'back.out(1.5)',
    }, 0.30);
  }

  /* Gift tags stagger pop */
  if (giftTags.length) {
    enterTl.to(giftTags, {
      autoAlpha: 1, scale: 1,
      stagger: 0.07,
      duration: 0.38,
      ease: 'back.out(2)',
    }, 0.72);
  }

  /* ── 4. Infinite float on bonus card ── */
  let floatTween = null;
  function startFloat() {
    if (!bonus || floatTween) return;
    floatTween = gsap.to(bonus, {
      y: -7,
      duration: 2.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  /* ── 5. Ribbon shimmer loop ── */
  function startRibbonShimmer() {
    if (!shine) return;
    gsap.set(shine, { x: '-100%' });
    gsap.to(shine, {
      x: '200%',
      duration: 0.6,
      ease: 'power1.inOut',
      repeat: -1,
      repeatDelay: 2.4,
    });
  }

  /* ── 6. Hover: card tilts back slightly, float pauses ── */
  if (bonus) {
    bonus.addEventListener('mouseenter', () => {
      if (floatTween) floatTween.pause();
      gsap.to(bonus, { rotation: 1, skewY: 0.5, y: -10, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
    });
    bonus.addEventListener('mouseleave', () => {
      gsap.to(bonus, { rotation: 4, skewY: 2, y: 0, duration: 0.55, ease: 'power2.out', overwrite: 'auto',
        onComplete: () => { if (floatTween) floatTween.resume(); }
      });
    });
  }

  /* ── 7. ScrollTrigger — entrance ── */
  ScrollTrigger.create({
    trigger: section,
    start:   'top 72%',
    once:    true,
    onEnter: () => enterTl.play(),
  });

  /* ── 8. Pause loop when section is off-screen ── */
  ScrollTrigger.create({
    trigger:     section,
    start:       'top bottom',
    end:         'bottom top',
    onLeave:     stopLoop,
    onLeaveBack: stopLoop,
    onEnter:     () => { if (!running && enterTl.progress() === 1) startLoop(); },
    onEnterBack: () => { if (!running && enterTl.progress() === 1) startLoop(); },
  });
})();

/* ─── COMBO PICKER SECTION ───────────────────────────────────────────────────
   Entrance (once, top 68%):
   1. Eyebrow fade up
   2. H2 word-mask cascade
   3. Subp fades after h2
   4. Form buttons stagger in left→right, back.out pop
   5. Combo shell scales in (0.96→1) with back.out

   Interactions:
   6. Form button click → old dips, new pops (back.out), shell breathes
   7. Carousel cards wipe in from x:28 via MutationObserver on #comboCarousel
   8. View-all arrow rotates 45° on hover
── */
(function comboPickerAnimations() {
  const section      = document.querySelector('.combo-picker');
  if (!section) return;

  const eyebrow      = section.querySelector('.eyebrow');
  const h2           = section.querySelector('h2');
  const subp         = section.querySelector('.center-copy p:not(.eyebrow)');
  const formBtns     = [...section.querySelectorAll('.form-btn')];
  const comboShell   = section.querySelector('.combo-shell');
  const carousel     = document.querySelector('#comboCarousel');
  const viewAllBtn   = section.querySelector('.view-all-btn');
  const viewAllArrow = section.querySelector('.view-all-btn-circle');

  /* ── 1. H2 word-mask split ── */
  const h2Words = [];
  if (h2) {
    const words = h2.textContent.trim().split(/\s+/);
    h2.innerHTML = '';
    words.forEach(w => {
      const outer = document.createElement('span');
      const inner = document.createElement('span');
      outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
      inner.style.cssText = 'display:inline-block;transform:translateY(110%);';
      inner.textContent   = w;
      outer.appendChild(inner);
      h2.appendChild(outer);
      h2.appendChild(document.createTextNode(' '));
      h2Words.push(inner);
    });
    gsap.set(h2, { autoAlpha: 1 });
  }

  /* ── 2. Initial hidden states ── */
  if (eyebrow)    gsap.set(eyebrow,    { autoAlpha: 0, y: 18 });
  if (subp)       gsap.set(subp,       { autoAlpha: 0, y: 14 });
  if (formBtns.length) gsap.set(formBtns, { autoAlpha: 0, y: 24 });
  if (comboShell) gsap.set(comboShell, { autoAlpha: 0, scale: 0.96 });

  /* ── 3. Entrance timeline ── */
  const enterTl = gsap.timeline({ paused: true });

  if (eyebrow) enterTl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power2.out' }, 0);

  if (h2Words.length) {
    enterTl.to(h2Words, {
      y: '0%', stagger: 0.055, duration: 0.6, ease: 'power3.out',
    }, 0.1);
  }

  const h2End = 0.1 + (h2Words.length - 1) * 0.055 + 0.6;

  if (subp) enterTl.to(subp, { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power2.out' }, h2End + 0.06);

  /* Form buttons stagger in left → right */
  if (formBtns.length) {
    enterTl.to(formBtns, {
      autoAlpha: 1, y: 0,
      stagger: 0.07, duration: 0.44, ease: 'back.out(1.7)',
    }, h2End + 0.18);
  }

  /* Combo shell snaps in */
  if (comboShell) {
    enterTl.to(comboShell, {
      autoAlpha: 1, scale: 1,
      duration: 0.55, ease: 'back.out(1.3)',
    }, h2End + 0.52);
  }

  /* ── 4. ScrollTrigger ── */
  let hasEntered = false;
  ScrollTrigger.create({
    trigger: section,
    start:   'top 68%',
    once:    true,
    onEnter: () => { enterTl.play(); hasEntered = true; },
  });

  /* ── 5. Form button click: old dips, new pops, shell breathes ── */
  let prevActiveBtn = formBtns.find(b => b.classList.contains('active')) || formBtns[0];

  formBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn === prevActiveBtn) return;

      /* Old button: quick dip */
      gsap.to(prevActiveBtn, {
        scale: 0.93, duration: 0.12, ease: 'power2.in',
        onComplete: () =>
          gsap.to(prevActiveBtn, { scale: 1, duration: 0.22, ease: 'power2.out' }),
      });

      /* New button: spring pop */
      gsap.fromTo(btn,
        { scale: 0.91 },
        { scale: 1, duration: 0.42, ease: 'back.out(2.2)', overwrite: 'auto' }
      );

      /* Shell: quick breath signals content change */
      if (comboShell) {
        gsap.to(comboShell, {
          scale: 0.985, autoAlpha: 0.7, duration: 0.1, ease: 'power2.in',
          onComplete: () =>
            gsap.to(comboShell, { scale: 1, autoAlpha: 1, duration: 0.32, ease: 'power2.out' }),
        });
      }

      prevActiveBtn = btn;
    });
  });

  /* ── 6. Carousel cards wipe in when carousel DOM is rebuilt ──
     MutationObserver fires after renderCombos() repopulates #comboCarousel.
     Guard with hasEntered so the initial page-load render isn't animated.
  ── */
  if (carousel) {
    const observer = new MutationObserver(() => {
      if (!hasEntered) return;
      const cards = [...carousel.querySelectorAll('.combo-card')];
      if (!cards.length) return;
      gsap.from(cards, {
        autoAlpha: 0, x: 28,
        stagger:   0.06,
        duration:  0.38,
        ease:      'power2.out',
        immediateRender: false,
      });
    });
    observer.observe(carousel, { childList: true });
  }

  /* ── 7. View-all button: arrow spins on hover ── */
  if (viewAllBtn && viewAllArrow) {
    viewAllBtn.addEventListener('mouseenter', () =>
      gsap.to(viewAllArrow, { rotation: 45, x: 4, duration: 0.25, ease: 'power2.out' })
    );
    viewAllBtn.addEventListener('mouseleave', () =>
      gsap.to(viewAllArrow, { rotation: 0, x: 0, duration: 0.32, ease: 'back.out(1.6)' })
    );
  }
})();

/* ─── FINAL CTA – B3 "Thin + Fat" ─────────────────────────────────────────── */
(function finalCtaAnimations() {
  const section  = document.querySelector('.final-cta');
  if (!section) return;

  const card     = section.querySelector('#finalCard');
  const claimInners = [...section.querySelectorAll('.fcw-inner')];
  const four     = section.querySelector('#finalFour');
  const rule     = section.querySelector('#finalRule');
  const rewards  = section.querySelector('#finalRewards');
  const sub      = section.querySelector('#finalSub');
  const deadline = section.querySelector('#finalDeadline');

  const masks = ['#fmask1','#fmask2','#fmask3','#fmask4'].map(id => section.querySelector(id));

  const s1Text = section.querySelector('.s1-text');
  const s2Mega = section.querySelector('.s2-mega');
  const s2Draw = section.querySelector('.s2-draw');
  const s3Text = section.querySelector('.s3-text');
  const s4Your = section.querySelector('.s4-your');
  const s4Books = section.querySelector('.s4-books');

  /* ── Initial states ── */
  claimInners.forEach(el => gsap.set(el, { y: '112%' }));
  gsap.set(card, { autoAlpha: 0 });
  gsap.set(four, { scale: 0.6, autoAlpha: 0 });
  gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set([rewards, sub, deadline], { autoAlpha: 0, y: 10 });
  gsap.set([s1Text, s2Mega, s2Draw, s3Text, s4Your, s4Books], { autoAlpha: 0, y: 8 });
  // masks sit at x:0 by default → covering their clip-path regions

  /* ── Entrance timeline ── */
  const tl = gsap.timeline({ paused: true });

  // Left col: CLAIM (t=0) then YOUR (t=0.12)
  tl.to(claimInners[0], { y: '0%', duration: 0.65, ease: 'power3.out' }, 0);
  tl.to(claimInners[1], { y: '0%', duration: 0.65, ease: 'power3.out' }, 0.12);

  // Right col: "4" springs in, rule draws, REWARDS fades
  tl.to(four,    { scale: 1, autoAlpha: 1, duration: 0.78, ease: 'back.out(2.5)' }, 0.05);
  tl.to(rule,    { scaleX: 1, duration: 0.5, ease: 'power3.out' }, 0.44);
  tl.to(rewards, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.6);

  // Card frame fades in just before strips wipe
  tl.to(card, { autoAlpha: 1, duration: 0.28, ease: 'none' }, 0.28);

  // Strip 1 – dark – wipes ← (mask slides left)
  tl.to(masks[0], { x: '-105%', duration: 0.70, ease: 'power2.inOut' }, 0.38);
  tl.to(s1Text,   { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power2.out' }, 0.90);

  // Strip 2 – cream – wipes → (mask slides right)
  tl.to(masks[1], { x: '105%',  duration: 0.78, ease: 'power2.inOut' }, 0.56);
  tl.to(s2Mega,   { autoAlpha: 1, y: 0, duration: 0.44, ease: 'power2.out' }, 1.10);
  tl.to(s2Draw,   { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power2.out' }, 1.24);

  // Strip 3 – dark – wipes ←
  tl.to(masks[2], { x: '-105%', duration: 0.72, ease: 'power2.inOut' }, 0.74);
  tl.to(s3Text,   { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power2.out' }, 1.26);

  // Strip 4 – cream – wipes →
  tl.to(masks[3], { x: '105%',  duration: 0.82, ease: 'power2.inOut' }, 0.92);
  tl.to(s4Your,   { autoAlpha: 1, y: 0, duration: 0.48, ease: 'power2.out' }, 1.48);
  tl.to(s4Books,  { autoAlpha: 1, y: 0, duration: 0.44, ease: 'power2.out' }, 1.62);

  // Subheading + deadline
  tl.to(sub,      { autoAlpha: 1, y: 0, duration: 0.46, ease: 'power2.out' }, 1.12);
  tl.to(deadline, { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 1.28);

  /* ── ScrollTrigger: fire when card top crosses 55% of viewport ── */
  ScrollTrigger.create({
    trigger: section,
    start:   'top 55%',
    once:    true,
    onEnter: () => tl.play(),
  });

  /* ── Card hover: gentle lift ── */
  card.addEventListener('mouseenter', () =>
    gsap.to(card, { y: -5, scale: 1.012, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
  );
  card.addEventListener('mouseleave', () =>
    gsap.to(card, { y: 0, scale: 1, duration: 0.45, ease: 'power2.inOut', overwrite: 'auto' })
  );

  /* ── Strip hover: bg brightness ── */
  ['s1','s2','s3','s4'].forEach(cls => {
    const strip  = section.querySelector('.' + cls);
    if (!strip) return;
    const bg     = strip.querySelector('.fstrip-bg');
    const isLight = strip.classList.contains('fstrip-lt');
    strip.addEventListener('mouseenter', () =>
      gsap.to(bg, { filter: isLight ? 'brightness(1.05)' : 'brightness(1.22)', duration: 0.22 })
    );
    strip.addEventListener('mouseleave', () =>
      gsap.to(bg, { filter: 'brightness(1)', duration: 0.28 })
    );
  });
})();
