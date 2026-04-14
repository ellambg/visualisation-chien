/**
 * app.js — Orchestrateur principal
 */
'use strict';

const App = {
  data: null,
  dotAnim: null,
  shelterMap: null,
  shelterMarkers: {}
};

async function init() {
  try {
    const r = await fetch('data/data.json');
    App.data = await r.json();
  } catch(e) {
    console.error('Impossible de charger data.json', e);
  }

  setTimeout(() => {
    document.getElementById('loading-screen')?.classList.add('hidden');
  }, 2400);

  if (App.data) {
    MapModule.initWorldMap(App.data);
    MapModule.initEuropeMap(App.data);
    MapModule.initSwitzerlandMap(App.data);

    const shelterResult = MapModule.initShelterMap(App.data.shelters);
    if (shelterResult) {
      App.shelterMap     = shelterResult.map;
      App.shelterMarkers = shelterResult.markers;
    }

    ChartsModule.initTimeline(App.data);
    ChartsModule.initCompareChart(App.data);

    App.dotAnim = new ChartsModule.DotAnimation('dot-canvas', App.data);

    buildSources();
    buildShelterSearch();
  }

  setupNavbar();
  setupProgress();
  setupScrollAnimations();
  setupSmoothScroll();
  setupDotControls();
  setupCounters();
}

// ── SOURCES ───────────────────────────────────────────────────────────────
function buildSources() {
  const el = document.getElementById('sources-grid');
  if (!el) return;
  const sources = [
    { icon:'🏛️', name:'PSA / STS', desc:'Protection Suisse des Animaux — statistiques officielles 2024 des 66 sections affiliées. Seule source fiable sur les abandons en Suisse.', type:'psa', typeLabel:'Institutionnel CH' },
    { icon:'🌍', name:'OMS / FOUR PAWS', desc:'Estimation de 200 millions de chiens errants dans le monde. Citée par FOUR PAWS et relayée par de nombreuses ONG internationales.', type:'ong', typeLabel:'International' },
    { icon:'🐕', name:'Fundación Affinity', desc:'Statistiques annuelles sur les abandons en Espagne. ~300 000 animaux recueillis en 2023.', type:'intl', typeLabel:'Espagne' },
    { icon:'📺', name:'SPA / 30M d\'Amis', desc:'SPA France : 44 844 animaux en 2023 (13 124 chiens). 30 Millions d\'Amis : ~100 000 abandons/an en France.', type:'media', typeLabel:'France' },
    { icon:'📊', name:'Dogs Trust UK/IE', desc:'36 965 chiens pris en charge au Royaume-Uni (2023-2024). 7 041 en Irlande (2024).', type:'intl', typeLabel:'UK / Irlande' },
    { icon:'🗺️', name:'ICNF / Univ. Aveiro', desc:'Premier recensement national au Portugal (2023) : 101 015 chiens errants + 830 541 chats errants.', type:'opendata', typeLabel:'Portugal' },
    { icon:'📰', name:'MDPI / Deutscher TB', desc:'Étude académique Grèce (MDPI déc. 2024) : ~3M chiens+chats errants. Deutscher Tierschutzbund : 80-100k chiens en refuge/an en Allemagne.', type:'intl', typeLabel:'Académique' },
    { icon:'🌐', name:'OpenStreetMap', desc:'Données cartographiques libres pour la localisation des refuges et la géolocalisation des cantons.', type:'opendata', typeLabel:'Open data' }
  ];
  el.innerHTML = sources.map(s => `
    <div class="source-card fade-in-up">
      <div class="source-icon">${s.icon}</div>
      <div class="source-name">${s.name}</div>
      <div class="source-desc">${s.desc}</div>
      <span class="source-type ${s.type}">${s.typeLabel}</span>
    </div>
  `).join('');
  // Observer pour fade-in
  document.querySelectorAll('.source-card.fade-in-up').forEach(el => scrollObs.observe(el));
}

// ── SHELTER SEARCH ────────────────────────────────────────────────────────
function buildShelterSearch() {
  const input = document.getElementById('postal-input');
  const list  = document.getElementById('shelter-results');
  if (!input || !list) return;

  renderShelters(App.data.shelters.slice(0, 5), list);

  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { renderShelters(App.data.shelters.slice(0,5), list); return; }
      const found = App.data.shelters.filter(s =>
        s.postal.startsWith(q) || s.city.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
      renderShelters(found.length ? found : App.data.shelters.slice(0,3), list);
      if (found.length && App.shelterMap) {
        const lats = found.map(s=>s.lat), lngs = found.map(s=>s.lng);
        try {
          App.shelterMap.fitBounds([[Math.min(...lats)-0.1,Math.min(...lngs)-0.1],[Math.max(...lats)+0.1,Math.max(...lngs)+0.1]], {padding:[20,20]});
        } catch(e) {}
      }
    }, 320);
  });
}

function renderShelters(shelters, el) {
  el.innerHTML = shelters.map(s => `
    <div class="shelter-card" onclick="selectShelter('${s.postal}')">
      <div class="shelter-name">🐾 ${s.name}</div>
      <div class="shelter-info">📍 ${s.city} (${s.postal}) · ${s.phone}</div>
      <span class="shelter-dogs">🐕 ${s.dogs} chiens disponibles</span>
    </div>
  `).join('');
}

window.selectShelter = function(postal) {
  document.querySelectorAll('.shelter-card').forEach(c => c.classList.remove('selected'));
  const card = [...document.querySelectorAll('.shelter-card')].find(c => c.querySelector('.shelter-dogs') && c.onclick?.toString().includes(postal));
  const m = App.shelterMarkers[postal];
  if (m && App.shelterMap) {
    App.shelterMap.setView([m.shelter.lat, m.shelter.lng], 13, { animate:true });
    m.marker.openPopup();
  }
};

// ── UI ─────────────────────────────────────────────────────────────────────
function setupNavbar() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive:true });
}

function setupProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? window.scrollY/total*100 : 0) + '%';
  }, { passive:true });
}

let scrollObs;
function setupScrollAnimations() {
  scrollObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.fade-in-up, .fade-in').forEach(el => scrollObs.observe(el));
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
}

function setupDotControls() {
  const btnS = document.getElementById('btn-scatter');
  const btnB = document.getElementById('btn-bars');
  btnS?.addEventListener('click', () => {
    App.dotAnim?.transition('scatter');
    btnS.classList.add('active'); btnB?.classList.remove('active');
  });
  btnB?.addEventListener('click', () => {
    App.dotAnim?.transition('bars');
    btnB.classList.add('active'); btnS?.classList.remove('active');
  });

  // Auto-transition au scroll
  const section = document.getElementById('section-dots');
  if (section) {
    let done = false;
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !done) {
        done = true;
        setTimeout(() => {
          App.dotAnim?.transition('bars');
          btnB?.classList.add('active'); btnS?.classList.remove('active');
        }, 700);
      }
    }, { threshold: 0.45 }).observe(section);
  }
}

// Compteurs animés
function setupCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target).toLocaleString('fr-CH');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', init);