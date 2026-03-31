/**
 * map.js — Gestion des cartes (monde, europe, suisse, refuges)
 * Utilise D3.js pour la carte Europe et Leaflet pour les cartes interactives
 */

// ─── Carte monde avec D3 ───────────────────────────────────────────────────
function initWorldMap(data) {
  const container = document.getElementById('world-map');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select('#world-map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const projection = d3.geoNaturalEarth1()
    .scale(width / 6.5)
    .translate([width / 2, height / 1.9]);

  const path = d3.geoPath().projection(projection);

  // Fond
  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#0d0d0d');

  // Graticule
  const graticule = d3.geoGraticule()();
  svg.append('path')
    .datum(graticule)
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', 'rgba(255,255,255,0.04)')
    .attr('stroke-width', 0.5);

  // Chargement GeoJSON monde
  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json())
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries);

      svg.selectAll('.country')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('fill', '#1e1e1e')
        .attr('stroke', 'rgba(255,255,255,0.08)')
        .attr('stroke-width', 0.5)
        .style('cursor', 'default');

      // Point clignotant pour la Suisse
      const switzerlandCoords = projection([8.2, 46.8]);
      if (switzerlandCoords) {
        const pulse = svg.append('g')
          .attr('transform', `translate(${switzerlandCoords[0]}, ${switzerlandCoords[1]})`);

        pulse.append('circle')
          .attr('r', 6)
          .attr('fill', 'none')
          .attr('stroke', '#e8a020')
          .attr('stroke-width', 1.5)
          .style('animation', 'pulseRing 2s ease-out infinite');

        pulse.append('circle')
          .attr('r', 3)
          .attr('fill', '#e8a020');

        // Annotation
        pulse.append('text')
          .attr('x', 10)
          .attr('y', 4)
          .attr('fill', '#e8a020')
          .attr('font-size', '10px')
          .attr('font-family', 'DM Sans, sans-serif')
          .text('Suisse');
      }

      // Stat mondiale
      const statBg = svg.append('g').attr('transform', 'translate(20, 20)');
      statBg.append('rect')
        .attr('width', 200)
        .attr('height', 52)
        .attr('rx', 6)
        .attr('fill', 'rgba(232,160,32,0.1)')
        .attr('stroke', 'rgba(232,160,32,0.3)')
        .attr('stroke-width', 1);
      statBg.append('text')
        .attr('x', 12)
        .attr('y', 22)
        .attr('fill', '#e8a020')
        .attr('font-size', '18px')
        .attr('font-weight', '700')
        .attr('font-family', 'Playfair Display, Georgia, serif')
        .text('200 millions');
      statBg.append('text')
        .attr('x', 12)
        .attr('y', 40)
        .attr('fill', '#8a8278')
        .attr('font-size', '10px')
        .attr('font-family', 'DM Sans, sans-serif')
        .text("chiens errants dans le monde (OMS)");
    })
    .catch(() => {
      // Fallback si fetch échoue
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#8a8278')
        .attr('font-size', '14px')
        .text('Carte mondiale — connexion requise');
    });
}

// ─── Carte Europe avec D3 et choroplèthe ──────────────────────────────────
function initEuropeMap(data) {
  const container = document.getElementById('europe-map');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const svg = d3.select('#europe-map')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const projection = d3.geoMercator()
    .center([14, 54])
    .scale(width * 1.1)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#0d0d0d');

  // Échelle de couleur
  const maxVal = d3.max(data.europe.countries, d => d.abandoned_per_100k);
  const colorScale = d3.scaleSequential()
    .domain([0, maxVal])
    .interpolator(d3.interpolate('#1a1a1a', '#e8a020'));

  // Tooltip
  const tooltip = d3.select('#europe-tooltip');

  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json())
    .then(world => {
      const countries = topojson.feature(world, world.objects.countries);

      // Mapping ISO numériques → codes alpha
      const isoToCode = {
        '642': 'RO', '792': 'TR', '804': '804', '643': 'RU', '380': 'IT',
        '724': 'ES', '250': 'FR', '276': 'DE', '756': 'CH', '528': 'NL',
        '040': 'AT', '056': 'BE', '620': 'PT', '300': 'GR', '616': 'PL',
        '752': 'SE', '578': 'NO', '246': 'FI'
      };

      const dataByCode = {};
      data.europe.countries.forEach(d => { dataByCode[d.code] = d; });

      svg.selectAll('.euro-country')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', 'euro-country')
        .attr('d', path)
        .attr('fill', d => {
          const code = isoToCode[d.id];
          const countryData = dataByCode[code];
          return countryData ? colorScale(countryData.abandoned_per_100k) : '#1e1e1e';
        })
        .attr('stroke', 'rgba(255,255,255,0.1)')
        .attr('stroke-width', 0.5)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          const code = isoToCode[d.id];
          const countryData = dataByCode[code];
          if (countryData) {
            d3.select(this).attr('stroke', '#e8a020').attr('stroke-width', 1.5);
            tooltip.classed('visible', true)
              .html(`
                <div class="tooltip-title">${countryData.country}</div>
                <div class="tooltip-value">${countryData.abandoned_per_100k} chiens errants / 100k hab.</div>
                <div class="tooltip-value" style="margin-top:4px">Total estimé : ${countryData.total.toLocaleString('fr-CH')}</div>
              `)
              .style('left', (event.offsetX + 12) + 'px')
              .style('top', (event.offsetY - 20) + 'px');
          }
        })
        .on('mouseleave', function() {
          d3.select(this).attr('stroke', 'rgba(255,255,255,0.1)').attr('stroke-width', 0.5);
          tooltip.classed('visible', false);
        });

      // Légende choroplèthe
      const legendW = 120, legendH = 10;
      const legend = svg.append('g').attr('transform', `translate(${width - legendW - 20}, ${height - 50})`);

      const defs = svg.append('defs');
      const linearGrad = defs.append('linearGradient').attr('id', 'europe-legend-grad');
      linearGrad.append('stop').attr('offset', '0%').attr('stop-color', '#1a1a1a');
      linearGrad.append('stop').attr('offset', '100%').attr('stop-color', '#e8a020');

      legend.append('rect')
        .attr('width', legendW)
        .attr('height', legendH)
        .attr('rx', 3)
        .attr('fill', 'url(#europe-legend-grad)');

      legend.append('text').attr('x', 0).attr('y', -4).attr('fill', '#8a8278').attr('font-size', '9px').text('0');
      legend.append('text').attr('x', legendW).attr('y', -4).attr('text-anchor', 'end').attr('fill', '#8a8278').attr('font-size', '9px').text(`${maxVal}`);
      legend.append('text').attr('x', legendW / 2).attr('y', legendH + 16).attr('text-anchor', 'middle').attr('fill', '#8a8278').attr('font-size', '9px').text('Chiens errants / 100k hab.');
    })
    .catch(() => {});
}

// ─── Carte Suisse avec Leaflet ─────────────────────────────────────────────
function initSwitzerlandMap(data) {
  const container = document.getElementById('switzerland-map');
  if (!container || typeof L === 'undefined') return;

  const map = L.map('switzerland-map', {
    center: [46.8, 8.2],
    zoom: 7,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12
  }).addTo(map);

  // Markers pour chaque canton
  const maxIntake = Math.max(...data.switzerland.cantons.map(c => c.intake));

  data.switzerland.cantons.forEach(canton => {
    const radius = 6 + (canton.intake / maxIntake) * 16;
    const opacity = 0.5 + (canton.intake / maxIntake) * 0.5;

    const circle = L.circleMarker([canton.lat, canton.lng], {
      radius: radius,
      fillColor: '#e8a020',
      fillOpacity: opacity * 0.7,
      color: '#e8a020',
      weight: 1.5,
      opacity: opacity
    }).addTo(map);

    circle.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif; min-width:160px">
        <div style="font-weight:700; font-size:1rem; color:#e8a020; margin-bottom:6px">${canton.name}</div>
        <div style="font-size:0.82rem; color:#8a8278; margin-bottom:2px">📥 Admis : <strong style="color:#f0ece4">${canton.intake}</strong></div>
        <div style="font-size:0.82rem; color:#8a8278">🏠 Adoptés : <strong style="color:#6c9e6c">${canton.adopted}</strong></div>
      </div>
    `);

    circle.on('mouseover', function() { this.openPopup(); });
  });

  return map;
}

// ─── Carte des refuges ──────────────────────────────────────────────────────
function initShelterMap(shelters) {
  if (typeof L === 'undefined') return null;

  const map = L.map('shelter-map', {
    center: [46.8, 8.2],
    zoom: 8,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(map);

  const markers = {};

  shelters.forEach(shelter => {
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        background:#e8a020;
        width:14px; height:14px;
        border-radius:50%;
        border:2px solid #0d0d0d;
        box-shadow:0 0 0 3px rgba(232,160,32,0.3);
      "></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const marker = L.marker([shelter.lat, shelter.lng], { icon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif; min-width:180px">
        <div style="font-weight:700; font-size:0.9rem; margin-bottom:6px">${shelter.name}</div>
        <div style="font-size:0.8rem; color:#8a8278; margin-bottom:2px">📍 ${shelter.city} (${shelter.postal_code})</div>
        <div style="font-size:0.8rem; color:#8a8278; margin-bottom:2px">📞 ${shelter.phone}</div>
        <div style="
          display:inline-block; margin-top:6px;
          background:rgba(108,158,108,0.2);
          color:#6c9e6c; padding:2px 8px;
          border-radius:4px; font-size:0.75rem;
        ">🐾 ${shelter.dogs_available} chiens disponibles</div>
        <div style="margin-top:8px">
          <a href="${shelter.website}" target="_blank" style="color:#e8a020;font-size:0.8rem">Visiter le site →</a>
        </div>
      </div>
    `);

    markers[shelter.postal_code] = { marker, shelter };
  });

  return { map, markers };
}

// ─── Recherche par code postal ──────────────────────────────────────────────
function searchSheltersByPostal(postalCode, sheltersData, mapInstance) {
  if (!mapInstance) return [];

  const results = sheltersData.filter(s =>
    s.postal_code.startsWith(postalCode.slice(0, 2)) ||
    s.city.toLowerCase().includes(postalCode.toLowerCase()) ||
    s.postal_code === postalCode
  );

  // Si on trouve des résultats, zoomer vers eux
  if (results.length > 0) {
    const lats = results.map(s => s.lat);
    const lngs = results.map(s => s.lng);
    const bounds = L.latLngBounds(
      [Math.min(...lats) - 0.3, Math.min(...lngs) - 0.3],
      [Math.max(...lats) + 0.3, Math.max(...lngs) + 0.3]
    );
    mapInstance.fitBounds(bounds, { padding: [30, 30] });

    // Ouvrir le premier marker
    if (mapInstance._markers && mapInstance._markers[results[0].postal_code]) {
      mapInstance._markers[results[0].postal_code].marker.openPopup();
    }
  } else {
    // Recherche approximative — retourner les 3 plus proches
    return sheltersData.slice(0, 3);
  }

  return results;
}

// Export
window.MapModule = {
  initWorldMap,
  initEuropeMap,
  initSwitzerlandMap,
  initShelterMap,
  searchSheltersByPostal
};
