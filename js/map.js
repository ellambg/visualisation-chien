/**
 * map.js — Cartes : monde (D3), Europe (D3 choroplèthe), Suisse (Leaflet), Refuges (Leaflet)
 */

// ── CARTE MONDE ───────────────────────────────────────────────────────────
function initWorldMap(data) {
  const el = document.getElementById('world-map');
  if (!el) return;
  const W = el.clientWidth, H = el.clientHeight || 420;

  const svg = d3.select('#world-map').append('svg').attr('width', W).attr('height', H);
  const proj = d3.geoNaturalEarth1().scale(W/6.3).translate([W/2, H/1.95]);
  const path = d3.geoPath().projection(proj);

  svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#0c0c0c');

  // Graticule
  svg.append('path').datum(d3.geoGraticule()())
    .attr('d', path).attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.03)').attr('stroke-width', 0.5);

  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json()).then(world => {
      const countries = topojson.feature(world, world.objects.countries);
      svg.selectAll('.c').data(countries.features).enter().append('path')
        .attr('d', path).attr('fill', '#1c1c1c')
        .attr('stroke', 'rgba(255,255,255,0.06)').attr('stroke-width', 0.4);

      // Points représentatifs
      const spots = [
        { label: '62M — Inde',    coord: [80, 22],  size: 18 },
        { label: '4M — Turquie',  coord: [35, 39],  size: 11 },
        { label: '550k — Roumanie',coord: [25, 46], size: 7  },
        { label: '100k — France', coord: [2, 47],   size: 4  },
        { label: '1009 — Suisse', coord: [8.2,46.8],size: 2, highlight: true }
      ];

      spots.forEach(s => {
        const [cx, cy] = proj(s.coord);
        if (!cx || !cy) return;
        const g = svg.append('g').attr('transform', `translate(${cx},${cy})`);

        if (s.highlight) {
          g.append('circle').attr('r', 10).attr('fill', 'none')
            .attr('stroke', '#e8a020').attr('stroke-width', 1.5).attr('opacity', 0.5)
            .append('animate').attr('attributeName', 'r').attr('from', 6).attr('to', 14)
            .attr('dur', '2s').attr('repeatCount', 'indefinite');
        }

        g.append('circle').attr('r', s.size).attr('fill', s.highlight ? '#e8a020' : 'rgba(212,90,42,0.6)')
          .attr('opacity', s.highlight ? 1 : 0.55);

        if (s.highlight) {
          g.append('text').attr('x', 12).attr('y', 4)
            .attr('fill', '#e8a020').attr('font-size', '11px')
            .attr('font-family', 'DM Sans, sans-serif').attr('font-weight', '600')
            .text('Suisse — 1 009');
        }
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

      svg.selectAll('.ec').data(countries.features).enter().append('path')
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
          const cd = byCode[code];
          if (!cd) return;
          d3.select(this).attr('stroke', '#e8a020').attr('stroke-width', 1.5);
          tooltip.classed('visible', true)
            .style('left', (event.offsetX + 14) + 'px')
            .style('top',  (event.offsetY - 20) + 'px')
            .html(`
              <div class="tooltip-title">${cd.country}</div>
              <div class="tooltip-value">📊 ${cd.dogs_per_100k} / 100k hab.</div>
              <div class="tooltip-value">🐕 ${cd.total_estimate.toLocaleString('fr-CH')} estimés</div>
              ${cd.note ? `<div class="tooltip-note">${cd.note}</div>` : ''}
              <div class="tooltip-note">Source : ${cd.source}</div>
            `);
        })
        .on('mousemove', function(event) {
          tooltip.style('left', (event.offsetX + 14) + 'px').style('top', (event.offsetY - 20) + 'px');
        })
        .on('mouseleave', function() {
          d3.select(this).attr('stroke', 'rgba(255,255,255,0.08)').attr('stroke-width', 0.5);
          tooltip.classed('visible', false);
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
        <div style="font-size:0.8rem;color:#7a756c;margin-bottom:2px">🐕 Estimation : <strong style="color:#ede9e0">~${canton.dogs_estimate} chiens</strong></div>
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
      <div style="font-family:'DM Sans',sans-serif;min-width:190px">
        <div style="font-weight:700;font-size:0.9rem;margin-bottom:6px">${s.name}</div>
        <div style="font-size:0.78rem;color:#7a756c;margin-bottom:2px">📍 ${s.city} (${s.postal})</div>
        <div style="font-size:0.78rem;color:#7a756c;margin-bottom:6px">📞 ${s.phone}</div>
        <div style="display:inline-block;background:rgba(108,158,108,0.15);color:#6c9e6c;padding:2px 8px;border-radius:4px;font-size:0.72rem;font-weight:600">🐾 ${s.dogs} chiens disponibles</div>
        <div style="margin-top:8px"><a href="${s.website}" target="_blank" style="color:#e8a020;font-size:0.78rem;text-decoration:none">Visiter le refuge →</a></div>
      </div>
    `);
    markers[s.postal] = { marker: m, shelter: s };
  });

  return { map, markers };
}

window.MapModule = { initWorldMap, initEuropeMap, initSwitzerlandMap, initShelterMap };