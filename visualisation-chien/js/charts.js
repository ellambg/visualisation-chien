/**
 * charts.js — Visualisations : nuage de points, diagramme en bâton, timeline
 * Utilise D3.js
 */

// ─── Animation des points (nuage → barres) ────────────────────────────────

const DOT_CONFIG = {
  totalDots: 520,   // représente les 5200 entrées (×10)
  dotRadius: 4,
  padding: 16,
  colors: {
    abandon: '#e8a020',
    trouve:  '#d45a2a',
    saisi:   '#6c9e6c'
  },
  labels: {
    abandon: 'Abandon volontaire',
    trouve:  'Animal trouvé',
    saisi:   'Saisi / maltraitance'
  }
};

class DotAnimation {
  constructor(canvasId, data) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.data = data;
    this.dots = [];
    this.animFrame = null;
    this.mode = 'scatter'; // 'scatter' | 'bars'
    this.transitioning = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.generateDots();
    this.render();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width  = parent.clientWidth;
    this.canvas.height = 340;
    if (this.dots.length > 0) {
      this.assignScatterPositions();
    }
  }

  generateDots() {
    const { totalDots, dotRadius } = DOT_CONFIG;
    const reasons = this.data.switzerland.intake_reasons;
    // 3 premières catégories => 3 couleurs
    const cats = [
      { key: 'abandon', count: Math.floor(totalDots * 0.40), color: DOT_CONFIG.colors.abandon },
      { key: 'trouve',  count: Math.floor(totalDots * 0.30), color: DOT_CONFIG.colors.trouve  },
      { key: 'saisi',   count: Math.floor(totalDots * 0.15), color: DOT_CONFIG.colors.saisi   }
    ];
    const remaining = totalDots - cats.reduce((s, c) => s + c.count, 0);
    cats[0].count += remaining;

    this.dots = [];
    cats.forEach(cat => {
      for (let i = 0; i < cat.count; i++) {
        this.dots.push({
          color:    cat.color,
          category: cat.key,
          x: 0, y: 0,
          targetX: 0, targetY: 0,
          vx: 0, vy: 0
        });
      }
    });

    this.assignScatterPositions();
  }

  assignScatterPositions() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const { dotRadius, padding } = DOT_CONFIG;

    this.dots.forEach(dot => {
      dot.targetX = padding + Math.random() * (W - 2 * padding);
      dot.targetY = padding + Math.random() * (H - 2 * padding);
      if (dot.x === 0 && dot.y === 0) {
        dot.x = dot.targetX;
        dot.y = dot.targetY;
      }
    });
  }

  assignBarPositions() {
    const W = this.canvas.width;
    const H = this.canvas.height;
    const { padding } = DOT_CONFIG;
    const categories = ['abandon', 'trouve', 'saisi'];
    const barWidth = (W - 2 * padding) / 3;
    const dotD = DOT_CONFIG.dotRadius * 2 + 2;

    categories.forEach((cat, i) => {
      const catDots = this.dots.filter(d => d.category === cat);
      const dotsPerRow = Math.floor(barWidth / dotD);

      catDots.forEach((dot, j) => {
        const row = Math.floor(j / dotsPerRow);
        const col = j % dotsPerRow;
        dot.targetX = padding + i * barWidth + col * dotD + dotD / 2;
        dot.targetY = H - padding - row * dotD - DOT_CONFIG.dotRadius;
      });
    });
  }

  transition(toMode) {
    if (this.transitioning || this.mode === toMode) return;
    this.mode = toMode;
    this.transitioning = true;

    if (toMode === 'bars') {
      this.assignBarPositions();
    } else {
      this.assignScatterPositions();
    }

    setTimeout(() => { this.transitioning = false; }, 1200);
  }

  render() {
    const ctx = this.ctx;
    const W   = this.canvas.width;
    const H   = this.canvas.height;

    // Easing
    const ease = 0.07;

    this.dots.forEach(dot => {
      dot.x += (dot.targetX - dot.x) * ease;
      dot.y += (dot.targetY - dot.y) * ease;
    });

    ctx.clearRect(0, 0, W, H);

    // Fond
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, W, H);

    // Points
    this.dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_CONFIG.dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    // Labels en mode barres
    if (this.mode === 'bars') {
      const categories = ['abandon', 'trouve', 'saisi'];
      const barWidth = (W - 2 * DOT_CONFIG.padding) / 3;
      const labels   = DOT_CONFIG.labels;

      categories.forEach((cat, i) => {
        const x = DOT_CONFIG.padding + i * barWidth + barWidth / 2;
        ctx.font = '600 12px DM Sans, sans-serif';
        ctx.fillStyle = DOT_CONFIG.colors[cat];
        ctx.textAlign = 'center';
        ctx.fillText(labels[cat], x, H - 4);

        const count = this.dots.filter(d => d.category === cat).length;
        ctx.font = '700 20px Playfair Display, Georgia, serif';
        ctx.fillStyle = '#f0ece4';
        ctx.fillText(`×${count * 10}`, x, 24);
      });
    }

    this.animFrame = requestAnimationFrame(() => this.render());
  }

  destroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}

// ─── Diagramme en bâton — par canton ──────────────────────────────────────
function initBarChart(data) {
  const container = document.getElementById('bar-chart-svg');
  if (!container || typeof d3 === 'undefined') return;

  const cantons = data.switzerland.cantons
    .sort((a, b) => b.intake - a.intake)
    .slice(0, 15);

  const margin = { top: 20, right: 20, bottom: 80, left: 50 };
  const width  = container.parentElement.clientWidth - margin.left - margin.right;
  const height = 320 - margin.top - margin.bottom;

  const svg = d3.select('#bar-chart-svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${320}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Axes
  const x = d3.scaleBand().domain(cantons.map(d => d.code)).range([0, width]).padding(0.25);
  const y = d3.scaleLinear().domain([0, d3.max(cantons, d => d.intake) * 1.1]).range([height, 0]);

  // Grille
  svg.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(''))
    .call(g => g.select('.domain').remove());

  // Barres
  const bars = svg.selectAll('.bar')
    .data(cantons)
    .enter()
    .append('rect')
    .attr('class', 'bar-rect')
    .attr('x', d => x(d.code))
    .attr('width', x.bandwidth())
    .attr('y', height)
    .attr('height', 0)
    .attr('rx', 3)
    .attr('fill', '#e8a020');

  // Animation d'entrée
  bars.transition()
    .duration(800)
    .delay((d, i) => i * 50)
    .ease(d3.easeCubicOut)
    .attr('y', d => y(d.intake))
    .attr('height', d => height - y(d.intake));

  // Barres adoptés (overlay)
  svg.selectAll('.bar-adopted')
    .data(cantons)
    .enter()
    .append('rect')
    .attr('x', d => x(d.code))
    .attr('width', x.bandwidth())
    .attr('y', height)
    .attr('height', 0)
    .attr('rx', 3)
    .attr('fill', '#6c9e6c')
    .attr('opacity', 0.7)
    .transition()
    .duration(800)
    .delay((d, i) => i * 50 + 200)
    .ease(d3.easeCubicOut)
    .attr('y', d => y(d.adopted))
    .attr('height', d => height - y(d.adopted));

  // Tooltip
  const tooltip = d3.select('body').append('div')
    .attr('class', 'map-tooltip')
    .style('position', 'fixed');

  svg.selectAll('.bar-rect')
    .on('mouseover', function(event, d) {
      d3.select(this).attr('fill', '#f0a830');
      tooltip.classed('visible', true)
        .html(`
          <div class="tooltip-title">${d.name}</div>
          <div class="tooltip-value">📥 Admis : ${d.intake}</div>
          <div class="tooltip-value">🏠 Adoptés : ${d.adopted}</div>
          <div class="tooltip-value">📊 Taux : ${Math.round(d.adopted/d.intake*100)}%</div>
        `)
        .style('left', (event.clientX + 12) + 'px')
        .style('top', (event.clientY - 40) + 'px');
    })
    .on('mouseleave', function() {
      d3.select(this).attr('fill', '#e8a020');
      tooltip.classed('visible', false);
    });

  // Axe X
  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
    .attr('dy', '0.3em')
    .attr('dx', '-0.6em');

  // Axe Y
  svg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d));

  // Légende
  const legend = svg.append('g').attr('transform', `translate(${width - 150}, 0)`);
  [
    { color: '#e8a020', label: 'Admis au refuge' },
    { color: '#6c9e6c', label: 'Adoptés' }
  ].forEach((item, i) => {
    legend.append('rect').attr('x', 0).attr('y', i * 20).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', item.color);
    legend.append('text').attr('x', 15).attr('y', i * 20 + 9).attr('fill', '#8a8278').attr('font-size', '11px').attr('font-family', 'DM Sans, sans-serif').text(item.label);
  });
}

// ─── Timeline — évolution annuelle ─────────────────────────────────────────
function initTimeline(data) {
  const container = document.getElementById('timeline-svg');
  if (!container || typeof d3 === 'undefined') return;

  const years  = data.switzerland.years;
  const values = data.switzerland.annual_intake;
  const chartData = years.map((y, i) => ({ year: y, value: values[i] }));

  const margin = { top: 30, right: 30, bottom: 40, left: 60 };
  const width  = container.parentElement.clientWidth - margin.left - margin.right;
  const height = 240 - margin.top - margin.bottom;

  const svg = d3.select('#timeline-svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} 240`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain(d3.extent(chartData, d => d.year)).range([0, width]);
  const y = d3.scaleLinear()
    .domain([d3.min(chartData, d => d.value) * 0.95, d3.max(chartData, d => d.value) * 1.05])
    .range([height, 0]);

  // Aire
  const area = d3.area()
    .x(d => x(d.year))
    .y0(height)
    .y1(d => y(d.value))
    .curve(d3.curveMonotoneX);

  svg.append('defs').append('linearGradient')
    .attr('id', 'timeline-grad')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', height)
    .selectAll('stop')
    .data([
      { offset: '0%', color: 'rgba(232,160,32,0.3)' },
      { offset: '100%', color: 'rgba(232,160,32,0)' }
    ])
    .enter().append('stop')
    .attr('offset', d => d.offset)
    .attr('stop-color', d => d.color);

  svg.append('path')
    .datum(chartData)
    .attr('fill', 'url(#timeline-grad)')
    .attr('d', area);

  // Ligne
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX);

  const path = svg.append('path')
    .datum(chartData)
    .attr('fill', 'none')
    .attr('stroke', '#e8a020')
    .attr('stroke-width', 2.5)
    .attr('d', line);

  // Animation du tracé
  const totalLen = path.node().getTotalLength();
  path
    .attr('stroke-dasharray', totalLen)
    .attr('stroke-dashoffset', totalLen)
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr('stroke-dashoffset', 0);

  // Points
  svg.selectAll('.dot-point')
    .data(chartData)
    .enter()
    .append('circle')
    .attr('cx', d => x(d.year))
    .attr('cy', d => y(d.value))
    .attr('r', 5)
    .attr('fill', '#e8a020')
    .attr('stroke', '#0d0d0d')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer');

  // Labels valeurs
  svg.selectAll('.val-label')
    .data(chartData)
    .enter()
    .append('text')
    .attr('x', d => x(d.year))
    .attr('y', d => y(d.value) - 12)
    .attr('text-anchor', 'middle')
    .attr('fill', '#f0ece4')
    .attr('font-size', '11px')
    .attr('font-family', 'DM Sans, sans-serif')
    .text(d => d.value.toLocaleString('fr-CH'));

  // Axes
  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(6));

  svg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y).ticks(4));
}

// ─── Donut chart — raisons d'abandon ──────────────────────────────────────
function initDonutChart(data) {
  const container = document.getElementById('donut-chart');
  if (!container || typeof d3 === 'undefined') return;

  const reasons = data.switzerland.intake_reasons;
  const colors  = ['#e8a020', '#d45a2a', '#6c9e6c', '#5a7fa0', '#8a6ea0'];

  const size   = 220;
  const radius = size / 2;
  const inner  = radius * 0.55;

  const svg = d3.select('#donut-chart')
    .attr('viewBox', `0 0 ${size} ${size}`)
    .append('g')
    .attr('transform', `translate(${radius},${radius})`);

  const pie  = d3.pie().value(d => d.count).sort(null);
  const arc  = d3.arc().innerRadius(inner).outerRadius(radius - 4);
  const arcH = d3.arc().innerRadius(inner).outerRadius(radius + 4);

  const slices = svg.selectAll('.slice')
    .data(pie(reasons))
    .enter()
    .append('g')
    .attr('class', 'slice');

  slices.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => colors[i])
    .attr('stroke', '#0d0d0d')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      d3.select(this).attr('d', arcH);
      // Mise à jour du centre
      svg.select('.donut-center-val').text(d.data.percentage + '%');
      svg.select('.donut-center-label').text(d.data.reason.split(' ')[0]);
    })
    .on('mouseleave', function() {
      d3.select(this).attr('d', arc);
      svg.select('.donut-center-val').text('100%');
      svg.select('.donut-center-label').text('des cas');
    })
    .transition()
    .duration(800)
    .attrTween('d', function(d) {
      const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return t => arc(i(t));
    });

  // Centre
  svg.append('text')
    .attr('class', 'donut-center-val')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.1em')
    .attr('fill', '#f0ece4')
    .attr('font-size', '22px')
    .attr('font-family', 'Playfair Display, Georgia, serif')
    .attr('font-weight', '700')
    .text('5200');

  svg.append('text')
    .attr('class', 'donut-center-label')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.5em')
    .attr('fill', '#8a8278')
    .attr('font-size', '10px')
    .attr('font-family', 'DM Sans, sans-serif')
    .text('admissions CH');
}

// Export
window.ChartsModule = {
  DotAnimation,
  initBarChart,
  initTimeline,
  initDonutChart
};
