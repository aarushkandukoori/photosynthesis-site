(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const track = document.getElementById('pin-track');
  if (!track || reducedMotion) return;

  const pinStep = document.getElementById('pin-step');
  const pinTitle = document.getElementById('pin-title');
  const pinDesc = document.getElementById('pin-desc');
  const pinCopy = document.querySelector('.pin-copy');
  const pinDots = document.querySelectorAll('.pin-dot');

  const $ = id => document.getElementById(id);

  const layers = {
    sunlight: $('layer-sunlight'),
    photon1: $('photon-1'),
    photon2: $('photon-2'),
    photon3: $('photon-3'),
    granaGlow: $('grana-glow'),
    electrons: $('electrons'),
    waterInflow: $('water-inflow'),
    h2o: $('mol-h2o'),
    h2oSplit: $('mol-h2o-split'),
    o2Bubbles: $('o2-bubbles'),
    etcPath: $('etc-path'),
    atpSynthase: $('atp-synthase'),
    atpGroup: $('mol-atp-group'),
    nadph: $('mol-nadph'),
    co2Group: $('mol-co2-group'),
    calvinCycle: $('calvin-cycle'),
    g3p: $('mol-g3p'),
    glucose: $('mol-glucose'),
    starch: $('starch-granule'),
    chloroplast: $('chloroplast'),
  };

  const scenes = [
    {
      step: '01 — LIGHT CAPTURE',
      title: 'Photons strike the leaf.',
      desc: 'Sunlight hits chlorophyll molecules embedded in the thylakoid membranes. Each photon excites an electron, initiating the light-dependent reactions.',
      state: {
        sunlight: 1, granaGlow: 0.7, electrons: 0.6,
        photonY: [55, 40, 60], photonOp: [1, 1, 1],
        waterInflow: 0, h2o: 0, h2oY: 80, h2oSplit: 0,
        o2Bubbles: 0, o2Y: 0, etcPath: 0, atpSynthase: 0,
        atpGroup: 0, nadph: 0, co2Group: 0, co2X: 40,
        calvinCycle: 0, calvinRot: 0, g3p: 0, glucose: 0,
        glucoseScale: 0.5, starch: 0, chlScale: 0.92,
      },
    },
    {
      step: '02 — PHOTOLYSIS',
      title: 'Water molecules split.',
      desc: 'Energy from absorbed light drives photolysis — H₂O is broken into protons, electrons, and O₂. Oxygen diffuses out through the stomata.',
      state: {
        sunlight: 0.35, granaGlow: 0.85, electrons: 0.3,
        photonY: [20, 15, 22], photonOp: [0.3, 0.3, 0.3],
        waterInflow: 0.8, h2o: 0.7, h2oY: 20, h2oSplit: 0.6,
        o2Bubbles: 0.8, o2Y: -30, etcPath: 0.2, atpSynthase: 0,
        atpGroup: 0, nadph: 0, co2Group: 0, co2X: 40,
        calvinCycle: 0, calvinRot: 0, g3p: 0, glucose: 0,
        glucoseScale: 0.5, starch: 0, chlScale: 0.96,
      },
    },
    {
      step: '03 — ENERGY TRANSFER',
      title: 'ATP and NADPH are generated.',
      desc: 'Excited electrons flow through the electron transport chain. Their energy is captured in ATP and NADPH — the chemical fuel for the next stage.',
      state: {
        sunlight: 0, granaGlow: 0.5, electrons: 1,
        photonY: [0, 0, 0], photonOp: [0, 0, 0],
        waterInflow: 0, h2o: 0, h2oY: 80, h2oSplit: 0,
        o2Bubbles: 0.35, o2Y: -70, etcPath: 1, atpSynthase: 1,
        atpGroup: 1, nadph: 1, co2Group: 0, co2X: 40,
        calvinCycle: 0, calvinRot: 0, g3p: 0, glucose: 0,
        glucoseScale: 0.5, starch: 0, chlScale: 1,
      },
    },
    {
      step: '04 — CARBON FIXATION',
      title: 'CO₂ enters the Calvin cycle.',
      desc: 'In the stroma, RuBisCO fixes atmospheric CO₂ onto organic molecules. ATP and NADPH from the light reactions power each turn of the cycle.',
      state: {
        sunlight: 0, granaGlow: 0.25, electrons: 0,
        photonY: [0, 0, 0], photonOp: [0, 0, 0],
        waterInflow: 0, h2o: 0, h2oY: 80, h2oSplit: 0,
        o2Bubbles: 0, o2Y: -90, etcPath: 0.2, atpSynthase: 0.3,
        atpGroup: 0.4, nadph: 0.4, co2Group: 1, co2X: 0,
        calvinCycle: 1, calvinRot: 45, g3p: 0.7, glucose: 0,
        glucoseScale: 0.6, starch: 0.2, chlScale: 1.02,
      },
    },
    {
      step: '05 — SYNTHESIS',
      title: 'Glucose is assembled.',
      desc: 'Three-carbon G3P molecules are combined into C₆H₁₂O₆ — glucose. This sugar stores chemical energy and becomes the foundation of nearly all food webs.',
      state: {
        sunlight: 0, granaGlow: 0.15, electrons: 0,
        photonY: [0, 0, 0], photonOp: [0, 0, 0],
        waterInflow: 0, h2o: 0, h2oY: 80, h2oSplit: 0,
        o2Bubbles: 0, o2Y: -110, etcPath: 0, atpSynthase: 0,
        atpGroup: 0, nadph: 0, co2Group: 0.2, co2X: -20,
        calvinCycle: 0.5, calvinRot: 120, g3p: 0.3, glucose: 1,
        glucoseScale: 1, starch: 1, chlScale: 0.95,
      },
    },
  ];

  let currentScene = -1;
  let time = 0;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpState(a, b, t) {
    const out = {};
    for (const k of Object.keys(a)) {
      if (Array.isArray(a[k])) {
        out[k] = a[k].map((v, i) => lerp(v, b[k][i], t));
      } else {
        out[k] = lerp(a[k], b[k] ?? a[k], t);
      }
    }
    return out;
  }

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function getProgress() {
    const rect = track.getBoundingClientRect();
    const scrollable = track.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / scrollable));
  }

  function setOp(el, v) {
    if (!el) return;
    el.style.opacity = v;
    el.setAttribute('opacity', v);
  }

  function applyState(s) {
    setOp(layers.sunlight, s.sunlight);
    setOp(layers.granaGlow, s.granaGlow);
    setOp(layers.electrons, s.electrons);
    setOp(layers.waterInflow, s.waterInflow);
    setOp(layers.h2oSplit, s.h2oSplit);
    setOp(layers.o2Bubbles, s.o2Bubbles);
    setOp(layers.etcPath, s.etcPath);
    setOp(layers.atpSynthase, s.atpSynthase);
    setOp(layers.atpGroup, s.atpGroup);
    setOp(layers.nadph, s.nadph);
    setOp(layers.co2Group, s.co2Group);
    setOp(layers.calvinCycle, s.calvinCycle);
    setOp(layers.g3p, s.g3p);
    setOp(layers.glucose, s.glucose);
    setOp(layers.starch, s.starch);

    const h2oVis = s.h2o * (1 - s.h2oSplit);
    setOp(layers.h2o, h2oVis);
    if (layers.h2o) {
      layers.h2o.setAttribute('transform', `translate(0, ${s.h2oY})`);
    }

    const photons = [layers.photon1, layers.photon2, layers.photon3];
    photons.forEach((p, i) => {
      if (!p) return;
      p.setAttribute('cy', s.photonY[i] + Math.sin(time * 3 + i) * 3);
      p.setAttribute('opacity', s.photonOp[i]);
    });

    if (layers.o2Bubbles) {
      const bob = Math.sin(time * 2) * 3;
      layers.o2Bubbles.setAttribute('transform', `translate(0, ${s.o2Y + bob})`);
    }

    if (layers.co2Group) {
      layers.co2Group.setAttribute('transform', `translate(${s.co2X}, 0)`);
    }

    if (layers.calvinCycle) {
      layers.calvinCycle.setAttribute('transform', `rotate(${s.calvinRot + time * 15}, 0, 15)`);
    }

    if (layers.glucose) {
      const pulse = 1 + Math.sin(time * 2) * 0.03;
      layers.glucose.setAttribute('transform', `translate(0, 10) scale(${s.glucoseScale * pulse})`);
    }

    if (layers.chloroplast) {
      const breathe = 1 + Math.sin(time * 1.5) * 0.008;
      layers.chloroplast.setAttribute('transform', `translate(300, 260) scale(${s.chlScale * breathe})`);
    }

    if (layers.etcPath) {
      const path = layers.etcPath.querySelector('path');
      if (path) path.setAttribute('stroke-dashoffset', -time * 40);
    }

    if (layers.atpSynthase) {
      layers.atpSynthase.querySelectorAll('g').forEach((g, i) => {
        const circle = g.querySelector('circle');
        if (circle) circle.setAttribute('transform', `rotate(${time * 80 + i * 180}, 0, 12)`);
      });
    }

    if (layers.electrons) {
      layers.electrons.querySelectorAll('circle').forEach((c, i) => {
        if (!c.dataset.cx) {
          c.dataset.cx = c.getAttribute('cx');
          c.dataset.cy = c.getAttribute('cy');
        }
        const jx = Math.sin(time * 4 + i) * 2;
        const jy = Math.cos(time * 3 + i * 0.7) * 2;
        c.setAttribute('cx', +c.dataset.cx + jx);
        c.setAttribute('cy', +c.dataset.cy + jy);
      });
    }

    if (layers.granaGlow) {
      layers.granaGlow.style.opacity = s.granaGlow * (0.85 + Math.sin(time * 2.5) * 0.15);
    }
  }

  function updateCopy(sceneIndex) {
    if (sceneIndex === currentScene) return;
    currentScene = sceneIndex;
    const scene = scenes[sceneIndex];

    pinCopy.classList.add('is-transitioning');
    pinStep.textContent = scene.step;
    pinTitle.textContent = scene.title;
    pinDesc.textContent = scene.desc;
    requestAnimationFrame(() => pinCopy.classList.remove('is-transitioning'));

    pinDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === sceneIndex);
    });
  }

  function tick() {
    time += 0.016;
    const progress = getProgress();
    const scaled = progress * (scenes.length - 1);
    const sceneIndex = Math.min(scenes.length - 1, Math.floor(scaled));
    const localT = ease(scaled - sceneIndex);
    const nextIndex = Math.min(scenes.length - 1, sceneIndex + 1);

    const blended = lerpState(scenes[sceneIndex].state, scenes[nextIndex].state, localT);
    applyState(blended);
    updateCopy(sceneIndex);

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
