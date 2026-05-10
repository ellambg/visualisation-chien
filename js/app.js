/**
 * app.js — Orchestrateur principal
 */
import 'maplibre-gl/dist/maplibre-gl.css';
import { StoryMap, buildWorldEuropeChapters, buildSwissChapters, buildShelterChapters } from './storymap.js';
import { DotAnimation, initTimeline, initCompareChart } from './charts.js';

const App = {
  data: null,
  dotAnim: null,
  storymapWorld: null,
  storymapSwiss: null,
  storymapShelters: null
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
  setupHeroCta();
  setupSectionButtons();
  setupScrollAnimations();
  setupSmoothScroll();
  setupDotControls();
  setupCounters();

  // Puis les modules dépendants des données
  if (App.data) {
    initStorymap();
    initCharts();
    buildSources();
  } else {
    console.warn('Aucune donnée chargée : certaines sections resteront vides.');
  }
}

/* ─────────────────────────────────────────────────────────────
   STORYMAP
───────────────────────────────────────────────────────────── */
function initStorymap() {
  try {
    // Storymap 1A : Monde + Europe
    App.storymapWorld = new StoryMap(App.data, {
      mapId:          'storymap-world-map',
      cardId:         'story-card-world',
      labelId:        'storymap-world-label',
      navSelector:    '#storymap-nav .storymap-nav-dot',
      scrollSelector: '#storymap-world-scroll .story-step',
      chapters:       buildWorldEuropeChapters()
    });

    // Storymap 1B : Suisse (mode statique interactif)
    App.storymapSwiss = new StoryMap(App.data, {
      mapId:          'storymap-swiss-map',
      cardId:         null,
      labelId:        null,
      navSelector:    null,
      scrollSelector: null,
      chapters:       buildSwissChapters()
    });

    // Storymap 2 : Refuges (exploration libre uniquement)
    App.storymapShelters = new StoryMap(App.data, {
      mapId:           'shelter-storymap-map',
      cardId:          null,
      labelId:         'shelter-section-label',
      navSelector:     null,
      scrollSelector:  null,
      explorationOnly: true,
      chapters:        buildShelterChapters(App.data.shelters)
    });

  } catch (error) {
    console.error('Erreur storymap :', error);
  }
}

/* ─────────────────────────────────────────────────────────────
   CHARTS
───────────────────────────────────────────────────────────── */
function initCharts() {
  try {
    initTimeline(App.data);
    initCompareChart(App.data);
    App.dotAnim = new DotAnimation('dot-canvas', App.data);
  } catch (error) {
    console.error('Erreur graphiques :', error);
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
      desc: 'Protection Suisse des Animaux, statistiques officielles 2024 des 66 sections affiliées. Seule source fiable sur les abandons en Suisse.',
      type: 'psa',
      typeLabel: 'Institutionnel CH',
      url: 'https://tierschutz.com/fr/protection-des-animaux/statistique-psa-de-la-protection-des-animaux/'
    },
    {
      icon: '🌍',
      name: 'FOUR PAWS, rapport annuel 2023',
      desc: 'Estimation de 200 millions de chiens errants dans le monde. Rapport annuel de l\'ONG internationale FOUR PAWS, référence pour les chiffres globaux.',
      type: 'ong',
      typeLabel: 'International',
      url: 'https://media.4-paws.org/9/0/c/0/90c06b6c9285bce0629257006d733be56b20f6ee/AR23_FR_Final_040924.pdf'
    },
    {
      icon: '🐕',
      name: 'Fundación Affinity',
      desc: 'Étude annuelle sur les abandons et adoptions en Espagne (2024). ~288 000 animaux recueillis en 2023, en baisse grâce à la nouvelle loi de bien-être animal.',
      type: 'intl',
      typeLabel: 'Espagne',
      url: 'https://www.fundacion-affinity.org/fr/sensibilisation/il-ne-le-ferait-jamais-etude-sur-labandon-et-ladoption-2024'
    },
    {
      icon: '📰',
      name: 'Euro Weekly (Espagne 2024)',
      desc: 'Analyse de la situation espagnole post-loi de bien-être animal (2023). Contexte sur la baisse des abandons et les défis persistants pour les refuges.',
      type: 'intl',
      typeLabel: 'Espagne',
      url: 'https://euroweeklynews.com/2024/08/01/are-pets-a-pain-in-spain/'
    },
    {
      icon: '📊',
      name: 'FACCO, abandons en France',
      desc: 'Chambre Syndicale des fabricants d\'aliments pour animaux. Données de référence sur les abandons en France : ~100 000 animaux/an, dont une majorité en été.',
      type: 'intl',
      typeLabel: 'France',
      url: 'https://www.facco.fr/abandon/'
    },
    {
      icon: '📺',
      name: '30 Millions d\'Amis',
      desc: '~100 000 abandons d\'animaux par an en France. Reportages et données de terrain sur les refuges SPA et associations de protection animale françaises.',
      type: 'media',
      typeLabel: 'France',
      url: 'https://www.30millionsdamis.fr/actualites/categorie/97-sauvetage/'
    },
    {
      icon: '📊',
      name: 'Dogs Trust (Royaume-Uni)',
      desc: '36 965 chiens pris en charge en 2023-2024. La plus grande organisation de protection canine du Royaume-Uni publie une enquête annuelle sur les chiens errants.',
      type: 'intl',
      typeLabel: 'Royaume-Uni',
      url: 'https://www.dogstrust.org.uk/about-us/what-we-do/research/stray-dogs-survey-research'
    },
    {
      icon: '🐾',
      name: 'Dogs Trust (Irlande)',
      desc: '7 041 chiens pris en charge en 2024 en Irlande. Alerte sur la hausse des euthanasies dans les fourrières irlandaises faute de places en refuge.',
      type: 'intl',
      typeLabel: 'Irlande',
      url: 'https://www.dogstrust.ie/what-we-do/stories/dogs-trust-concerned-at-increase-in-dogs-being-euthanised-in-pounds'
    },
    {
      icon: '🗺️',
      name: 'ICNF (Portugal)',
      desc: 'Premier recensement national au Portugal (2023) : 101 015 chiens errants + 830 541 chats errants. Un des taux d\'animaux errants les plus élevés d\'Europe.',
      type: 'opendata',
      typeLabel: 'Portugal',
      url: 'https://www.theportugalnews.com/fr/nouvelles/2024-05-06/le-recensement-national-revele-pres-dun-million-danimaux-errants/393847'
    },
    {
      icon: '🌍',
      name: 'ESDAW, chiens errants en Europe',
      desc: 'European Society of Dog and Animal Welfare. Données sur les millions de chiens errants en Europe de l\'Est et les politiques nationales de gestion des populations.',
      type: 'intl',
      typeLabel: 'Europe',
      url: 'https://www.esdaw-eu.eu/the-stray-dogs-in-europe.html'
    },
    {
      icon: '🗺️',
      name: 'Abandons par pays en Europe',
      desc: 'Synthèse comparative des taux d\'abandon dans les pays européens. Comparaison des législations et des chiffres de refuges à l\'échelle du continent.',
      type: 'intl',
      typeLabel: 'Europe',
      url: 'https://www.beatricesconseilscanins.fr/blog/les-pays-au-plus-taux-d-abandon-d-animaux-en-europe.html'
    },
    {
      icon: '🌐',
      name: 'OpenStreetMap',
      desc: 'Données cartographiques libres pour la localisation des refuges et la géolocalisation des cantons suisses.',
      type: 'opendata',
      typeLabel: 'Open data',
      url: 'https://www.openstreetmap.org'
    },
    {
      icon: '📰',
      name: '24 heures : Augmentation des abandons',
      desc: 'Article sur la hausse des abandons d\'animaux domestiques en Suisse en 2024. Achats impulsifs et coûts sous-estimés cités comme causes principales.',
      type: 'media',
      typeLabel: 'Presse CH',
      url: 'https://www.24heures.ch/suisse-augmentation-de-labandon-des-animaux-domestiques-962347553315'
    },
    {
      icon: '📻',
      name: 'RTS : Hausse alarmante des abandons',
      desc: 'Reportage RTS sur les 25 000 cas d\'abandons en Suisse en 2024 et la saturation des refuges affiliés PSA/STS.',
      type: 'media',
      typeLabel: 'Presse CH',
      url: 'https://www.rts.ch/info/suisse/2025/article/hausse-alarmante-des-abandons-d-animaux-en-suisse-25-000-cas-en-2024-29036370.html'
    },
    {
      icon: '📰',
      name: '24 heures : 32 000 animaux en refuges',
      desc: 'Article détaillant les 32 079 animaux recueillis en 2024 dans les refuges suisses, avec chiffres par espèce et analyse des causes.',
      type: 'media',
      typeLabel: 'Presse CH',
      url: 'https://www.24heures.ch/animaux-32000-abandonnes-dans-les-refuges-suisses-en-2024-683444233126'
    }
  ];

  el.innerHTML = sources.map(source => `
    <div class="source-card fade-in-up">
      <div class="source-icon">${source.icon}</div>
      <div class="source-name">${source.name}</div>
      <div class="source-desc">${source.desc}</div>
      <div class="source-footer">
        <span class="source-type ${source.type}">${source.typeLabel}</span>
        ${source.url ? `<a href="${source.url}" target="_blank" rel="noopener" class="source-link">Lire l'article ↗</a>` : ''}
      </div>
    </div>
  `).join('');

  if (scrollObs) {
    document.querySelectorAll('.source-card.fade-in-up').forEach(card => {
      scrollObs.observe(card);
    });
  }
}

/* ─────────────────────────────────────────────────────────────
   UI
───────────────────────────────────────────────────────────── */
function setupHeroCta() {
  document.getElementById('hero-cta')?.addEventListener('click', () => {
    const next = document.getElementById('section-intro-video') || document.getElementById('section-storymap');
    next?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function setupSectionButtons() {
  const sections = Array.from(document.querySelectorAll('section'));
  sections.forEach((section, i) => {
    if (i === sections.length - 1) return;
    if (section.id === 'hero') return;
    const next = sections[i + 1];
    const btn = document.createElement('button');
    btn.className = 'section-next-btn';
    btn.innerHTML = '<div class="section-next-arrow"></div>';
    btn.addEventListener('click', () => next.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    section.appendChild(btn);
  });
}

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
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        App.dotAnim?.transition('scatter');
        btnScatter?.classList.add('active');
        btnBars?.classList.remove('active');
        setTimeout(() => {
          App.dotAnim?.transition('bars');
          btnBars?.classList.add('active');
          btnScatter?.classList.remove('active');
        }, 700);
      }
    }, { threshold: 0.45 }).observe(section);
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
