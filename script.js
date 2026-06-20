// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  if (next === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  localStorage.setItem('theme', next);
});

// Mobile nav
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.querySelector('.main-nav');

navToggle?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// Equation in-view trigger
const equationBlock = document.getElementById('equation-block');
if (equationBlock) {
  const eqObserver = new IntersectionObserver(
    ([entry]) => equationBlock.classList.toggle('in-view', entry.isIntersecting),
    { threshold: 0.3 }
  );
  eqObserver.observe(equationBlock);
}

// Chloroplast diagram tooltips
(function initChlTooltips() {
  const diagram = document.getElementById('chl-diagram');
  const tooltip = document.getElementById('chl-tooltip');
  const wrap = document.querySelector('.chl-diagram-wrap');
  if (!diagram || !tooltip || !wrap) return;

  diagram.querySelectorAll('.chl-part').forEach(part => {
    part.addEventListener('mouseenter', e => {
      const label = part.dataset.label;
      const desc = part.dataset.desc;
      if (!label) return;
      tooltip.innerHTML = `<strong>${label}</strong>${desc || ''}`;
      tooltip.hidden = false;
      part.classList.add('active');
    });
    part.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      tooltip.style.left = `${e.clientX - rect.left}px`;
      tooltip.style.top = `${e.clientY - rect.top}px`;
    });
    part.addEventListener('mouseleave', () => {
      tooltip.hidden = true;
      part.classList.remove('active');
    });
  });
})();

// Photosynthesis rate simulator
function calcRate(light, co2, temp, water) {
  const lightFactor = Math.min(light / 80, 1);
  const co2Factor = Math.min(co2 / 70, 1);
  const waterFactor = water / 100;

  let tempFactor;
  if (temp < 5) tempFactor = temp / 20;
  else if (temp <= 30) tempFactor = 0.5 + (temp - 5) / 50;
  else if (temp <= 38) tempFactor = 1 - (temp - 30) / 20;
  else tempFactor = Math.max(0, 0.6 - (temp - 38) / 30);

  return Math.round(lightFactor * co2Factor * tempFactor * waterFactor * 100);
}

function updateSimulator() {
  const light = +document.getElementById('light').value;
  const co2 = +document.getElementById('co2').value;
  const temp = +document.getElementById('temp').value;
  const water = +document.getElementById('water').value;

  const rate = calcRate(light, co2, temp, water);
  const fill = document.getElementById('meter-fill');
  const value = document.getElementById('meter-value');
  const status = document.getElementById('sim-status');
  const badge = document.getElementById('sim-badge');

  fill.style.width = `${rate}%`;
  value.textContent = `${rate}%`;

  // Light → sun size & ray opacity
  const sunGroup = document.getElementById('sim-sun-group');
  const sunRays = document.getElementById('sim-sun-rays');
  const sunScale = 0.4 + (light / 100) * 0.8;
  if (sunGroup) sunGroup.setAttribute('transform', `translate(252, 48) scale(${sunScale})`);
  if (sunRays) sunRays.style.opacity = 0.2 + (light / 100) * 0.8;

  // CO2 → smog density (low CO2 = thin haze, high = thick smog)
  const smog = document.getElementById('sim-smog');
  if (smog) smog.setAttribute('opacity', Math.min(0.85, 0.1 + (co2 / 100) * 0.75));

  // Temperature → heat/cold overlay
  const heat = document.getElementById('sim-heat');
  const cold = document.getElementById('sim-cold');
  if (heat) heat.setAttribute('opacity', temp > 32 ? Math.min(0.35, (temp - 32) / 25) : 0);
  if (cold) cold.setAttribute('opacity', temp < 10 ? Math.min(0.4, (10 - temp) / 15) : 0);

  // Water → puddle size, rain, cracks
  const waterEl = document.getElementById('sim-water');
  const rain = document.getElementById('sim-rain');
  const cracks = document.getElementById('sim-cracks');
  if (waterEl) {
    waterEl.setAttribute('rx', 18 + (water / 100) * 62);
    waterEl.setAttribute('opacity', 0.25 + (water / 100) * 0.75);
  }
  if (rain) rain.setAttribute('opacity', water > 60 ? Math.min(0.9, (water - 60) / 50) : 0);
  if (cracks) cracks.setAttribute('opacity', water < 25 ? Math.min(1, (25 - water) / 25) : 0);

  // Plant state
  const plantGroup = document.getElementById('sim-plant-group');
  const leafL = document.getElementById('sim-leaf-l');
  const leafR = document.getElementById('sim-leaf-r');
  const leafTop = document.getElementById('sim-leaf-top');
  const allLeaves = document.querySelectorAll('.sim-leaf');
  const stem = document.getElementById('sim-stem');
  const flower = document.getElementById('sim-flower');
  const dead = document.getElementById('sim-dead');
  const glow = document.getElementById('sim-glow');

  const isDead = rate < 12 || light < 8 || water < 8 || (temp < 3) || (temp > 45);
  const isProsper = rate >= 82 && light >= 60 && co2 >= 50 && water >= 60 && temp >= 18 && temp <= 32;

  let scale = 0.7 + (rate / 100) * 0.6;
  let leafColor = '#4a9f3f';
  let stemColor = '#3d7a37';

  if (isDead) {
    scale = 0.55;
    leafColor = '#8B7355';
    stemColor = '#6B5344';
    if (flower) flower.setAttribute('opacity', 0);
    if (dead) dead.setAttribute('opacity', 1);
    if (glow) glow.setAttribute('opacity', 0);
    if (badge) {
      badge.hidden = false;
      badge.textContent = '⚠ Plant dying';
      badge.className = 'sim-badge dead';
    }
    status.textContent = 'Critical stress — the plant cannot photosynthesize and is dying.';
  } else if (isProsper) {
    scale = 1.35;
    leafColor = '#2d8a25';
    stemColor = '#1a5c15';
    if (flower) flower.setAttribute('opacity', 1);
    if (dead) dead.setAttribute('opacity', 0);
    if (glow) glow.setAttribute('opacity', 0.15);
    if (badge) {
      badge.hidden = false;
      badge.textContent = '✦ Thriving';
      badge.className = 'sim-badge prosper';
    }
    status.textContent = 'Optimal conditions — the plant is prospering at peak photosynthesis.';
  } else {
    if (flower) flower.setAttribute('opacity', 0);
    if (dead) dead.setAttribute('opacity', 0);
    if (glow) glow.setAttribute('opacity', 0);
    if (badge) badge.hidden = true;
    if (rate >= 70) {
      status.textContent = 'Good conditions — photosynthesis is running efficiently.';
    } else if (rate >= 40) {
      status.textContent = 'Moderate rate — one or more factors may be limiting growth.';
      leafColor = '#7a9f3a';
    } else if (rate >= 15) {
      status.textContent = 'Low rate — stress conditions are slowing photosynthesis.';
      leafColor = '#a08030';
    } else {
      status.textContent = 'Very low rate — the plant is barely photosynthesizing.';
      leafColor = '#a07030';
    }
  }

  if (plantGroup) plantGroup.setAttribute('transform', `translate(160, 222) scale(${scale})`);
  allLeaves.forEach(el => el.setAttribute('fill', leafColor));
  if (stem) stem.setAttribute('stroke', stemColor);

  // Wilt when stressed
  const wilt = rate < 30 && !isDead ? 0.15 : 0;
  if (leafL) leafL.setAttribute('transform', `rotate(${-wilt * 15})`);
  if (leafR) leafR.setAttribute('transform', `rotate(${wilt * 15})`);
}

['light', 'co2', 'temp', 'water'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', updateSimulator);
});
updateSimulator();

// Quiz
const questions = document.querySelectorAll('.quiz-question');
const feedback = document.getElementById('quiz-feedback');
const prevBtn = document.getElementById('quiz-prev');
const nextBtn = document.getElementById('quiz-next');
const progress = document.getElementById('quiz-progress');
const quizEl = document.getElementById('quiz');
const celebration = document.getElementById('quiz-celebration');
const celebrationScore = document.getElementById('celebration-score');
const celebrationTitle = document.getElementById('celebration-title');
const celebrationEmoji = document.getElementById('celebration-emoji');
let currentQ = 0;
const answers = new Array(questions.length).fill(null);

function showQuestion(index) {
  questions.forEach((q, i) => q.classList.toggle('active', i === index));
  progress.textContent = `${index + 1} / ${questions.length}`;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = answers[index] === null;
  nextBtn.textContent = index === questions.length - 1 ? 'Finish' : 'Next';

  feedback.hidden = true;
  const q = questions[index];
  q.querySelectorAll('.q-option').forEach(btn => {
    btn.disabled = answers[index] !== null;
    btn.classList.remove('correct', 'wrong');
    if (answers[index] !== null) {
      if (btn.dataset.correct !== undefined) btn.classList.add('correct');
      else if (btn === answers[index]) btn.classList.add('wrong');
    }
  });

  if (answers[index] !== null) {
    const selected = answers[index];
    const isCorrect = selected.dataset.correct !== undefined;
    feedback.hidden = false;
    feedback.textContent = isCorrect
      ? 'Correct.'
      : 'Not quite — review the sections above.';
  }
}

questions.forEach((q, qi) => {
  q.querySelectorAll('.q-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answers[qi] !== null) return;
      answers[qi] = btn;
      const isCorrect = btn.dataset.correct !== undefined;
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      if (!isCorrect) {
        q.querySelector('[data-correct]').classList.add('correct');
      }
      q.querySelectorAll('.q-option').forEach(b => (b.disabled = true));
      feedback.hidden = false;
      feedback.textContent = isCorrect
        ? 'Correct.'
        : 'Not quite — review the sections above.';
      nextBtn.disabled = false;
    });
  });
});

prevBtn.addEventListener('click', () => {
  if (currentQ > 0) showQuestion(--currentQ);
});

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas || !quizEl) return;
  const ctx = canvas.getContext('2d');
  const rect = quizEl.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  const colors = ['#3d7a37', '#f5c842', '#4a9fd4', '#f4821f', '#5fa858', '#ff88aa'];
  const pieces = Array.from({ length: 80 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 1) * 14,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 6,
    rot: Math.random() * 360,
    spin: (Math.random() - 0.5) * 15,
    life: 1,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    pieces.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.rot += p.spin;
      p.life -= 0.008;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });
    frame++;
    if (alive && frame < 180) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

function showCelebration(score, total) {
  const pct = score / total;
  if (pct === 1) {
    celebrationTitle.textContent = 'Photosynthesis Master!';
    celebrationEmoji.textContent = '🌿';
  } else if (pct >= 0.66) {
    celebrationTitle.textContent = 'Great work!';
    celebrationEmoji.textContent = '🍃';
  } else {
    celebrationTitle.textContent = 'Keep learning!';
    celebrationEmoji.textContent = '🌱';
  }
  celebrationScore.textContent = `You scored ${score} out of ${total} — ${Math.round(pct * 100)}%`;
  celebration.hidden = false;
  quizEl.classList.add('celebrating');
  launchConfetti();

  setTimeout(() => {
    celebration.hidden = true;
    quizEl.classList.remove('celebrating');
    feedback.hidden = false;
    feedback.textContent = `Quiz complete — ${score} of ${total} correct. Scroll up to review any topics!`;
  }, 4000);
}

nextBtn.addEventListener('click', () => {
  if (currentQ < questions.length - 1) {
    showQuestion(++currentQ);
  } else {
    const score = answers.filter(a => a?.dataset.correct !== undefined).length;
    nextBtn.disabled = true;
    showCelebration(score, questions.length);
  }
});

showQuestion(0);
