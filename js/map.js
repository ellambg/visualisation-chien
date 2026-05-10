/**
 * map.js — Cartes : monde (D3), Europe (D3 choroplèthe), Suisse (Leaflet), Refuges (Leaflet)
 */

// ── CARTE MONDE ───────────────────────────────────────────────────────────
function initWorldMap(data) {
  const el = document.getElementById('world-map');
  if (!el) return;
  const W = el.clientWidth, H = el.clientHeight || 440;

  const svg = d3.select('#world-map').append('svg').attr('width', W).attr('height', H);
  const proj = d3.geoNaturalEarth1().scale(W / 6.3).translate([W / 2, H / 1.95]);
  const path = d3.geoPath().projection(proj);

  svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#0c0c0c');
  svg.append('path').datum(d3.geoGraticule()())
    .attr('d', path).attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.03)').attr('stroke-width', 0.5);

  const continentColors = {
    'Asie':          '#d45a2a',
    'Amér. du Nord': '#6c9e6c',
    'Amér. du Sud':  '#6c9e6c',
    'Afrique':       '#c49a3e',
    'Europe':        '#e8a020',
    'Océanie':       '#6c9e9e',
  };

  // Pays les plus touchés par continent (estimation chiens errants / abandonnés)
  const spots = [
    { country: 'Inde',       continent: 'Asie',          coord: [80,  22],   estimate: 35000000, label: '35M',     dx:  34, dy:  -4, anchor: 'start', source: 'WHO / AWBI 2023' },
    { country: 'Chine',      continent: 'Asie',          coord: [104, 34],   estimate: 27000000, label: '27M',     dx:  30, dy:  -4, anchor: 'start', source: 'CNAH 2022' },
    { country: 'Brésil',     continent: 'Amér. du Sud',  coord: [-52, -12],  estimate: 30000000, label: '30M',     dx:  32, dy:  -4, anchor: 'start', source: 'Instituto Pet Brasil 2019' },
    { country: 'Mexique',    continent: 'Amér. du Nord', coord: [-102, 23],  estimate: 20000000, label: '20M',     dx: -28, dy:  -4, anchor: 'end',   source: 'INEGI / UNAM 2021' },
    { country: 'États-Unis', continent: 'Amér. du Nord', coord: [-99,  40],  estimate: 3100000,  label: '3,1M/an', dx: -14, dy: -22, anchor: 'end',   source: 'ASPCA 2023', note: 'flux annuel entrant en refuge' },
    { country: 'Éthiopie',   continent: 'Afrique',       coord: [40,  10],   estimate: 7500000,  label: '7,5M',    dx:  18, dy:  -4, anchor: 'start', source: 'WHO estimate 2023' },
    { country: 'Nigéria',    continent: 'Afrique',       coord: [8,    9],   estimate: 7000000,  label: '7M',      dx: -18, dy:  -4, anchor: 'end',   source: 'WSPA / FOUR PAWS 2022' },
    { country: 'Turquie',    continent: 'Europe',        coord: [35,  39],   estimate: 4000000,  label: '4M',      dx:  16, dy: -18, anchor: 'start', source: 'Min. Agriculture Turquie 2024' },
    { country: 'Australie',  continent: 'Océanie',       coord: [134, -26],  estimate: 200000,   label: '200k/an', dx:  12, dy:  -4, anchor: 'start', source: 'RSPCA Australia 2023', note: 'flux annuel entrant en refuge' },
    { country: 'Suisse',     continent: 'Europe',        coord: [8.2, 46.8], estimate: 1826,     label: '1 826',   dx:  10, dy: -12, anchor: 'start', highlight: true, source: 'PSA/STS 2024' },
    { country: 'Dubaï', continent: 'Asie',         coord: [55.3, 25.2], estimate: 2000,    label: 'Dubaï', dx: 12, dy: -8, anchor: 'start', source: 'ONG locales (Dubai Shelter, SNIFF)', note: 'Cas particulier lié aux conflits régionaux : des expatriés fuient précipitamment et laissent leurs animaux. Chiffre estimé, pas de registre officiel.' },
  ];

  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json()).then(world => {
      const countries = topojson.feature(world, world.objects.countries);
      svg.selectAll('.wc').data(countries.features).enter().append('path')
        .attr('class', 'wc').attr('d', path)
        .attr('fill', '#1c1c1c').attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-width', 0.4);

      const infoEl = document.getElementById('world-info');

      spots.forEach(s => {
        const [cx, cy] = proj(s.coord);
        if (cx == null || isNaN(cx)) return;
        const color = s.highlight ? '#e8a020' : (continentColors[s.continent] || '#888');
        const r = s.highlight ? 4 : Math.max(4, Math.sqrt(s.estimate / 1000000) * 5);

        const g = svg.append('g')
          .attr('transform', `translate(${cx},${cy})`)
          .style('cursor', 'pointer');

        // Anneau pulsant Suisse
        if (s.highlight) {
          g.append('circle').attr('r', 12).attr('fill', 'none')
            .attr('stroke', '#e8a020').attr('stroke-width', 1.5).attr('opacity', 0.4)
            .append('animate').attr('attributeName', 'r')
            .attr('from', 6).attr('to', 16).attr('dur', '2s').attr('repeatCount', 'indefinite');
        }

        const circle = g.append('circle')
          .attr('r', r)
          .attr('fill', color).attr('opacity', s.highlight ? 1 : 0.55)
          .attr('stroke', color).attr('stroke-width', 0.8);

        // Étiquette : nom du pays uniquement
        const lg = g.append('g').attr('transform', `translate(${s.dx},${s.dy})`);
        lg.append('text')
          .attr('text-anchor', s.anchor)
          .attr('fill', color)
          .attr('font-size', s.highlight ? '10px' : '9px')
          .attr('font-family', 'DM Sans, sans-serif').attr('font-weight', '500')
          .text(s.country);

        // Hover
        g.on('mouseover', () => circle.attr('opacity', 0.9))
         .on('mouseleave', () => circle.attr('opacity', s.highlight ? 1 : 0.55));

        // Clic → panneau d'info
        g.on('click', () => {
          if (!infoEl) return;
          infoEl.innerHTML = `
            <div class="world-info-continent" style="color:${color}">${s.continent}</div>
            <div class="world-info-country">${s.country}</div>
            <div class="world-info-row">
              <span class="world-info-label">Chiens errants / abandonnés</span>
              <span class="world-info-value">${s.estimate.toLocaleString('fr-CH')}</span>
            </div>
            ${s.note ? `<div class="world-info-note">ⓘ ${s.note}</div>` : ''}
            <div class="world-info-source">Source : ${s.source}</div>
          `;
          infoEl.classList.add('visible');
          infoEl.querySelector('.world-info-close-area')
            ?.addEventListener('click', () => infoEl.classList.remove('visible'), { once: true });
        });
      });

      // Badge 200M
      const bg = svg.append('g').attr('transform', 'translate(16,16)');
      bg.append('rect').attr('width', 210).attr('height', 50).attr('rx', 6)
        .attr('fill', 'rgba(232,160,32,0.1)').attr('stroke', 'rgba(232,160,32,0.3)').attr('stroke-width', 1);
      bg.append('text').attr('x', 12).attr('y', 22)
        .attr('fill', '#e8a020').attr('font-size', '19px').attr('font-weight', '700')
        .attr('font-family', 'Playfair Display, serif').text('~200 millions');
      bg.append('text').attr('x', 12).attr('y', 39)
        .attr('fill', '#7a756c').attr('font-size', '10px').attr('font-family', 'DM Sans, sans-serif')
        .text('chiens errants dans le monde (OMS)');

      // Légende continents
      const legendEl = document.getElementById('world-legend');
      if (legendEl) {
        const continents = [
          { label: 'Asie',      color: '#d45a2a' },
          { label: 'Amériques', color: '#6c9e6c' },
          { label: 'Afrique',   color: '#c49a3e' },
          { label: 'Europe',    color: '#e8a020' },
          { label: 'Océanie',   color: '#6c9e9e' },
        ];
        legendEl.innerHTML = continents.map(c => `
          <div class="world-legend-item">
            <div class="world-legend-dot" style="background:${c.color}"></div>
            <span>${c.label}</span>
          </div>
        `).join('');
      }

    }).catch(() => {});
}

// ── CARTE EUROPE (choroplèthe) ────────────────────────────────────────────
function initEuropeMap(data) {
  const el = document.getElementById('europe-map');
  if (!el) return;
  const W = el.clientWidth, H = el.clientHeight || 420;

  const svg = d3.select('#europe-map').append('svg').attr('width', W).attr('height', H);
  const proj = d3.geoMercator().center([14, 52]).scale(W * 1.05).translate([W/2, H/2]);
  const path = d3.geoPath().projection(proj);
  const tooltip = d3.select('#europe-tooltip');

  svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#0c0c0c');

  // Map code → data
  const byCode = {};
  data.europe.countries.forEach(d => { byCode[d.code] = d; });

  // ISO numérique → code alpha
  const isoMap = {
    '300':'GR','642':'RO','792':'TR','804':'UA','688':'RS','620':'PT',
    '724':'ES','250':'FR','380':'IT','276':'DE','056':'BE','826':'GB',
    '372':'IE','756':'CH','528':'NL','040':'AT','208':'DK','724':'ES',
    '752':'SE','578':'NO','246':'FI','616':'PL','100':'BG','498':'MD'
  };

  // Échelle de couleur — gris neutre pour pays sans données, orange pour ceux avec
  const colorScale = d3.scaleSequential()
    .domain([0, 1]).interpolator(d3.interpolate('#1e1e1e', '#e8a020'));

  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json()).then(world => {
      const countries = topojson.feature(world, world.objects.countries);

      let selectedPath = null;

      const paths = svg.selectAll('.ec').data(countries.features).enter().append('path')
        .attr('class', 'ec').attr('d', path)
        .attr('fill', d => {
          const code = isoMap[String(d.id).padStart(3,'0')];
          const cd = byCode[code];
          return cd ? colorScale(cd.color_intensity) : '#1a1a1a';
        })
        .attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5)
        .style('cursor', d => {
          const code = isoMap[String(d.id).padStart(3,'0')];
          return byCode[code] ? 'pointer' : 'default';
        })
        .on('mouseover', function(event, d) {
          const code = isoMap[String(d.id).padStart(3,'0')];
          if (!byCode[code]) return;
          if (this !== selectedPath) {
            d3.select(this).attr('stroke', 'rgba(232,160,32,0.6)').attr('stroke-width', 1.2);
          }
        })
        .on('mouseleave', function() {
          if (this !== selectedPath) {
            d3.select(this).attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5);
          }
        })
        .on('click', function(event, d) {
          const code = isoMap[String(d.id).padStart(3,'0')];
          const cd = byCode[code];
          if (!cd) return;

          // Désélectionner l'ancien pays
          if (selectedPath) {
            d3.select(selectedPath)
              .attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5);
          }

          if (selectedPath === this) {
            // Deuxième clic sur le même pays → fermer
            selectedPath = null;
            document.getElementById('europe-info').classList.remove('visible');
            return;
          }

          selectedPath = this;
          d3.select(this).attr('stroke', '#e8a020').attr('stroke-width', 2);

          // Afficher le panneau d'info
          const panel = document.getElementById('europe-info');
          panel.innerHTML = `
            <button class="europe-info-close" onclick="
              document.getElementById('europe-info').classList.remove('visible');
              document.querySelectorAll('.ec').forEach(p => {
                p.setAttribute('stroke','rgba(255,255,255,0.08)');
                p.setAttribute('stroke-width','0.5');
              });
            ">✕</button>
            <div class="europe-info-country">${cd.country}</div>
            <div class="europe-info-row">
              <span class="europe-info-label">Chiens / 100 000 hab.</span>
              <span class="europe-info-value">${cd.dogs_per_100k}</span>
            </div>
            <div class="europe-info-row">
              <span class="europe-info-label">Total estimé</span>
              <span class="europe-info-value">${cd.total_estimate.toLocaleString('fr-CH')}</span>
            </div>
            ${cd.note ? `<div class="europe-info-note">${cd.note}</div>` : ''}
            <div class="europe-info-source">Source : ${cd.source}</div>
          `;
          panel.classList.add('visible');
        });

      // Légende
      const legendEl = document.getElementById('europe-legend');
      if (legendEl) {
        legendEl.innerHTML = `
          <div class="europe-legend-item"><div class="europe-legend-swatch" style="background:#1e1e1e;border:1px solid #333"></div>Données non disponibles</div>
          <div class="europe-legend-item"><div class="europe-legend-swatch" style="background:rgba(232,160,32,0.15)"></div>Faible</div>
          <div class="europe-legend-item"><div class="europe-legend-swatch" style="background:rgba(232,160,32,0.5)"></div>Moyen</div>
          <div class="europe-legend-item"><div class="europe-legend-swatch" style="background:#e8a020"></div>Élevé</div>
        `;
      }
    }).catch(() => {});
}

// ── CARTE SUISSE (Leaflet) ────────────────────────────────────────────────
function initSwitzerlandMap(data) {
  const el = document.getElementById('switzerland-map');
  if (!el || typeof L === 'undefined') return;

  const map = L.map('switzerland-map', { center:[46.8,8.2], zoom:7, zoomControl:true, attributionControl:false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:12 }).addTo(map);

  const maxVal = Math.max(...data.switzerland.cantons.map(c => c.dogs_estimate));

  data.switzerland.cantons.forEach(canton => {
    const r = 5 + (canton.dogs_estimate / maxVal) * 18;
    const circle = L.circleMarker([canton.lat, canton.lng], {
      radius: r,
      fillColor: '#e8a020', fillOpacity: 0.55 + (canton.dogs_estimate/maxVal)*0.35,
      color: '#e8a020', weight: 1.5, opacity: 0.8
    }).addTo(map);

    circle.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif;min-width:170px">
        <div style="font-weight:700;color:#e8a020;margin-bottom:6px">${canton.name} (${canton.code})</div>
        <div style="font-size:0.8rem;color:#7a756c;margin-bottom:2px">Estimation : <strong style="color:#ede9e0">~${canton.dogs_estimate} chiens</strong></div>
        <div style="font-size:0.72rem;color:#7a756c;margin-top:6px;font-style:italic">Estimation proportionnelle à la population. Aucune donnée officielle par canton.</div>
      </div>
    `);
    circle.on('mouseover', function() { this.openPopup(); });
  });
}

// ── CARTE REFUGES (Leaflet) ───────────────────────────────────────────────
function initShelterMap(shelters) {
  if (typeof L === 'undefined') return null;
  const map = L.map('shelter-map', { center:[46.8,8.2], zoom:8, zoomControl:true, attributionControl:false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18 }).addTo(map);

  const markers = {};
  shelters.forEach(s => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="background:#e8a020;width:13px;height:13px;border-radius:50%;border:2px solid #0c0c0c;box-shadow:0 0 0 3px rgba(232,160,32,0.25)"></div>`,
      iconSize: [13,13], iconAnchor: [6,6]
    });
    const m = L.marker([s.lat, s.lng], { icon }).addTo(map);
    m.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif;min-width:200px">
        <div style="font-weight:700;font-size:0.9rem;margin-bottom:6px">${s.name}</div>
        <div style="font-size:0.78rem;color:#7a756c;margin-bottom:2px">${s.city}</div>
        <div style="font-size:0.78rem;color:#7a756c;margin-bottom:2px">${s.hours}</div>
        <div style="font-size:0.78rem;color:#7a756c;margin-bottom:8px">${s.phone}</div>
        <a href="${s.website}" target="_blank" style="color:#e8a020;font-size:0.78rem;text-decoration:none">Visiter le refuge →</a>
      </div>
    `);
    markers[s.postal] = { marker: m, shelter: s };
  });

  return { map, markers };
}

window.MapModule = { initWorldMap, initEuropeMap, initSwitzerlandMap, initShelterMap };