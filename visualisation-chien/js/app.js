/**
 * app.js — Orchestrateur principal
 * Scrollytelling, navigation, chargement des données, initialisation des modules
 */

'use strict';

// ─── État global ───────────────────────────────────────────────────────────
const AppState = {
  data: null,
  dotAnim: null,
  shelterMapInstance: null,
  shelterMarkers: {},
  currentSection: null,
  initialized: false
};

// ─── Chargement des données ────────────────────────────────────────────────
async function loadData() {
  try {
    const response = await fetch('data/data.json');
    if (!response.ok) throw new Error('Erreur chargement data.json');
    return await response.json();
  } catch (err) {
    console.error('Erreur chargement données :', err);
    return null;
  }
}

// ─── Init application ──────────────────────────────────────────────────────
async function init() {
  // Chargement des données
  AppState.data = await loadData();

  if (!AppState.data) {
    console.warn('Données non chargées — certains modules seront désactivés.');
  }

  // Masquer l'écran de chargement
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.classList.add('hidden');
  }, 2200);

  // Initialisation des modules
  if (AppState.data) {
    initMaps();
    initCharts();
    initSocialGrid();
    initShelterSearch();
    renderSourcesSection();
  }

  // Comportements UI
  initNavbar();
  initProgressBar();
  initScrollAnimations();
  initSmoothScroll();
  initDotControls();

  AppState.initialized = true;
}

// ─── Maps ──────────────────────────────────────────────────────────────────
function initMaps() {
  if (typeof window.MapModule === 'undefined') return;

  // Carte monde
  window.MapModule.initWorldMap(AppState.data);

  // Carte Europe
  window.MapModule.initEuropeMap(AppState.data);

  // Carte Suisse
  window.MapModule.initSwitzerlandMap(AppState.data);

  // Carte refuges
  const shelterResult = window.MapModule.initShelterMap(AppState.data.shelters);
  if (shelterResult) {
    AppState.shelterMapInstance = shelterResult.map;
    AppState.shelterMarkers = shelterResult.markers;
  }
}

// ─── Charts ────────────────────────────────────────────────────────────────
function initCharts() {
  if (typeof window.ChartsModule === 'undefined') return;

  // Animation des points
  AppState.dotAnim = new window.ChartsModule.DotAnimation('dot-canvas', AppState.data);

  // Diagramme en bâton
  window.ChartsModule.initBarChart(AppState.data);

  // Timeline
  window.ChartsModule.initTimeline(AppState.data);

  // Donut
  window.ChartsModule.initDonutChart(AppState.data);
}

// ─── Grille réseaux sociaux ────────────────────────────────────────────────
function initSocialGrid() {
  const grid = document.getElementById('social-grid-container');
  if (!grid || !AppState.data) return;

  const social = AppState.data.social_media;
  const themeEmojis = {
    'abandon sur route': '🚗',
    'refuge': '🏠',
    'adoption': '❤️',
    'sauvetage': '🚨',
    'abandon': '😢'
  };

  const platformColors = {
    'TikTok': '#ff0050',
    'Instagram': '#c13584'
  };

  // Grille mixte : 4 colonnes, 2 lignes
  // Position 4 (index 3) et position 8 (index 7) → stat cards
  const gridItems = [
    { type: 'card', index: 0 },
    { type: 'card', index: 1 },
    { type: 'card', index: 2 },
    { type: 'stat', label: '320k', sublabel: 'interactions max' },
    { type: 'card', index: 3 },
    { type: 'card', index: 4 },
    { type: 'stat', label: '#abandon', sublabel: 'hashtag viral' },
    { type: 'card', index: 5 }
  ];

  grid.innerHTML = gridItems.map(item => {
    if (item.type === 'stat') {
      return `
        <div class="social-card stat-card-social">
          <div class="social-stat-number">${item.label}</div>
          <div class="social-stat-label">${item.sublabel}</div>
        </div>
      `;
    }

    const s = social[item.index];
    if (!s) return '';
    const emoji = themeEmojis[s.theme] || '🐾';
    const color = platformColors[s.platform] || '#e8a020';

    return `
      <div class="social-card">
        <div class="social-card-img">
          ${emoji}
          <span class="social-platform-badge" style="color:${color}">${s.platform}</span>
        </div>
        <div class="social-card-meta">
          <div class="social-card-theme">${s.theme}</div>
          <div class="social-card-caption">${s.caption}</div>
          <div class="social-card-engagement">
            ❤️ ${formatNumber(s.engagement)}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ─── Recherche de refuges ──────────────────────────────────────────────────
function initShelterSearch() {
  const input   = document.getElementById('postal-input');
  const results = document.getElementById('shelter-results');
  if (!input || !results || !AppState.data) return;

  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const val = input.value.trim();

    if (val.length < 2) {
      results.innerHTML = '<p class="text-muted" style="font-size:0.85rem;padding:0.5rem 0">Entrez un code postal pour trouver des refuges proches.</p>';
      return;
    }

    debounceTimer = setTimeout(() => {
      const found = AppState.data.shelters.filter(s =>
        s.postal_code.startsWith(val) ||
        s.city.toLowerCase().includes(val.toLowerCase())
      );

      const display = found.length > 0 ? found : AppState.data.shelters.slice(0, 4);
      renderShelterResults(display, results);

      // Zoom carte
      if (AppState.shelterMapInstance && found.length > 0) {
        const lats = found.map(s => s.lat);
        const lngs = found.map(s => s.lng);
        try {
          AppState.shelterMapInstance.fitBounds(
            [[Math.min(...lats) - 0.15, Math.min(...lngs) - 0.15],
             [Math.max(...lats) + 0.15, Math.max(...lngs) + 0.15]],
            { padding: [30, 30] }
          );
        } catch (e) {}
      }
    }, 350);
  });

  // Affichage initial : tous
  renderShelterResults(AppState.data.shelters.slice(0, 5), results);
}

function renderShelterResults(shelters, container) {
  if (shelters.length === 0) {
    container.innerHTML = '<p class="text-muted" style="font-size:0.85rem;padding:0.5rem 0">Aucun refuge trouvé.</p>';
    return;
  }

  container.innerHTML = shelters.map(s => `
    <div class="shelter-card" data-postal="${s.postal_code}" onclick="selectShelter('${s.postal_code}')">
      <div class="shelter-name">🐾 ${s.name}</div>
      <div class="shelter-info">
        <span>📍 ${s.city} (${s.postal_code})</span>
        <span>📞 ${s.phone}</span>
      </div>
      <div class="shelter-dogs-badge">🐕 ${s.dogs_available} chiens disponibles</div>
    </div>
  `).join('');
}

window.selectShelter = function(postalCode) {
  // Highlight la carte
  document.querySelectorAll('.shelter-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.shelter-card[data-postal="${postalCode}"]`);
  if (card) card.classList.add('selected');

  // Ouvrir le marker sur la carte
  if (AppState.shelterMarkers && AppState.shelterMarkers[postalCode]) {
    const { marker, shelter } = AppState.shelterMarkers[postalCode];
    AppState.shelterMapInstance.setView([shelter.lat, shelter.lng], 13, { animate: true });
    marker.openPopup();
  }
};

// ─── Section méthodologie / sources ───────────────────────────────────────
function renderSourcesSection() {
  const grid = document.getElementById('sources-grid');
  if (!grid) return;

  const sources = [
    {
      icon: '🏛️',
      name: 'Protection Suisse des Animaux (PSA / STS)',
      desc: 'Statistiques officielles des refuges affiliés en Suisse. Données annuelles sur les admissions, adoptions et issues.',
      type: 'institutional',
      typeLabel: 'Institutionnel'
    },
    {
      icon: '🌍',
      name: 'Organisation Mondiale de la Santé (OMS)',
      desc: 'Estimation du nombre de chiens errants dans le monde (200 millions), citée par des ONG spécialisées.',
      type: 'international',
      typeLabel: 'International'
    },
    {
      icon: '📺',
      name: 'RTS — Radio Télévision Suisse',
      desc: 'Articles de contextualisation des statistiques PSA pour le public suisse romand.',
      type: 'media',
      typeLabel: 'Média'
    },
    {
      icon: '📊',
      name: 'Shelter Animals Count',
      desc: 'Base de données comparative internationale sur les animaux en refuge. Utilisée pour les comparaisons européennes.',
      type: 'international',
      typeLabel: 'International'
    },
    {
      icon: '📱',
      name: 'TikTok / Instagram (données publiques)',
      desc: 'Sélection de contenus publics illustrant le phénomène d\'abandon. Métadonnées uniquement (hashtags, engagement, thème).',
      type: 'media',
      typeLabel: 'Réseaux sociaux'
    },
    {
      icon: '🗺️',
      name: 'OpenStreetMap / Nominatim',
      desc: 'Données géographiques libres pour la cartographie des cantons suisses et la localisation des refuges.',
      type: 'institutional',
      typeLabel: 'Open data'
    }
  ];

  grid.innerHTML = sources.map(s => `
    <div class="source-card fade-in-up">
      <div class="source-icon">${s.icon}</div>
      <div class="source-name">${s.name}</div>
      <div class="source-desc">${s.desc}</div>
      <span class="source-type ${s.type}">${s.typeLabel}</span>
    </div>
  `).join('');
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ─── Barre de progression ──────────────────────────────────────────────────
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ─── Animations au scroll ──────────────────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in-up, .fade-in').forEach(el => {
    observer.observe(el);
  });

  // Trigger des charts quand ils deviennent visibles
  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          if (section === 'chart-section' && AppState.data && !AppState._barChartDone) {
            AppState._barChartDone = true;
            // Re-render si nécessaire
          }
          if (section === 'timeline-section' && AppState.data && !AppState._timelineDone) {
            AppState._timelineDone = true;
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  ['chart-section', 'timeline-section'].forEach(id => {
    const el = document.getElementById(id);
    if (el) chartObserver.observe(el);
  });
}

// ─── Smooth scroll pour les ancres ─────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── Contrôles du nuage de points ──────────────────────────────────────────
function initDotControls() {
  const btnScatter = document.getElementById('btn-scatter');
  const btnBars    = document.getElementById('btn-bars');

  if (btnScatter) {
    btnScatter.addEventListener('click', () => {
      if (AppState.dotAnim) AppState.dotAnim.transition('scatter');
      btnScatter.classList.add('active');
      if (btnBars) btnBars.classList.remove('active');
    });
  }

  if (btnBars) {
    btnBars.addEventListener('click', () => {
      if (AppState.dotAnim) AppState.dotAnim.transition('bars');
      btnBars.classList.add('active');
      if (btnScatter) btnScatter.classList.remove('active');
    });
  }

  // Auto-transition au scroll dans la section
  const dotsSection = document.getElementById('dots-section');
  if (dotsSection) {
    let transitioned = false;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !transitioned) {
          transitioned = true;
          setTimeout(() => {
            if (AppState.dotAnim) {
              AppState.dotAnim.transition('bars');
              if (btnBars)    btnBars.classList.add('active');
              if (btnScatter) btnScatter.classList.remove('active');
            }
          }, 800);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(dotsSection);
  }
}

// ─── Utilitaires ───────────────────────────────────────────────────────────
function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(0) + 'k';
  return n.toString();
}

// ─── Lancement ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
