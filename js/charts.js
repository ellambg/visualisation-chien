/**
 * charts.js — Visualisations : dots animation, timeline, comparaison
 */
import * as d3 from 'd3';

// ── DOT ANIMATION (1826 points = 1826 chiens) ─────────────────────────────
class DotAnimation {
  constructor(canvasId, data) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.data = data;
    this.dots = [];
    this.mode = 'scatter';
    this.raf = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.buildDots();
    this.loop();
  }

  resize() {
    if (!this.canvas) return;
    const w = this.canvas.parentElement.clientWidth;
    this.canvas.width  = w;
    this.canvas.height = 420;
    this.canvas.style.height = '420px';
    if (this.dots.length) this.scatter();
  }

  buildDots() {
    // 1009 chiens : ~79% abandonnés, ~17% trouvés, ~4% saisis
    const cats = [
      { key: 'abandon', count: 1443, color: '#c49a3e' },
      { key: 'found',   count: 310,  color: '#6699cc' },
      { key: 'seized',  count: 73,   color: '#7a8a3a'  }
    ];
    this.dots = [];
    cats.forEach(cat => {
      for (let i = 0; i < cat.count; i++) {
        this.dots.push({ color: cat.color, cat: cat.key, x: 0, y: 0, tx: 0, ty: 0 });
      }
    });
    // Shuffle
    for (let i = this.dots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.dots[i], this.dots[j]] = [this.dots[j], this.dots[i]];
    }
    this.scatter();
    this.dots.forEach(d => { d.x = d.tx; d.y = d.ty; });
  }

  scatter() {
    const W = this.canvas.width, H = this.canvas.height, pad = 20, r = 4;
    this.dots.forEach(d => {
      d.tx = pad + Math.random() * (W - 2*pad);
      d.ty = pad + Math.random() * (H - 2*pad);
    });
  }

  bars() {
    const W = this.canvas.width, H = this.canvas.height;
    const cats = ['abandon', 'found', 'seized'];
    const bw = (W - 40) / 3;
    const r = 4, gap = 1;
    const cols = Math.floor(bw / (r*2 + gap));

    cats.forEach((cat, ci) => {
      const group = this.dots.filter(d => d.cat === cat);
      group.forEach((d, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        d.tx = 20 + ci * bw + col * (r*2 + gap) + r;
        d.ty = H - 20 - row * (r*2 + gap) - r;
      });
    });
  }

  transition(mode) {
    this.mode = mode;
    if (mode === 'bars') this.bars();
    else this.scatter();
  }

  loop() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    const ease = 0.06;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#141414';
    ctx.fillRect(0, 0, W, H);

    this.dots.forEach(d => {
      d.x += (d.tx - d.x) * ease;
      d.y += (d.ty - d.y) * ease;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 3.5, 0, Math.PI*2);
      ctx.fillStyle = d.color;
      ctx.globalAlpha = 0.88;
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Labels en mode barres
    if (this.mode === 'bars') {
      const cats  = ['abandon', 'found', 'seized'];
      const bw    = (W - 40) / 3;
      const labels = { abandon: 'Abandonnés', found: 'Trouvés', seized: 'Saisis' };
      const counts = { abandon: 1443, found: 310, seized: 73 };
      const colors = { abandon: '#c49a3e', found: '#6699cc', seized: '#7a8a3a' };

      cats.forEach((cat, ci) => {
        const cx = 20 + ci * bw + bw/2;
        ctx.font = `700 22px 'Encode Sans', sans-serif`;
        ctx.fillStyle = colors[cat];
        ctx.textAlign = 'center';
        ctx.fillText(counts[cat], cx, 28);
        ctx.font = `500 12px 'Encode Sans', sans-serif`;
        ctx.fillStyle = '#888888';
        ctx.fillText(labels[cat], cx, H - 6);
      });
    }

    this.raf = requestAnimationFrame(() => this.loop());
  }
}

// ── TIMELINE SVG (D3) ────────────────────────────────────────────────────
function initTimeline(data) {
  const container = document.getElementById('timeline-svg');
  if (!container || typeof d3 === 'undefined') return;

  const annual = data.switzerland.annual_dogs;
  const margin = { top: 30, right: 30, bottom: 40, left: 55 };
  const W = container.parentElement.clientWidth - margin.left - margin.right;
  const H = 260 - margin.top - margin.bottom;

  const svg = d3.select('#timeline-svg')
    .attr('viewBox', `0 0 ${W + margin.left + margin.right} 260`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([2019, 2024]).range([0, W]);
  const y = d3.scaleLinear().domain([600, 1100]).range([H, 0]);

  // Grille horizontale
  svg.append('g').attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-W).tickFormat('').ticks(4))
    .call(g => g.select('.domain').remove());

  // Gradient d'aire
  const defs = svg.append('defs');
  const grad = defs.append('linearGradient').attr('id', 'tl-grad')
    .attr('gradientUnits', 'userSpaceOnUse').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', H);
  grad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(196,154,62,0.25)');
  grad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(196,154,62,0)');

  const area = d3.area().x(d => x(d.year)).y0(H).y1(d => y(d.abandoned)).curve(d3.curveMonotoneX);
  svg.append('path').datum(annual).attr('fill', 'url(#tl-grad)').attr('d', area);

  const line = d3.line().x(d => x(d.year)).y(d => y(d.abandoned)).curve(d3.curveMonotoneX);
  const path = svg.append('path').datum(annual)
    .attr('fill', 'none').attr('stroke', '#c49a3e').attr('stroke-width', 2.5).attr('d', line);

  const len = path.node().getTotalLength();
  path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
    .transition().duration(1600).ease(d3.easeLinear).attr('stroke-dashoffset', 0);

  // Points + labels
  svg.selectAll('.pt').data(annual).enter().append('circle')
    .attr('cx', d => x(d.year)).attr('cy', d => y(d.abandoned)).attr('r', 5)
    .attr('fill', d => d.year === 2024 ? '#c49a3e' : '#0c0c0c')
    .attr('stroke', '#c49a3e').attr('stroke-width', 2);

  svg.selectAll('.lbl').data(annual).enter().append('text')
    .attr('x', d => x(d.year)).attr('y', d => y(d.abandoned) - 12)
    .attr('text-anchor', 'middle').attr('fill', d => d.year === 2024 ? '#ede9e0' : '#888888')
    .attr('font-size', d => d.year === 2024 ? '13px' : '11px')
    .attr('font-weight', d => d.year === 2024 ? '700' : '400')
    .attr('font-family', 'Encode Sans, sans-serif')
    .text(d => d.abandoned);

  // Annotation labels d'événements
  annual.filter(d => d.label).forEach(d => {
    const cx = x(d.year);
    svg.append('line').attr('x1', cx).attr('x2', cx)
      .attr('y1', y(d.abandoned) + 8).attr('y2', H + 4)
      .attr('stroke', '#888888').attr('stroke-width', 1).attr('stroke-dasharray', '3,3');
  });

  // Axes
  svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')).ticks(6));
  svg.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(4));

  // Injecter les annotations textuelles dans la sidebar
  const annEl = document.getElementById('timeline-annotations');
  if (annEl) {
    annEl.innerHTML = annual.filter(d => d.label).map(d => `
      <div style="display:flex;gap:0.6rem;align-items:baseline">
        <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--accent);min-width:35px">${d.year}</span>
        <span style="font-size:0.8rem;color:var(--muted)">${d.label}</span>
      </div>
    `).join('');
  }
}

// ── GRAPHIQUE DONUT — surcharge des refuges ────────────────────────────────
function initCompareChart(data) {
  const container = document.getElementById('compare-chart');
  if (!container || typeof d3 === 'undefined') return;

  const reasons = data.switzerland.intake_reasons;
  const size = 300;
  const radius = size / 2;
  const innerRadius = radius * 0.58;

  const svg = d3.select('#compare-chart')
    .attr('viewBox', `0 0 ${size} ${size}`)
    .attr('width', size).attr('height', size)
    .append('g').attr('transform', `translate(${radius},${radius})`);

  const pie = d3.pie().value(d => d.count).sort(null).padAngle(0.03);
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius - 8);
  const arcHover = d3.arc().innerRadius(innerRadius).outerRadius(radius - 2);

  const slices = svg.selectAll('.arc')
    .data(pie(reasons)).enter().append('g').attr('class', 'arc');

  slices.append('path')
    .attr('fill', d => d.data.color)
    .attr('opacity', 0.88)
    .attr('stroke', '#0c0c0c').attr('stroke-width', 2)
    .on('mouseover', function() { d3.select(this).transition().duration(150).attr('d', arcHover); })
    .on('mouseleave', function() { d3.select(this).transition().duration(150).attr('d', arc); })
    .transition().duration(900).delay((d, i) => i * 180)
    .attrTween('d', function(d) {
      const interp = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return t => arc(interp(t));
    });

  // Chiffre central
  svg.append('text').attr('text-anchor', 'middle').attr('dy', '-0.5em')
    .attr('fill', '#ede9e0')
    .attr('font-size', '26px')
    .attr('font-family', 'Encode Sans, sans-serif').attr('font-weight', '700')
    .text('32 079');

  svg.append('text').attr('text-anchor', 'middle').attr('dy', '1.1em')
    .attr('fill', '#888888').attr('font-size', '9.5px')
    .attr('font-family', 'Encode Sans, sans-serif').attr('letter-spacing', '0.06em')
    .text('animaux accueillis');

  // Légende
  const legendEl = document.getElementById('donut-legend');
  if (legendEl) {
    legendEl.innerHTML = reasons.map(r => `
      <div class="donut-legend-item">
        <div class="donut-legend-dot" style="background:${r.color}"></div>
        <div class="donut-legend-text">
          <span class="donut-legend-pct" style="color:${r.color}">${r.percentage}%</span>
          <span class="donut-legend-label"> — ${r.reason}</span>
          <div class="donut-legend-count">${r.count.toLocaleString('fr-CH')} animaux</div>
        </div>
      </div>
    `).join('');
  }
}

export { DotAnimation, initTimeline, initCompareChart };