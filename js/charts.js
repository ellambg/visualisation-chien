/**
 * charts.js — Visualisations : dots animation, timeline, comparaison
 */

// ── DOT ANIMATION (1009 points = 1009 chiens) ─────────────────────────────
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
      { key: 'abandon', count: 796, color: '#e8a020' },
      { key: 'found',   count: 172, color: '#d45a2a' },
      { key: 'seized',  count: 41,  color: '#6c9e6c'  }
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
      const counts = { abandon: 796, found: 172, seized: 41 };
      const colors = { abandon: '#e8a020', found: '#d45a2a', seized: '#6c9e6c' };

      cats.forEach((cat, ci) => {
        const cx = 20 + ci * bw + bw/2;
        ctx.font = `700 22px 'Playfair Display', Georgia, serif`;
        ctx.fillStyle = colors[cat];
        ctx.textAlign = 'center';
        ctx.fillText(counts[cat], cx, 28);
        ctx.font = `500 12px 'DM Sans', sans-serif`;
        ctx.fillStyle = '#7a756c';
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
  grad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(232,160,32,0.25)');
  grad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(232,160,32,0)');

  const area = d3.area().x(d => x(d.year)).y0(H).y1(d => y(d.abandoned)).curve(d3.curveMonotoneX);
  svg.append('path').datum(annual).attr('fill', 'url(#tl-grad)').attr('d', area);

  const line = d3.line().x(d => x(d.year)).y(d => y(d.abandoned)).curve(d3.curveMonotoneX);
  const path = svg.append('path').datum(annual)
    .attr('fill', 'none').attr('stroke', '#e8a020').attr('stroke-width', 2.5).attr('d', line);

  const len = path.node().getTotalLength();
  path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
    .transition().duration(1600).ease(d3.easeLinear).attr('stroke-dashoffset', 0);

  // Points + labels
  svg.selectAll('.pt').data(annual).enter().append('circle')
    .attr('cx', d => x(d.year)).attr('cy', d => y(d.abandoned)).attr('r', 5)
    .attr('fill', d => d.year === 2024 ? '#e8a020' : '#0c0c0c')
    .attr('stroke', '#e8a020').attr('stroke-width', 2);

  svg.selectAll('.lbl').data(annual).enter().append('text')
    .attr('x', d => x(d.year)).attr('y', d => y(d.abandoned) - 12)
    .attr('text-anchor', 'middle').attr('fill', d => d.year === 2024 ? '#ede9e0' : '#7a756c')
    .attr('font-size', d => d.year === 2024 ? '13px' : '11px')
    .attr('font-weight', d => d.year === 2024 ? '700' : '400')
    .attr('font-family', 'DM Sans, sans-serif')
    .text(d => d.abandoned);

  // Annotation labels d'événements
  annual.filter(d => d.label).forEach(d => {
    const cx = x(d.year);
    svg.append('line').attr('x1', cx).attr('x2', cx)
      .attr('y1', y(d.abandoned) + 8).attr('y2', H + 4)
      .attr('stroke', '#7a756c').attr('stroke-width', 1).attr('stroke-dasharray', '3,3');
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

// ── GRAPHIQUE DE COMPARAISON (horizontal bar) ─────────────────────────────
function initCompareChart(data) {
  const container = document.getElementById('compare-chart');
  if (!container || typeof d3 === 'undefined') return;

  // Pays à afficher (flow seulement pour éviter confusion)
  const countries = [
    { name: 'Pays-Bas',   val: 0,   type: 'flow',  note: '~0 — quasi-éliminé' },
    { name: 'Suisse',     val: 11,  type: 'flow',  note: '11 / 100k',  highlight: true },
    { name: 'Allemagne',  val: 120, type: 'flow',  note: '120 / 100k' },
    { name: 'France',     val: 148, type: 'flow',  note: '148 / 100k' },
    { name: 'Italie',     val: 83,  type: 'flow',  note: '83 / 100k' },
    { name: 'Irlande',    val: 131, type: 'flow',  note: '131 / 100k' },
    { name: 'UK',         val: 54,  type: 'flow',  note: '54 / 100k' },
    { name: 'Belgique',   val: 520, type: 'flow',  note: '520 / 100k' },
    { name: 'Espagne',    val: 370, type: 'flow',  note: '370 / 100k' }
  ].sort((a, b) => a.val - b.val);

  const margin = { top: 10, right: 120, bottom: 30, left: 90 };
  const W = (container.parentElement.clientWidth || 900) - margin.left - margin.right;
  const H = countries.length * 34;

  const svg = d3.select('#compare-chart')
    .attr('viewBox', `0 0 ${W + margin.left + margin.right} ${H + margin.top + margin.bottom}`)
    .style('padding', '1.5rem 0')
    .append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear().domain([0, 560]).range([0, W]);
  const y = d3.scaleBand().domain(countries.map(d => d.name)).range([0, H]).padding(0.35);

  // Barres
  svg.selectAll('.cbar').data(countries).enter().append('rect')
    .attr('y', d => y(d.name))
    .attr('height', y.bandwidth())
    .attr('x', 0)
    .attr('width', 0)
    .attr('rx', 3)
    .attr('fill', d => d.highlight ? '#e8a020' : 'rgba(237,233,224,0.12)')
    .transition().duration(800).delay((d,i) => i*60).ease(d3.easeCubicOut)
    .attr('width', d => d.val === 0 ? 4 : x(d.val));

  // Valeurs
  svg.selectAll('.cval').data(countries).enter().append('text')
    .attr('x', d => (d.val === 0 ? 4 : x(d.val)) + 8)
    .attr('y', d => y(d.name) + y.bandwidth()/2 + 4)
    .attr('fill', d => d.highlight ? '#e8a020' : '#7a756c')
    .attr('font-size', '11px').attr('font-family', 'DM Sans, sans-serif')
    .text(d => d.note);

  // Labels pays
  svg.selectAll('.clbl').data(countries).enter().append('text')
    .attr('x', -8).attr('y', d => y(d.name) + y.bandwidth()/2 + 4)
    .attr('text-anchor', 'end')
    .attr('fill', d => d.highlight ? '#e8a020' : '#7a756c')
    .attr('font-size', '12px').attr('font-family', 'DM Sans, sans-serif')
    .attr('font-weight', d => d.highlight ? '600' : '400')
    .text(d => d.name);

  // Axe X
  svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + '/100k'));
}

window.ChartsModule = { DotAnimation, initTimeline, initCompareChart };