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

let scrollObs = null;

async function loadData() {
  try {
    const response = await fetch('data/data.json');
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} lors du chargement de data/data.json`);
    }
    return await response.json();
  } catch (error) {
    console.error('Impossible de charger data.json :', error);
    return null;
  }
}

async function init() {
  App.data = await loadData();

  setTimeout(() => {
    document.getElementById('loading-screen')?.classList.add('hidden');
  }, 2400);

  // UI de base d'abord
  setupNavbar();
  setupProgress();
  setupScrollAnimations();
  setupSmoothScroll();
  setupDotControls();
  setupCounters();

  // Puis les modules dépendants des données
  if (App.data) {
    initMaps();
    initCharts();
    buildSources();
    buildShelterSearch();
  } else {
    console.warn('Aucune donnée chargée : certaines sections resteront vides.');
  }
}

/* ─────────────────────────────────────────────────────────────
   MAPS
───────────────────────────────────────────────────────────── */
function initMaps() {
  if (typeof window.MapModule === 'undefined') {
    console.warn('MapModule non chargé.');
    return;
  }

  try {
    window.MapModule.initWorldMap(App.data);
    window.MapModule.initEuropeMap(App.data);
    window.MapModule.initSwitzerlandMap(App.data);

    const shelterResult = window.MapModule.initShelterMap(App.data.shelters);
    if (shelterResult) {
      App.shelterMap = shelterResult.map;
      App.shelterMarkers = shelterResult.markers || {};
    }
  } catch (error) {
    console.error('Erreur pendant l’initialisation des cartes :', error);
  }
}

/* ─────────────────────────────────────────────────────────────
   CHARTS
───────────────────────────────────────────────────────────── */
function initCharts() {
  if (typeof window.ChartsModule === 'undefined') {
    console.warn('ChartsModule non chargé.');
    return;
  }

  try {
    window.ChartsModule.initTimeline(App.data);
    window.ChartsModule.initCompareChart(App.data);
    App.dotAnim = new window.ChartsModule.DotAnimation('dot-canvas', App.data);
  } catch (error) {
    console.error('Erreur pendant l’initialisation des graphiques :', error);
  }
}

/* ─────────────────────────────────────────────────────────────
   SOURCES
───────────────────────────────────────────────────────────── */
function buildSources() {
  const el = document.getElementById('sources-grid');
  if (!el) return;

  const sources = [
    {
      icon: '🏛️',
      name: 'PSA / STS',
      desc: 'Protection Suisse des Animaux — statistiques officielles 2024 des 66 sections affiliées. Seule source fiable sur les abandons en Suisse.',
      type: 'psa',
      typeLabel: 'Institutionnel CH'
    },
    {
      icon: '🌍',
      name: 'OMS / FOUR PAWS',
      desc: 'Estimation de 200 millions de chiens errants dans le monde. Citée par FOUR PAWS et relayée par de nombreuses ONG internationales.',
      type: 'ong',
      typeLabel: 'International'
    },
    {
      icon: '🐕',
      name: 'Fundación Affinity',
      desc: 'Statistiques annuelles sur les abandons en Espagne. ~300 000 animaux recueillis en 2023.',
      type: 'intl',
      typeLabel: 'Espagne'
    },
    {
      icon: '📺',
      name: 'SPA / 30M d\'Amis',
      desc: 'SPA France : 44 844 animaux en 2023 (13 124 chiens). 30 Millions d\'Amis : ~100 000 abandons/an en France.',
      type: 'media',
      typeLabel: 'France'
    },
    {
      icon: '📊',
      name: 'Dogs Trust UK/IE',
      desc: '36 965 chiens pris en charge au Royaume-Uni (2023-2024). 7 041 en Irlande (2024).',
      type: 'intl',
      typeLabel: 'UK / Irlande'
    },
    {
      icon: '🗺️',
      name: 'ICNF / Univ. Aveiro',
      desc: 'Premier recensement national au Portugal (2023) : 101 015 chiens errants + 830 541 chats errants.',
      type: 'opendata',
      typeLabel: 'Portugal'
    },
    {
      icon: '📰',
      name: 'MDPI / Deutscher TB',
      desc: 'Étude académique Grèce (MDPI déc. 2024) : ~3M chiens+chats errants. Deutscher Tierschutzbund : 80-100k chiens en refuge/an en Allemagne.',
      type: 'intl',
      typeLabel: 'Académique'
    },
    {
      icon: '🌐',
      name: 'OpenStreetMap',
      desc: 'Données cartographiques libres pour la localisation des refuges et la géolocalisation des cantons.',
      type: 'opendata',
      typeLabel: 'Open data'
    }
  ];

  el.innerHTML = sources.map(source => `
    <div class="source-card fade-in-up">
      <div class="source-icon">${source.icon}</div>
      <div class="source-name">${source.name}</div>
      <div class="source-desc">${source.desc}</div>
      <span class="source-type ${source.type}">${source.typeLabel}</span>
    </div>
  `).join('');

  if (scrollObs) {
    document.querySelectorAll('.source-card.fade-in-up').forEach(card => {
      scrollObs.observe(card);
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   SHELTER SEARCH
───────────────────────────────────────────────────────────── */
function buildShelterSearch() {
  const input = document.getElementById('postal-input');
  const list = document.getElementById('shelter-results');

  if (!input || !list || !App.data || !Array.isArray(App.data.shelters)) return;

  renderShelters(App.data.shelters.slice(0, 5), list);

  let debounceTimer = null;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const query = input.value.trim().toLowerCase();

      if (query.length < 2) {
        renderShelters(App.data.shelters.slice(0, 5), list);
        return;
      }

      const found = App.data.shelters.filter(shelter =>
        shelter.postal.startsWith(query) ||
        shelter.city.toLowerCase().includes(query) ||
        shelter.name.toLowerCase().includes(query)
      );

      renderShelters(found.length ? found : App.data.shelters.slice(0, 3), list);

      if (found.length > 0 && App.shelterMap) {
        const lats = found.map(shelter => shelter.lat);
        const lngs = found.map(shelter => shelter.lng);

        try {
          App.shelterMap.fitBounds(
            [
              [Math.min(...lats) - 0.1, Math.min(...lngs) - 0.1],
              [Math.max(...lats) + 0.1, Math.max(...lngs) + 0.1]
            ],
            { padding: [20, 20] }
          );
        } catch (error) {
          console.warn('Impossible de zoomer sur les refuges trouvés :', error);
        }
      }
    }, 320);
  });
}

function renderShelters(shelters, container) {
  if (!container) return;

  if (!shelters.length) {
    container.innerHTML = `
      <p class="text-muted" style="font-size:0.85rem;padding:0.5rem 0">
        Aucun refuge trouvé.
      </p>
    `;
    return;
  }

  container.innerHTML = shelters.map(shelter => `
    <div class="shelter-card" data-postal="${shelter.postal}">
      <div class="shelter-name">🐾 ${shelter.name}</div>
      <div class="shelter-info">📍 ${shelter.city} (${shelter.postal}) · ${shelter.phone}</div>
      <span class="shelter-dogs">🐕 ${shelter.dogs} chiens disponibles</span>
    </div>
  `).join('');

  container.querySelectorAll('.shelter-card').forEach(card => {
    card.addEventListener('click', () => {
      const postal = card.dataset.postal;
      selectShelter(postal);
    });
  });
}

window.selectShelter = function(postal) {
  document.querySelectorAll('.shelter-card').forEach(card => {
    card.classList.remove('selected');
  });

  const selectedCard = document.querySelector(`.shelter-card[data-postal="${postal}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  const markerData = App.shelterMarkers[postal];
  if (markerData && App.shelterMap) {
    App.shelterMap.setView([markerData.shelter.lat, markerData.shelter.lng], 13, {
      animate: true
    });
    markerData.marker.openPopup();
  }
};

/* ─────────────────────────────────────────────────────────────
   UI
───────────────────────────────────────────────────────────── */
function setupNavbar() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function setupProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

function setupScrollAnimations() {
  scrollObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  document.querySelectorAll('.fade-in-up, .fade-in').forEach(el => {
    scrollObs.observe(el);
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function setupDotControls() {
  const btnScatter = document.getElementById('btn-scatter');
  const btnBars = document.getElementById('btn-bars');

  btnScatter?.addEventListener('click', () => {
    App.dotAnim?.transition('scatter');
    btnScatter.classList.add('active');
    btnBars?.classList.remove('active');
  });

  btnBars?.addEventListener('click', () => {
    App.dotAnim?.transition('bars');
    btnBars.classList.add('active');
    btnScatter?.classList.remove('active');
  });

  const section = document.getElementById('section-dots');
  if (section) {
    let alreadyDone = false;

    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !alreadyDone) {
        alreadyDone = true;
        setTimeout(() => {
          App.dotAnim?.transition('bars');
          btnBars?.classList.add('active');
          btnScatter?.classList.remove('active');
        }, 700);
      }
    }, {
      threshold: 0.45
    }).observe(section);
  }
}

function setupCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('fr-CH');

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, {
    threshold: 0.5
  });

  document.querySelectorAll('.counter').forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', init);