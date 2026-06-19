// Floating light particles in hero
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${20 + Math.random() * 60}%`;
    p.style.bottom = `${10 + Math.random() * 40}%`;
    p.style.animationDelay = `${Math.random() * 3}s`;
    p.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    container.appendChild(p);
  }
})();

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

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
  const plant = document.getElementById('sim-plant');

  fill.style.width = `${rate}%`;
  value.textContent = `${rate}%`;

  const scale = 0.7 + (rate / 100) * 0.5;
  plant.style.transform = `scale(${scale})`;

  const leafColor = rate > 60 ? '#4a8f3f' : rate > 30 ? '#7a9f3a' : '#a08030';
  plant.querySelectorAll('.sim-leaf').forEach(leaf => {
    leaf.style.background = leafColor;
  });

  if (rate >= 70) {
    status.textContent = 'Optimal conditions — photosynthesis is running efficiently.';
  } else if (rate >= 40) {
    status.textContent = 'Moderate rate — one or more factors may be limiting growth.';
  } else if (rate >= 15) {
    status.textContent = 'Low rate — stress conditions are slowing photosynthesis.';
  } else {
    status.textContent = 'Very low rate — the plant is barely photosynthesizing.';
  }
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
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedback.textContent = isCorrect
      ? 'Correct! Well done.'
      : 'Not quite — review the section above and try again next time.';
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
      feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
      feedback.textContent = isCorrect
        ? 'Correct! Well done.'
        : 'Not quite — review the section above and try again next time.';
      nextBtn.disabled = false;
    });
  });
});

prevBtn.addEventListener('click', () => {
  if (currentQ > 0) showQuestion(--currentQ);
});

nextBtn.addEventListener('click', () => {
  if (currentQ < questions.length - 1) {
    showQuestion(++currentQ);
  } else {
    const score = answers.filter(a => a?.dataset.correct !== undefined).length;
    feedback.hidden = false;
    feedback.className = 'quiz-feedback correct';
    feedback.textContent = `Quiz complete! You scored ${score} out of ${questions.length}.`;
    nextBtn.disabled = true;
  }
});

showQuestion(0);

// Scroll reveal for cards and stages
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.card, .stage, .factor-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
