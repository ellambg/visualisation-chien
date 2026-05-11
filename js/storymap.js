/**
 * storymap.js — Scrollytelling MapLibre GL JS
 * Deux instances : carte monde/europe/suisse + carte refuges
 */
import maplibregl from 'maplibre-gl';

// ── DONNEES CHAPITRES ──────────────────────────────────────────────────────

function buildWorldEuropeChapters() {
  return [
    {
      id: 'world-overview',
      section: 'world',
      label: 'À l\'échelle mondiale',
      camera: { center: [-20, 20], zoom: 1.5, pitch: 0, bearing: 0, duration: 1500 },
      card: {
        eyebrow: 'À l\'échelle mondiale',
        title: '~200 millions de chiens errants',
        body: 'L\'Organisation mondiale de la santé estime à <strong>200 millions</strong> le nombre de chiens errants dans le monde. D\'autres rapports parlent de <strong>360 millions d\'animaux</strong> de compagnie sans foyer.',
        source: 'OMS / FOUR PAWS 2023',
        sourceUrl: 'https://media.4-paws.org/9/0/c/0/90c06b6c9285bce0629257006d733be56b20f6ee/AR23_FR_Final_040924.pdf'
      }
    },
    {
      id: 'world-asia',
      section: 'world',
      activeZone: 'asia',
      label: 'À l\'échelle mondiale',
      camera: { center: [103, 30], zoom: 2.8, pitch: 20, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Asie',
        title: 'Corée du Sud, Japon, Singapour',
        body: '<div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.4rem">'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">Abandonnés / recueillis / an</span><br><strong>~105 000</strong> Corée du Sud · <strong>17 000</strong> Japon · <strong>285</strong> Singapour</div>'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">Chiens errants</span><br><strong>70 000</strong> Corée du Sud · <strong>10 000–20 000</strong> Japon</div>'
          + '</div>',
        source: 'WHO / AWBI · Asiae.co.kr · env.go.jp · CNA 2023',
        sourceUrl: 'https://media.4-paws.org/9/0/c/0/90c06b6c9285bce0629257006d733be56b20f6ee/AR23_FR_Final_040924.pdf'
      }
    },
    {
      id: 'world-americas',
      section: 'world',
      activeZone: 'americas',
      label: 'À l\'échelle mondiale',
      camera: { center: [-82, 18], zoom: 2.1, pitch: 20, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Amériques',
        title: 'Brésil, Mexique, États-Unis, Canada',
        body: '<div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.4rem">'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">Abandonnés / recueillis / an</span><br><strong>6,5M</strong> États-Unis · <strong>63 000</strong> Canada</div>'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">Chiens errants</span><br><strong>30M</strong> Brésil · <strong>15–18M</strong> Mexique</div>'
          + '<div style="font-size:0.75rem;color:#888;border-top:1px solid rgba(237,233,224,0.08);padding-top:0.5rem">En Amérique du Sud, le problème est avant tout celui des <em>chiens errants</em>. Aucune statistique fiable sur les abandons en refuge n\'existe à l\'échelle nationale.</div>'
          + '</div>',
        source: 'EnviroLiteracy / Gitnux / Reddit · FOUR PAWS 2023',
        sourceUrl: 'https://media.4-paws.org/9/0/c/0/90c06b6c9285bce0629257006d733be56b20f6ee/AR23_FR_Final_040924.pdf'
      }
    },
    {
      id: 'world-africa',
      section: 'world',
      activeZone: 'africa',
      label: 'À l\'échelle mondiale',
      camera: { center: [22, -5], zoom: 2.8, pitch: 20, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Afrique',
        title: 'Afrique du Sud',
        body: '<div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.4rem">'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">Chiens recueillis / an (estimation)</span><br><strong>~50 000</strong> chiens abandonnés ou saisis</div>'
          + '<div style="font-size:0.75rem;color:#888;border-top:1px solid rgba(237,233,224,0.08);padding-top:0.5rem">Seule l\'Afrique du Sud dispose de données documentées via son réseau SPCA (plus de 200 000 animaux (chiens et chats) recueillis chaque année). Pour le reste du continent, il n\'existe pas de statistiques fiables sur les abandons : le problème est avant tout celui des <em>chiens errants</em>, lié à la rage et à la santé publique.</div>'
          + '</div>',
        source: 'WHO 2023 / WSPA / FOUR PAWS 2022 / SPCA South Africa',
        sourceUrl: 'https://capespca.co.za/'
      }
    },
    {
      id: 'world-dubai',
      section: 'world',
      activeZone: 'dubai',
      label: 'À l\'échelle mondiale',
      camera: { center: [55.3, 25.2], zoom: 6, pitch: 30, bearing: -20, duration: 2500 },
      card: {
        eyebrow: 'Cas particulier',
        title: 'Dubaï : la fuite des expatriés',
        body: 'Les conflits qui secouent la région depuis 2023 poussent des expatriés à fuir précipitamment, <strong>laissant leurs animaux derrière eux</strong>. Chiffre estimé (aucun registre officiel).',
        source: '20 minutes / ONG locales (Dubai Shelter, SNIFF) 2024',
        sourceUrl: 'https://www.20min.ch/fr/story/conflit-au-moyen-orient-des-expats-fuient-dubai-et-abandonnent-leurs-animaux-de-compagnie-103522696'
      }
    },

    {
      id: 'europe-overview',
      section: 'europe',
      label: 'Focus Europe',
      camera: { center: [14, 52], zoom: 3, pitch: 0, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Focus Europe',
        title: 'Un continent, deux réalités',
        body: 'À l\'<strong>Ouest</strong> : des flux annuels d\'abandons gérés par des refuges. À l\'<strong>Est et au Sud</strong> : des populations entières de chiens errants, héritées de décennies de non-gestion.',
        source: 'FOUR PAWS / ESDAW 2024',
        sourceUrl: 'https://www.esdaw-eu.eu/the-stray-dogs-in-europe.html'
      }
    },
    {
      id: 'europe-east',
      section: 'europe',
      activeZone: 'europe-east',
      label: 'Focus Europe',
      camera: { center: [28, 43], zoom: 4.5, pitch: 20, bearing: 0, duration: 2000 },
      card: {
        eyebrow: 'Europe de l\'Est',
        title: 'Pas de données fiables',
        body: '<div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.4rem">'
          + '<div style="font-size:0.8rem;color:#888">En Europe de l\'Est, bien que la présence de chiens errants soit importante, il n\'existe pas de données nationales fiables permettant de mesurer précisément le nombre de chiens abandonnés chaque année. Les informations disponibles concernent principalement les populations de chiens errants et les actions de stérilisation mises en place par des ONG.</div>'
          + '</div>',
        source: 'Gouvernement turc / MDPI 2024 / PETA UK',
        sourceUrl: 'https://www.esdaw-eu.eu/the-stray-dogs-in-europe.html'
      }
    },
    {
      id: 'europe-west',
      section: 'europe',
      activeZone: 'europe-west',
      label: 'Focus Europe',
      camera: { center: [5, 45], zoom: 4.2, pitch: 20, bearing: 0, duration: 2000 },
      card: {
        eyebrow: 'Europe de l\'Ouest',
        title: 'France, Espagne, Italie, Allemagne',
        body: '<div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.4rem">'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">Abandonnés / an</span><br><strong>100 000</strong> France · <strong>100–140 000</strong> Espagne · <strong>~85 000</strong> Italie</div>'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">En refuge / an</span><br><strong>80–100 000</strong> Allemagne</div>'
          + '</div>',
        source: 'SPA / Fundación Affinity / Lega Nazionale / Deutscher Tierschutzbund / Dogs Trust',
        sourceUrl: 'https://www.fundacion-affinity.org/en/dogs-cats-and-people/yearly-study'
      }
    },
    {
      id: 'europe-uk',
      section: 'europe',
      activeZone: 'europe-uk',
      label: 'Focus Europe',
      camera: { center: [-4, 54], zoom: 5.5, pitch: 25, bearing: 0, duration: 2000 },
      card: {
        eyebrow: 'Îles britanniques',
        title: 'Royaume-Uni & Irlande',
        body: '<div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.4rem">'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">Chiens errants</span><br><strong>36 965</strong> Royaume-Uni (autorités locales 2023-2024)</div>'
          + '<div><span style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#888">En fourrière / an</span><br><strong>7 041</strong> Irlande, hausse des euthanasies faute de places.</div>'
          + '</div>',
        source: 'Dogs Trust UK 2024 / Dogs Trust Ireland 2024',
        sourceUrl: 'https://www.dogstrust.org.uk/about-us/what-we-do/research/stray-dogs-survey-research'
      }
    },
    {
      id: 'europe-netherlands',
      section: 'europe',
      activeZone: 'europe-west',
      label: 'Focus Europe',
      camera: { center: [5.3, 52.4], zoom: 7, pitch: 30, bearing: 0, duration: 2000 },
      card: {
        eyebrow: 'Un modèle',
        title: 'Pays-Bas : zéro chien errant',
        body: 'Les <strong>Pays-Bas</strong> ont quasiment éliminé les chiens errants grâce à des décennies de politique cohérente : <strong>microchip obligatoire</strong>, prise en charge immédiate, refuges structurés.',
        source: 'Diverses sources',
        sourceUrl: 'https://www.beatricesconseilscanins.fr/blog/les-pays-au-plus-taux-d-abandon-d-animaux-en-europe.html'
      }
    },
  ];
}

function buildSwissChapters() {
  return [
    {
      id: 'switzerland-overview',
      section: 'switzerland',
      label: 'La Suisse',
      camera: { center: [8.23, 46.82], zoom: 6.8, pitch: 20, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Chez nous',
        title: '1 826 chiens recueillis en 2024',
        body: 'La Protection Suisse des Animaux (PSA/STS) a recueilli <strong>32 079 animaux</strong> en 2024 dans ses 66 sections affiliées. Parmi eux, <strong>1 826 chiens</strong>, contre 865 l\'année précédente.',
        source: 'PSA / STS 2024',
        sourceUrl: 'https://tierschutz.com/fr/protection-des-animaux/statistique-psa-de-la-protection-des-animaux/'
      }
    },
    {
      id: 'switzerland-jump',
      section: 'switzerland',
      label: 'La Suisse',
      camera: { center: [8.2, 46.8], zoom: 8, pitch: 55, bearing: 15, duration: 1800 },
      card: {
        eyebrow: 'Hausse alarmante',
        title: '+111 % en un an',
        body: 'En un an, le nombre de chiens en refuge a <strong>plus que doublé</strong>. Achats impulsifs, coûts vétérinaires sous-estimés, lassitude : la Suisse n\'est plus à l\'abri de la crise.',
        source: 'PSA / STS 2024 / RTS / 24 heures',
        sourceUrl: 'https://www.rts.ch/info/suisse/2025/article/hausse-alarmante-des-abandons-d-animaux-en-suisse-25-000-cas-en-2024-29036370.html'
      }
    }
  ];
}

function buildShelterChapters(shelters) {
  const overview = {
    id: 'shelters-overview',
    section: 'shelters',
    label: 'Refuges en Suisse',
    camera: { center: [8.2, 46.6], zoom: 7.0, pitch: 20, bearing: 0, duration: 2000 },
    card: {
      eyebrow: 'Agir localement',
      title: 'Les refuges en Suisse',
      body: 'Ces 1 826 chiens ne sont pas une abstraction. Ils sont dans des refuges, partout en Suisse, avec un nom, un passé, et besoin d\'une famille.'
        + '<div class="shelter-mode-hint">'
        + '<div class="shelter-mode-option"><span class="shelter-mode-icon">→</span><div><strong>Explorer la carte</strong><br>Cliquez sur le bouton en haut à droite pour naviguer librement et cliquer directement sur le refuge de votre choix.</div></div>'
        + '<div class="shelter-mode-option"><span class="shelter-mode-icon">↓</span><div><strong>Mode guidé</strong><br>Continuez à scroller pour découvrir chaque refuge un par un à travers la Suisse.</div></div>'
        + '</div>',
    }
  };

  const individual = shelters.map((s, i) => ({
    id: 'shelter-' + i,
    section: 'shelters',
    label: 'Refuges en Suisse',
    camera: {
      center: [s.lng, s.lat],
      zoom: 13,
      pitch: 45,
      bearing: i % 2 === 0 ? -15 : 15,
      duration: 2000
    },
    card: {
      eyebrow: 'Refuge : ' + s.city,
      title: s.name,
      body: '<div class="shelter-detail">'
        + '<span>' + s.city + '</span>'
        + '<span>' + s.hours + '</span>'
        + '<span>' + s.phone + '</span>'
        + '<a href="' + s.website + '" target="_blank" rel="noopener">Visiter le refuge</a>'
        + '</div>',
    },
    highlightShelter: i
  }));

  return [overview, ...individual];
}

// ── CLASSE PRINCIPALE ──────────────────────────────────────────────────────

class StoryMap {
  constructor(data, opts) {
    // opts: { mapId, cardId, labelId, navSelector, scrollSelector, chapters }
    this.data     = data;
    this.opts     = opts;
    this.map      = null;
    this.chapters = opts.chapters;
    this.currentChapterId = null;
    this.init();
  }

  init() {
    this.map = new maplibregl.Map({
      container:        this.opts.mapId,
      style:            'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center:           this.chapters[0].camera.center,
      zoom:             this.chapters[0].camera.zoom,
      pitch:            this.chapters[0].camera.pitch || 0,
      bearing:          this.chapters[0].camera.bearing || 0,
      attributionControl: false,
      scrollZoom:       false,
      dragPan:          false,
      touchZoomRotate:  false,
      keyboard:         false,
      renderWorldCopies: false
    });

    this.map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left'
    );

    this.map.on('load', () => {
      const needsWorld    = this.chapters.some(c => c.section === 'world' || c.section === 'europe' || c.section === 'switzerland');
      const needsShelters = this.chapters.some(c => c.section === 'shelters');
      const needsSwissCities = this.chapters.some(c => c.section === 'switzerland');
      if (needsWorld)      this.addWorldLayer();
      if (needsShelters)   this.addShelterLayer();
      this.addSwissBorderLayer();
      if (needsSwissCities) this.addSwissCityLabels();

      if (this.opts.explorationOnly) {
        this.explorationMode = true;
        this.map.dragPan.enable();
        this.map.touchZoomRotate.enable();
        const cam = this.chapters[0]?.camera;
        if (cam) this.map.jumpTo({ center: cam.center, zoom: cam.zoom, pitch: cam.pitch || 0, bearing: cam.bearing || 0 });
        // Afficher le contour suisse directement
        if (this.map.getLayer('swiss-border-line')) {
          this.map.setLayoutProperty('swiss-border-fill', 'visibility', 'visible');
          this.map.setLayoutProperty('swiss-border-glow', 'visibility', 'visible');
          this.map.setLayoutProperty('swiss-border-line', 'visibility', 'visible');
        }
      } else {
        this.setupScroll();
        this.goToChapter(this.chapters[0]);
      }
    });

    // Clics nav dots
    const navSel = this.opts.navSelector;
    if (navSel) {
      document.querySelectorAll(navSel).forEach(dot => {
        dot.addEventListener('click', () => {
          const section = dot.dataset.section;
          const ch = this.chapters.find(c => c.section === section);
          if (!ch) return;
          const step = document.querySelector('[data-chapter="' + ch.id + '"]');
          if (step) step.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      });
    }
  }

  addWorldLayer() {
    const spots = [
      { country: 'Corée du Sud', coord: [127.7, 35.9], estimate: 105000,  strayEstimate: 70000, color: '#B2A5F3', zone: 'asia', dataType: 'abandoned' },
      { country: 'Japon',        coord: [138.0, 36.5], estimate: 17000,   strayEstimate: 15000, color: '#B2A5F3', zone: 'asia', dataType: 'shelter' },
      { country: 'Singapour',    coord: [103.8,  1.35],estimate: 285,     color: '#B2A5F3', zone: 'asia',  dataType: 'abandoned' },
      { country: 'Brésil',      coord: [-52,  -12],   estimate: 30000000, color: '#FF9A47', zone: 'americas', dataType: 'stray' },
      { country: 'Mexique',     coord: [-102,  23],   estimate: 16500000, color: '#FF9A47', zone: 'americas', dataType: 'stray' },
      { country: 'États-Unis',  coord: [-99,   40],   estimate: 6500000,  color: '#FF9A47', zone: 'americas', dataType: 'shelter' },
      { country: 'Canada',      coord: [-96,   56],   estimate: 63000,    color: '#FF9A47', zone: 'americas', dataType: 'shelter' },
      { country: 'Afrique du Sud', coord: [25, -29], estimate: 50000,    color: '#FF667A', zone: 'africa',       dataType: 'shelter' },
      { country: 'Espagne',     coord: [-3.7,  40.4], estimate: 120000,   color: '#c49a3e', zone: 'europe-west',  dataType: 'abandoned' },
      { country: 'France',      coord: [2.2,   46.2], estimate: 100000,   color: '#c49a3e', zone: 'europe-west',  dataType: 'abandoned' },
      { country: 'Italie',      coord: [12.5,  42.5], estimate: 85000,    color: '#c49a3e', zone: 'europe-west',  dataType: 'abandoned' },
      { country: 'Allemagne',   coord: [10.0,  51.2], estimate: 90000,    color: '#c49a3e', zone: 'europe-west',  dataType: 'shelter' },
      { country: 'Royaume-Uni', coord: [-2.0,  53.0], estimate: 36965,    color: '#c49a3e', zone: 'europe-uk',  dataType: 'stray' },
      { country: 'Irlande',     coord: [-7.7,  53.4], estimate: 7041,     color: '#c49a3e', zone: 'europe-uk',  dataType: 'shelter' },
      { country: 'Pays-Bas',    coord: [5.3,   52.4], estimate: 500,      color: '#029C70', zone: 'europe-west',  noData: true },
      { country: 'Suisse',      coord: [8.2,  46.8],  estimate: 1826,     color: '#c49a3e', zone: 'switzerland',  dataType: 'shelter' },
      { country: 'Dubaï',       coord: [55.3, 25.2],  estimate: 1000,     color: '#FF9A47', zone: 'dubai',        noData: true },
    ];

    this.map.addSource('world-spots', {
      type: 'geojson',
      generateId: true,
      data: {
        type: 'FeatureCollection',
        features: spots.map(s => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: s.coord },
          properties: { country: s.country, estimate: s.estimate, strayEstimate: s.strayEstimate || 0, dataType: s.dataType || 'stray', color: s.color, zone: s.zone, noData: s.noData || false }
        }))
      }
    });

    this.map.addLayer({
      id: 'world-circles',
      type: 'circle',
      source: 'world-spots',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['get', 'estimate'],
          500, 5, 50000, 8, 200000, 12, 1000000, 18, 10000000, 30, 35000000, 44
        ],
        'circle-color': ['get', 'color'],
        'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, 0.65],
        'circle-stroke-color': ['get', 'color'],
        'circle-stroke-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.5],
        'circle-stroke-opacity': 0.9
      }
    });

    this._setupWorldInteractions();

    this.map.addLayer({
      id: 'world-labels',
      type: 'symbol',
      source: 'world-spots',
      layout: {
        'text-field': ['get', 'country'],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 1, 8, 4, 11, 8, 13],
        'text-anchor': 'bottom',
        'text-offset': [
          'step', ['get', 'estimate'],
          ['literal', [0, -1.2]],
          100000,   ['literal', [0, -2.0]],
          1000000,  ['literal', [0, -3.0]],
          10000000, ['literal', [0, -4.2]],
          25000000, ['literal', [0, -5.5]]
        ],
        'text-allow-overlap': false,
        'text-ignore-placement': false
      },
      paint: {
        'text-color': ['get', 'color'],
        'text-halo-color': '#0c0c0c',
        'text-halo-width': 2,
        'text-opacity': ['interpolate', ['linear'], ['zoom'], 1, 0.6, 3, 1]
      }
    });
  }

  addShelterLayer() {
    const features = this.data.shelters.map((s, i) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
      properties: { name: s.name, city: s.city, hours: s.hours, phone: s.phone, website: s.website, index: i }
    }));

    this.map.addSource('shelters', {
      type: 'geojson',
      generateId: true,
      data: { type: 'FeatureCollection', features }
    });

    this.map.addImage('shelter-pin', this._createPinImage(), { pixelRatio: 2 });

    this.map.addLayer({
      id: 'shelter-circles',
      type: 'circle',
      source: 'shelters',
      layout: { 'visibility': 'none' },
      paint: {
        'circle-radius':       7,
        'circle-color':        '#B2A5F3',
        'circle-opacity':      0,
        'circle-stroke-color': '#0c0c0c',
        'circle-stroke-width': 0
      }
    });

    this.map.addLayer({
      id: 'shelter-halo',
      type: 'circle',
      source: 'shelters',
      filter: ['==', 'index', -1],
      paint: {
        'circle-radius':         28,
        'circle-color':          'transparent',
        'circle-stroke-color':   '#B2A5F3',
        'circle-stroke-width':   2,
        'circle-stroke-opacity': 0.5
      }
    });

    this.map.addLayer({
      id: 'shelter-pins',
      type: 'symbol',
      source: 'shelters',
      layout: {
        'icon-image':            'shelter-pin',
        'icon-size':             1,
        'icon-anchor':           'bottom',
        'icon-allow-overlap':    true,
        'icon-ignore-placement': true,
        'text-field':            ['get', 'city'],
        'text-font':             ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size':             11,
        'text-anchor':           'top',
        'text-offset':           [0, 0.35],
        'text-allow-overlap':    false,
        'text-optional':         true,
        'visibility':            'visible'
      },
      paint: {
        'icon-opacity':    ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.85],
        'text-color':      '#ede9e0',
        'text-halo-color': '#0c0c0c',
        'text-halo-width': 2,
        'text-opacity':    ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.7]
      }
    });

    this._setupShelterInteractions();
  }

  _createPinImage() {
    const W = 28, H = 40;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    const cx = W / 2, r = 12;

    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = '#B2A5F3';
    ctx.beginPath();
    ctx.arc(cx, r + 1, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - 6, r + 7);
    ctx.lineTo(cx, H - 2);
    ctx.lineTo(cx + 6, r + 7);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(12,12,12,0.85)';
    ctx.beginPath();
    ctx.arc(cx, r + 1, r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    return ctx.getImageData(0, 0, W, H);
  }

  _setupWorldInteractions() {
    let hoveredId = null;

    this.map.on('mouseenter', 'world-circles', (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (hoveredId !== null) {
          this.map.setFeatureState({ source: 'world-spots', id: hoveredId }, { hover: false });
        }
        hoveredId = e.features[0].id;
        this.map.setFeatureState({ source: 'world-spots', id: hoveredId }, { hover: true });
      }
    });

    this.map.on('mouseleave', 'world-circles', () => {
      this.map.getCanvas().style.cursor = '';
      if (hoveredId !== null) {
        this.map.setFeatureState({ source: 'world-spots', id: hoveredId }, { hover: false });
        hoveredId = null;
      }
    });

    this.map.on('click', 'world-circles', (e) => {
      if (!e.features.length) return;
      const { country, estimate, strayEstimate, color, noData, dataType } = e.features[0].properties;
      const coords = e.features[0].geometry.coordinates.slice();

      let content;
      if (noData) {
        const isDubai = country === 'Dubaï';
        content = '<div style="font-family:\'Encode Sans\',sans-serif;padding:0.2rem 0">'
          + '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:' + color + ';margin-bottom:0.5rem">' + country + '</div>'
          + (isDubai
            ? '<img src="assets/images/dubai.jpg" alt="Chien abandonné à Dubaï" style="width:100%;border-radius:6px;margin-bottom:0.5rem;display:block" />'
            + '<div style="font-size:0.78rem;color:#888">Chien abandonné suite à la fuite d\'expatriés</div>'
            : '')
          + '</div>';
      } else {
        const formatted = Number(estimate).toLocaleString('fr-CH');
        const typeLabel = dataType === 'shelter'   ? 'chiens recueillis en refuge / an'
                        : dataType === 'abandoned' ? 'abandons annuels estimés'
                        :                            'chiens errants estimés';
        content = '<div style="font-family:\'Encode Sans\',sans-serif;padding:0.2rem 0">'
          + '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:' + color + ';margin-bottom:0.3rem">' + country + '</div>'
          + '<div style="font-size:1.1rem;font-weight:700;color:#ede9e0">~' + formatted + '</div>'
          + '<div style="font-size:0.72rem;color:#888;margin-top:0.2rem">' + typeLabel + '</div>'
          + '</div>';
      }

      new maplibregl.Popup({ closeButton: true, maxWidth: noData && country === 'Dubaï' ? '240px' : '220px' })
        .setLngLat(coords)
        .setHTML(content)
        .addTo(this.map);
    });
  }

  _setZoneHighlight(zone) {
    if (!this.map.getLayer('world-circles')) return;

    if (!zone) {
      this.map.setPaintProperty('world-circles', 'circle-opacity',
        ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, 0.65]
      );
      this.map.setPaintProperty('world-circles', 'circle-stroke-width',
        ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.5]
      );
      this.map.setPaintProperty('world-labels', 'text-opacity',
        ['interpolate', ['linear'], ['zoom'], 1, 0.6, 3, 1]
      );
    } else {
      this.map.setPaintProperty('world-circles', 'circle-opacity',
        ['case',
          ['==', ['get', 'zone'], zone],
          ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, 0.85],
          0.12
        ]
      );
      this.map.setPaintProperty('world-circles', 'circle-stroke-width',
        ['case',
          ['==', ['get', 'zone'], zone],
          ['case', ['boolean', ['feature-state', 'hover'], false], 3, 1.5],
          0.5
        ]
      );
      this.map.setPaintProperty('world-labels', 'text-opacity',
        ['case', ['==', ['get', 'zone'], zone], 1, 0.15]
      );
    }
  }

  _setupShelterInteractions() {
    let hoveredId = null;

    const onEnter = (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (hoveredId !== null) {
          this.map.setFeatureState({ source: 'shelters', id: hoveredId }, { hover: false });
        }
        hoveredId = e.features[0].id;
        this.map.setFeatureState({ source: 'shelters', id: hoveredId }, { hover: true });
      }
    };

    const onLeave = () => {
      this.map.getCanvas().style.cursor = '';
      if (hoveredId !== null) {
        this.map.setFeatureState({ source: 'shelters', id: hoveredId }, { hover: false });
        hoveredId = null;
      }
    };

    const onClickFn = (e) => {
      if (!e.features.length) return;
      const { name, city, hours, phone, website } = e.features[0].properties;
      const coords = e.features[0].geometry.coordinates.slice();

      const content = '<div style="font-family:\'Encode Sans\',sans-serif;padding:0.2rem 0">'
        + '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:#B2A5F3;margin-bottom:0.5rem">' + city + '</div>'
        + '<div style="font-size:1rem;font-weight:700;color:#ede9e0;margin-bottom:0.6rem">' + name + '</div>'
        + (hours   ? '<div style="font-size:0.78rem;color:#888;margin-bottom:0.25rem">' + hours + '</div>' : '')
        + (phone   ? '<div style="font-size:0.78rem;color:#888;margin-bottom:0.25rem">' + phone + '</div>' : '')
        + (website ? '<a href="' + website + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:0.4rem;font-size:0.75rem;color:#B2A5F3;text-decoration:none">Visiter le refuge ↗</a>' : '')
        + '</div>';

      new maplibregl.Popup({ closeButton: true, maxWidth: '240px' })
        .setLngLat(coords)
        .setHTML(content)
        .addTo(this.map);
    };

    ['shelter-circles', 'shelter-pins'].forEach(layerId => {
      this.map.on('mouseenter', layerId, onEnter);
      this.map.on('mouseleave', layerId, onLeave);
      this.map.on('click',      layerId, onClickFn);
    });
  }

  addSwissBorderLayer() {
    this.map.addSource('swiss-border', {
      type: 'geojson',
      data: 'data/swiss-borders.geojson'
    });

    // Légère teinte dorée sur le territoire suisse
    this.map.addLayer({
      id: 'swiss-border-fill',
      type: 'fill',
      source: 'swiss-border',
      layout: { visibility: 'none' },
      paint: {
        'fill-color': '#c49a3e',
        'fill-opacity': 0.05
      }
    });

    // Halo extérieur (glow)
    this.map.addLayer({
      id: 'swiss-border-glow',
      type: 'line',
      source: 'swiss-border',
      layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' },
      paint: {
        'line-color': '#c49a3e',
        'line-width': 10,
        'line-blur':  7,
        'line-opacity': 0.3
      }
    });

    // Contours cantonaux nets
    this.map.addLayer({
      id: 'swiss-border-line',
      type: 'line',
      source: 'swiss-border',
      layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' },
      paint: {
        'line-color': '#c49a3e',
        'line-width': 1,
        'line-opacity': 0.65
      }
    });
  }

  addSwissCityLabels() {
    const cities = [
      { name: 'Genève',     coord: [6.1432,  46.2044] },
      { name: 'Lausanne',   coord: [6.6323,  46.5197] },
      { name: 'Lugano',     coord: [8.9511,  46.0037] },
      { name: 'Sion',       coord: [7.3601,  46.2330] },
      { name: 'Soleure',    coord: [7.5386,  47.2088] },
      { name: 'Berne',      coord: [7.4474,  46.9480] },
      { name: 'Zurich',     coord: [8.5417,  47.3769] },
      { name: 'Bâle',       coord: [7.5886,  47.5596] },
      { name: 'Lucerne',    coord: [8.3093,  47.0502] },
      { name: 'Fribourg',    coord: [7.1560,  46.8065] },
      { name: 'Saint-Gall',  coord: [9.3748,  47.4245] },
    ];

    this.map.addSource('swiss-cities', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: cities.map(c => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: c.coord },
          properties: { name: c.name }
        }))
      }
    });

    this.map.addLayer({
      id: 'swiss-city-dots',
      type: 'circle',
      source: 'swiss-cities',
      paint: {
        'circle-radius': 3.5,
        'circle-color': '#c49a3e',
        'circle-opacity': 0.85,
        'circle-stroke-color': '#0c0c0c',
        'circle-stroke-width': 1.5
      }
    });

    this.map.addLayer({
      id: 'swiss-city-labels',
      type: 'symbol',
      source: 'swiss-cities',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 11,
        'text-anchor': 'top',
        'text-offset': [0, 0.55],
        'text-allow-overlap': false,
        'text-ignore-placement': false
      },
      paint: {
        'text-color': '#ede9e0',
        'text-halo-color': '#0c0c0c',
        'text-halo-width': 2
      }
    });
  }

  goToChapter(chapter) {
    if (!chapter || chapter.id === this.currentChapterId) return;
    this.currentChapterId = chapter.id;

    this.map.flyTo({
      center:   chapter.camera.center,
      zoom:     chapter.camera.zoom,
      pitch:    chapter.camera.pitch   || 0,
      bearing:  chapter.camera.bearing || 0,
      duration: chapter.camera.duration || 2000,
      essential: true
    });

    // Visibilite layers (pour carte monde+europe+suisse)
    if (this.map.getLayer('world-circles')) {
      const showWorld = chapter.section === 'world' || chapter.section === 'europe';
      this.map.setLayoutProperty('world-circles', 'visibility', showWorld ? 'visible' : 'none');
      this.map.setLayoutProperty('world-labels',  'visibility', showWorld ? 'visible' : 'none');
      if (showWorld) this._setZoneHighlight(chapter.activeZone || null);
    }

    // Contour Suisse
    if (this.map.getLayer('swiss-border-line')) {
      const showSwiss = chapter.section === 'switzerland' || chapter.section === 'shelters';
      this.map.setLayoutProperty('swiss-border-fill', 'visibility', showSwiss ? 'visible' : 'none');
      this.map.setLayoutProperty('swiss-border-glow', 'visibility', showSwiss ? 'visible' : 'none');
      this.map.setLayoutProperty('swiss-border-line', 'visibility', showSwiss ? 'visible' : 'none');
    }

    // Shelters
    if (this.map.getLayer('shelter-circles')) {
      const shelterIdx = chapter.highlightShelter !== undefined ? chapter.highlightShelter : -1;
      this.map.setFilter('shelter-halo', ['==', 'index', shelterIdx]);
      this.map.setPaintProperty('shelter-circles', 'circle-radius',
        ['case', ['==', ['get', 'index'], shelterIdx], 12, 7]
      );
      this.map.setPaintProperty('shelter-circles', 'circle-opacity',
        ['case', ['==', ['get', 'index'], shelterIdx], 1, 0.45]
      );
    }

    this.updateCard(chapter.card);

    // Label
    const labelEl = this.opts.labelId ? document.getElementById(this.opts.labelId) : null;
    if (labelEl) labelEl.textContent = chapter.label || '';

    // Nav dots
    if (this.opts.navSelector) {
      document.querySelectorAll(this.opts.navSelector).forEach(dot => {
        dot.classList.toggle('active', dot.dataset.section === chapter.section);
      });
    }
  }

  updateCard(card) {
    const el = this.opts.cardId ? document.getElementById(this.opts.cardId) : null;
    if (!el) return;
    el.classList.remove('card-visible');
    setTimeout(() => {
      el.querySelector('.card-eyebrow').textContent = card.eyebrow;
      el.querySelector('.card-title').textContent   = card.title;
      el.querySelector('.card-body').innerHTML      = card.body;
      const sourceEl = el.querySelector('.card-source');
      if (card.source || card.sourceUrl) {
        sourceEl.textContent = 'Consulter les sources à la fin';
      } else {
        sourceEl.textContent = '';
      }
      el.classList.add('card-visible');
    }, 180);
  }

  setupScroll() {
    if (this.opts.explorationOnly) return;
    if (!this.opts.scrollSelector) {
      this.map.dragPan.enable();
      return;
    }
    this.explorationMode = false;
    const steps = Array.from(document.querySelectorAll(this.opts.scrollSelector));
    this._scrollContainer = steps[0]?.parentElement || null;

    let lastTriggeredId = null;

    const onScroll = () => {
      if (this.explorationMode) return;
      const vh = window.innerHeight;
      let best = null, bestRatio = -1;
      steps.forEach(step => {
        const rect = step.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        const ratio = visible / vh;
        if (ratio > bestRatio) { bestRatio = ratio; best = step; }
      });
      if (!best || bestRatio < 0.1) return;
      const id = best.dataset.chapter;
      if (id === lastTriggeredId) return;
      lastTriggeredId = id;
      this.currentChapterId = null; // force re-animation à chaque changement
      const ch = this.chapters.find(c => c.id === id);
      if (ch) this.goToChapter(ch);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    if (this.opts.exploreBtnId) this.setupExploreToggle();
  }

  setupExploreToggle() {
    const btn = document.getElementById(this.opts.exploreBtnId);
    if (!btn) return;
    const label = btn.querySelector('span');
    const sc = this._scrollContainer;

    btn.addEventListener('click', () => {
      this.explorationMode = !this.explorationMode;

      if (this.explorationMode) {
        // Remonter en haut de la section avant de réduire (évite le saut visuel)
        const section = btn.closest('section');
        if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });

        // Réduire la section à ~100vh : supprimer le margin négatif + hauteur nulle
        if (sc) {
          sc.style.marginTop = '0';
          sc.style.height    = '0';
          sc.style.overflow  = 'hidden';
        }

        this.map.dragPan.enable();
        this.map.touchZoomRotate.enable();
        this.map.flyTo({ center: [8.2, 46.8], zoom: 7.5, pitch: 20, bearing: 0, duration: 900 });

        this.map.setLayoutProperty('shelter-halo', 'visibility', 'none');

        this.updateCard({
          eyebrow: 'Mode exploration',
          title: 'Cliquez sur un refuge',
          body: 'Naviguez librement. Cliquez sur une épingle pour voir les informations du refuge.',
        });
        label.textContent = '← Mode guidé';
        btn.classList.add('is-explore');

      } else {
        // Restaurer les steps pour le scrollytelling
        if (sc) {
          sc.style.marginTop = '';
          sc.style.height    = '';
          sc.style.overflow  = '';
        }

        this.map.setLayoutProperty('shelter-halo', 'visibility', 'visible');

        this.map.dragPan.disable();
        this.map.touchZoomRotate.disable();

        label.textContent = 'Explorer la carte';
        btn.classList.remove('is-explore');

        // Remettre au début de la section pour parcourir chaque refuge
        this.currentChapterId = null;
        const section = btn.closest('section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

export { StoryMap, buildWorldEuropeChapters, buildSwissChapters, buildShelterChapters };
