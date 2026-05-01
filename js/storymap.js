/**
 * storymap.js — Scrollytelling MapLibre GL JS
 * Deux instances : carte monde/europe/suisse + carte refuges
 */

// ── DONNEES CHAPITRES ──────────────────────────────────────────────────────

function buildWorldEuropeChapters() {
  return [
    {
      id: 'world-overview',
      section: 'world',
      label: 'A l\'echelle mondiale',
      camera: { center: [0, 20], zoom: 1.5, pitch: 0, bearing: 0, duration: 1500 },
      card: {
        eyebrow: 'A l\'echelle mondiale',
        title: '~200 millions de chiens errants',
        body: 'L\'Organisation mondiale de la sante estime a <strong>200 millions</strong> le nombre de chiens errants dans le monde. D\'autres rapports parlent de <strong>360 millions d\'animaux</strong> de compagnie sans foyer.',
        source: 'OMS / FOUR PAWS 2023',
        sourceUrl: 'https://media.4-paws.org/9/0/c/0/90c06b6c9285bce0629257006d733be56b20f6ee/AR23_FR_Final_040924.pdf'
      }
    },
    {
      id: 'world-asia',
      section: 'world',
      activeZone: 'asia',
      label: 'A l\'echelle mondiale',
      camera: { center: [95, 28], zoom: 3, pitch: 20, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Asie',
        title: 'Inde & Chine : 62 millions',
        body: 'L\'<strong>Inde</strong> recense jusqu\'a <strong>35 millions</strong> de chiens errants, la <strong>Chine</strong> <strong>27 millions</strong>. Ces chiffres representent plus du tiers du total mondial.',
        source: 'WHO / AWBI 2023 — CNAH 2022',
        sourceUrl: 'https://media.4-paws.org/9/0/c/0/90c06b6c9285bce0629257006d733be56b20f6ee/AR23_FR_Final_040924.pdf'
      }
    },
    {
      id: 'world-americas',
      section: 'world',
      activeZone: 'americas',
      label: 'A l\'echelle mondiale',
      camera: { center: [-75, 5], zoom: 2.5, pitch: 20, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Ameriques',
        title: 'Bresil, Mexique, Etats-Unis',
        body: 'Le <strong>Bresil</strong> compte <strong>30 millions</strong> de chiens errants, le <strong>Mexique</strong> <strong>20 millions</strong>. Meme les Etats-Unis voient <strong>3,1 millions d\'animaux</strong> entrer en refuge chaque annee.',
        source: 'Instituto Pet Brasil / INEGI / ASPCA 2023',
        sourceUrl: 'https://media.4-paws.org/9/0/c/0/90c06b6c9285bce0629257006d733be56b20f6ee/AR23_FR_Final_040924.pdf'
      }
    },
    {
      id: 'world-africa',
      section: 'world',
      activeZone: 'africa',
      label: 'A l\'echelle mondiale',
      camera: { center: [22, 8], zoom: 3.2, pitch: 20, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Afrique',
        title: 'Ethiopie & Nigeria : 14 millions',
        body: 'L\'<strong>Ethiopie</strong> et le <strong>Nigeria</strong> depassent chacun les <strong>7 millions</strong> de chiens errants. Un probleme de sante publique majeur, etroitement lie a la rage.',
        source: 'WHO estimate 2023 — WSPA / FOUR PAWS 2022',
        sourceUrl: 'https://media.4-paws.org/9/0/c/0/90c06b6c9285bce0629257006d733be56b20f6ee/AR23_FR_Final_040924.pdf'
      }
    },
    {
      id: 'world-dubai',
      section: 'world',
      activeZone: 'dubai',
      label: 'A l\'echelle mondiale',
      camera: { center: [55.3, 25.2], zoom: 6, pitch: 30, bearing: -20, duration: 2500 },
      card: {
        eyebrow: 'Cas particulier',
        title: 'Dubai : la fuite des expatries',
        body: 'Les conflits qui secouent la region depuis 2023 poussent des expatries a fuir precipitamment, <strong>laissant leurs animaux derriere eux</strong>. Chiffre estime — aucun registre officiel.',
        source: 'ONG locales (Dubai Shelter, SNIFF) 2024'
      }
    },

    {
      id: 'europe-overview',
      section: 'europe',
      label: 'Focus Europe',
      camera: { center: [14, 52], zoom: 3, pitch: 0, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Focus Europe',
        title: 'Un continent, deux realites',
        body: 'A l\'<strong>Ouest</strong> : des flux annuels d\'abandons geres par des refuges. A l\'<strong>Est et au Sud</strong> : des populations entieres de chiens errants, heritees de decennies de non-gestion.',
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
        title: 'Turquie, Grece, Roumanie',
        body: 'La <strong>Turquie</strong> : 4 millions de chiens errants, loi de capture adoptee en 2024. La <strong>Grece</strong> : 3 millions. La <strong>Roumanie</strong> : 500 000-600 000 — heritage du regime Ceausescu.',
        source: 'Gouvernement turc / MDPI 2024 / PETA UK',
        sourceUrl: 'https://www.esdaw-eu.eu/the-stray-dogs-in-europe.html'
      }
    },
    {
      id: 'europe-west',
      section: 'europe',
      activeZone: 'europe-west',
      label: 'Focus Europe',
      camera: { center: [2, 45], zoom: 4.5, pitch: 20, bearing: 0, duration: 2000 },
      card: {
        eyebrow: 'Europe de l\'Ouest',
        title: 'France, Espagne, Belgique',
        body: 'La <strong>France</strong> : ~100 000 abandons/an. L\'<strong>Espagne</strong> : 173 000 chiens recueillis en 2023. La <strong>Belgique</strong> qualifie 2023 d\'annee noire avec 165 abandons par jour.',
        source: 'SPA / Fundacion Affinity / Bien-etre Animal Wallonie',
        sourceUrl: 'https://www.fundacion-affinity.org/fr/sensibilisation/il-ne-le-ferait-jamais-etude-sur-labandon-et-ladoption-2024'
      }
    },
    {
      id: 'europe-netherlands',
      section: 'europe',
      activeZone: 'europe-west',
      label: 'Focus Europe',
      camera: { center: [5.3, 52.4], zoom: 7, pitch: 30, bearing: 0, duration: 2000 },
      card: {
        eyebrow: 'Un modele',
        title: 'Pays-Bas : zero chien errant',
        body: 'Les <strong>Pays-Bas</strong> ont quasiment elimine les chiens errants grace a des decennies de politique coherente : <strong>microchip obligatoire</strong>, prise en charge immediate, refuges structures.',
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
      camera: { center: [8.2, 46.8], zoom: 7, pitch: 40, bearing: 0, duration: 2500 },
      card: {
        eyebrow: 'Chez nous',
        title: '1 826 chiens recueillis en 2024',
        body: 'La Protection Suisse des Animaux (PSA/STS) a recueilli <strong>32 079 animaux</strong> en 2024 dans ses 66 sections affiliees. Parmi eux, <strong>1 826 chiens</strong> — contre 865 l\'annee precedente.',
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
        body: 'En un an, le nombre de chiens en refuge a <strong>plus que double</strong>. Achats impulsifs, couts veterinaires sous-estimes, lassitude : la Suisse n\'est plus a l\'abri de la crise.',
        source: 'PSA / STS 2024 — RTS / 24 heures',
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
    camera: { center: [8.2, 46.8], zoom: 7.5, pitch: 35, bearing: 0, duration: 2000 },
    card: {
      eyebrow: 'Agir localement',
      title: 'Les refuges en Suisse',
      body: 'Ces 1 826 chiens ne sont pas une abstraction. Ils sont dans des refuges, partout en Suisse, avec un nom, un passé, et besoin d\'une famille.'
        + '<div class="shelter-mode-hint">'
        + '<div class="shelter-mode-option"><span class="shelter-mode-icon">🗺️</span><div><strong>Explorer la carte</strong><br>Cliquez sur le bouton en haut à droite pour naviguer librement et cliquer directement sur le refuge de votre choix.</div></div>'
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
      eyebrow: 'Refuge — ' + s.city,
      title: s.name,
      body: '<div class="shelter-detail">'
        + '<span>📍 ' + s.city + '</span>'
        + '<span>🕐 ' + s.hours + '</span>'
        + '<span>📞 ' + s.phone + '</span>'
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
      keyboard:         false
    });

    this.map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left'
    );

    this.map.on('load', () => {
      const needsWorld    = this.chapters.some(c => c.section === 'world' || c.section === 'europe' || c.section === 'switzerland');
      const needsShelters = this.chapters.some(c => c.section === 'shelters');
      if (needsWorld)    this.addWorldLayer();
      if (needsShelters) this.addShelterLayer();
      this.addSwissBorderLayer();
      this.setupScroll();
      this.goToChapter(this.chapters[0]);
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
      { country: 'Inde',       coord: [80,    22],   estimate: 35000000, color: '#6699cc', zone: 'asia' },
      { country: 'Chine',      coord: [104,   34],   estimate: 27000000, color: '#6699cc', zone: 'asia' },
      { country: 'Bresil',     coord: [-52,  -12],   estimate: 30000000, color: '#7a8a3a', zone: 'americas' },
      { country: 'Mexique',    coord: [-102,  23],   estimate: 20000000, color: '#7a8a3a', zone: 'americas' },
      { country: 'Etats-Unis', coord: [-99,   40],   estimate: 3100000,  color: '#7a8a3a', zone: 'americas' },
      { country: 'Ethiopie',   coord: [40,    10],   estimate: 7000000,  color: '#c49a3e', zone: 'africa' },
      { country: 'Nigeria',    coord: [8,      9],   estimate: 7000000,  color: '#c49a3e', zone: 'africa' },
      { country: 'Turquie',    coord: [35,    39],   estimate: 4000000,  color: '#c49a3e', zone: 'europe-east' },
      { country: 'Suisse',     coord: [8.2,  46.8],  estimate: 1826,     color: '#c49a3e', zone: 'switzerland' },
      { country: 'Dubai',      coord: [55.3, 25.2],  estimate: 1000,     color: '#6699cc', zone: 'dubai', noData: true },
      { country: 'Grece',      coord: [22,    39],   estimate: 3000000,  color: '#c49a3e', zone: 'europe-east' },
      { country: 'Roumanie',   coord: [25,    46],   estimate: 500000,   color: '#c49a3e', zone: 'europe-east' },
      { country: 'Espagne',    coord: [-3.7,  40.4], estimate: 173000,   color: '#c49a3e', zone: 'europe-west' },
      { country: 'France',     coord: [2.2,   46.2], estimate: 100000,   color: '#c49a3e', zone: 'europe-west' },
      { country: 'Belgique',   coord: [4.5,   50.8], estimate: 60000,    color: '#c49a3e', zone: 'europe-west' },
      { country: 'Pays-Bas',   coord: [5.3,   52.4], estimate: 500,      color: '#7a8a3a', zone: 'europe-west', noData: true },
    ];

    this.map.addSource('world-spots', {
      type: 'geojson',
      generateId: true,
      data: {
        type: 'FeatureCollection',
        features: spots.map(s => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: s.coord },
          properties: { country: s.country, estimate: s.estimate, color: s.color, zone: s.zone, noData: s.noData || false }
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
        'circle-color':        '#c49a3e',
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
        'circle-stroke-color':   '#c49a3e',
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

    ctx.fillStyle = '#c49a3e';
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
      const { country, estimate, color, noData } = e.features[0].properties;
      const coords = e.features[0].geometry.coordinates.slice();

      let content;
      if (noData) {
        content = '<div style="font-family:\'Encode Sans\',sans-serif;padding:0.2rem 0">'
          + '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:' + color + ';margin-bottom:0.5rem">' + country + '</div>'
          + '<div style="font-size:0.8rem;color:#888;font-style:italic">Image à venir</div>'
          + '</div>';
      } else {
        const formatted = Number(estimate).toLocaleString('fr-CH');
        content = '<div style="font-family:\'Encode Sans\',sans-serif;padding:0.2rem 0">'
          + '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:' + color + ';margin-bottom:0.3rem">' + country + '</div>'
          + '<div style="font-size:1.1rem;font-weight:700;color:#ede9e0">~' + formatted + '</div>'
          + '<div style="font-size:0.72rem;color:#888;margin-top:0.2rem">chiens errants estimés</div>'
          + '</div>';
      }

      new maplibregl.Popup({ closeButton: true, maxWidth: '220px' })
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
        + '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:#c49a3e;margin-bottom:0.5rem">' + city + '</div>'
        + '<div style="font-size:1rem;font-weight:700;color:#ede9e0;margin-bottom:0.6rem">' + name + '</div>'
        + (hours   ? '<div style="font-size:0.78rem;color:#888;margin-bottom:0.25rem">🕐 ' + hours + '</div>' : '')
        + (phone   ? '<div style="font-size:0.78rem;color:#888;margin-bottom:0.25rem">📞 ' + phone + '</div>' : '')
        + (website ? '<a href="' + website + '" target="_blank" rel="noopener" style="display:inline-block;margin-top:0.4rem;font-size:0.75rem;color:#c49a3e;text-decoration:none">Visiter le refuge ↗</a>' : '')
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
    const swissCoords = [
      [5.96, 46.13],
      [6.50, 46.14],
      [6.84, 46.38],
      [7.00, 45.93],
      [7.56, 45.89],
      [8.13, 45.86],
      [8.46, 46.00],
      [8.95, 45.83],
      [9.23, 46.25],
      [9.52, 46.17],
      [10.07, 46.21],
      [10.49, 46.86],
      [9.52, 47.07],
      [9.63, 47.35],
      [9.54, 47.55],
      [9.20, 47.66],
      [8.74, 47.70],
      [8.57, 47.81],
      [8.10, 47.76],
      [7.59, 47.58],
      [7.22, 47.50],
      [6.86, 47.44],
      [6.45, 46.89],
      [6.16, 46.52],
      [5.96, 46.13]
    ];

    this.map.addSource('swiss-border', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [swissCoords] },
        properties: {}
      }
    });

    this.map.addLayer({
      id: 'swiss-border-glow',
      type: 'line',
      source: 'swiss-border',
      layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' },
      paint: {
        'line-color': '#c49a3e',
        'line-width': 12,
        'line-blur': 8,
        'line-opacity': 0.35
      }
    });

    this.map.addLayer({
      id: 'swiss-border-line',
      type: 'line',
      source: 'swiss-border',
      layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' },
      paint: {
        'line-color': '#c49a3e',
        'line-width': 2,
        'line-opacity': 0.9
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
      const showSwiss = chapter.section === 'switzerland';
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
      if (card.source && card.sourceUrl) {
        sourceEl.innerHTML = '<a href="' + card.sourceUrl + '" target="_blank" rel="noopener">Source : ' + card.source + '</a>';
      } else if (card.source) {
        sourceEl.textContent = 'Source : ' + card.source;
      } else {
        sourceEl.textContent = '';
      }
      el.classList.add('card-visible');
    }, 180);
  }

  setupScroll() {
    this.explorationMode = false;
    const steps = document.querySelectorAll(this.opts.scrollSelector);
    this._scrollContainer = steps[0]?.parentElement || null;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (this.explorationMode) return;
        const id = entry.target.dataset.chapter;
        const ch = this.chapters.find(c => c.id === id);
        if (ch) this.goToChapter(ch);
      });
    }, { threshold: 0.5 });

    steps.forEach(step => observer.observe(step));

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

window.StorymapModule = { StoryMap, buildWorldEuropeChapters, buildSwissChapters, buildShelterChapters };
