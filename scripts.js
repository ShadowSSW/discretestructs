// ═══════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════
function navigate(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => {
    if (l.dataset.section === id) l.classList.add('active');
  });
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigate(link.dataset.section);
  });
});

document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// ═══════════════════════════════════════
// TOPIC TABS
// ═══════════════════════════════════════
document.querySelectorAll('.topic-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.topic-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.topic-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.topic);
    if (target) target.classList.add('active');
  });
});

// ═══════════════════════════════════════
// MATH HELPERS
// ═══════════════════════════════════════
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function comb(n, k) {
  if (k < 0 || k > n) return 0;
  return Math.round(factorial(n) / (factorial(k) * factorial(n - k)));
}

function parseFrac(s) {
  s = s.trim();
  if (s.includes('/')) {
    const [a, b] = s.split('/');
    return parseFloat(a) / parseFloat(b);
  }
  return parseFloat(s);
}

function addLog(logId, label, value) {
  const log = document.getElementById(logId);
  if (!log) return;
  const row = document.createElement('div');
  row.className = 'log-row';
  row.innerHTML = `<span class="log-label">${label}</span><span class="log-val">${value}</span>`;
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
}

function metricCard(label, value, sub) {
  return `<div class="metric-card">
    <div class="metric-value">${value}</div>
    <div class="metric-label">${label}</div>
    ${sub ? `<div class="metric-sub">${sub}</div>` : ''}
  </div>`;
}

// ═══════════════════════════════════════
// CALC 1 — Permutaciones y Combinaciones
// ═══════════════════════════════════════
function runPC() {
  const n    = parseInt(document.getElementById('pc-n').value);
  const k    = parseInt(document.getElementById('pc-k').value);
  const type = document.getElementById('pc-type').value;
  const out  = document.getElementById('pc-output');

  if (isNaN(n) || isNaN(k) || n < 0 || k < 0) {
    out.innerHTML = '<div class="calc-error">Ingresa valores enteros no negativos.</div>';
    return;
  }

  let result, label, steps = [];

  switch (type) {
    case 'perm':
      result = factorial(n);
      label  = 'Permutación completa';
      steps  = [
        `Fórmula: P<sub>${n}</sub> = n!`,
        `= ${n} × ${n-1} × ... × 2 × 1`,
        `= ${result.toLocaleString()}`
      ];
      break;
    case 'var':
      if (k > n) { out.innerHTML = '<div class="calc-error">k debe ser menor o igual que n.</div>'; return; }
      result = Math.round(factorial(n) / factorial(n - k));
      label  = 'Variación sin repetición';
      steps  = [
        `Fórmula: V<sub>${n},${k}</sub> = n! / (n-k)!`,
        `= ${n}! / ${n-k}!`,
        `= ${result.toLocaleString()}`
      ];
      break;
    case 'varrep':
      result = Math.pow(n, k);
      label  = 'Variación con repetición';
      steps  = [
        `Fórmula: VR<sub>${n},${k}</sub> = n<sup>k</sup>`,
        `= ${n}<sup>${k}</sup>`,
        `= ${result.toLocaleString()}`
      ];
      break;
    case 'comb':
      if (k > n) { out.innerHTML = '<div class="calc-error">k debe ser menor o igual que n.</div>'; return; }
      result = comb(n, k);
      label  = 'Combinación sin repetición';
      steps  = [
        `Fórmula: C(${n},${k}) = n! / [(n-k)! × k!]`,
        `= ${n}! / (${n-k}! × ${k}!)`,
        `= ${result.toLocaleString()}`
      ];
      break;
    case 'combrep':
      result = comb(n + k - 1, k);
      label  = 'Combinación con repetición';
      steps  = [
        `Fórmula: CR(${n},${k}) = C(n+k-1, k) = C(${n+k-1}, ${k})`,
        `= (${n+k-1})! / (${n-1}! × ${k}!)`,
        `= ${result.toLocaleString()}`
      ];
      break;
  }

  out.innerHTML = `
    <div class="result-header">${label} &nbsp;·&nbsp; n = ${n}, k = ${k}</div>
    <div class="result-steps">
      ${steps.map((s, i) => `
        <div class="result-step">
          <span class="step-badge">${i+1}</span>
          <span>${s}</span>
        </div>`).join('')}
    </div>
    <div class="result-answer">
      <span class="answer-label">Resultado final</span>
      <span class="answer-value">${result.toLocaleString()}</span>
    </div>`;

  addLog('pc-log', `${label} (n=${n}, k=${k})`, result.toLocaleString());
}

// ═══════════════════════════════════════
// CALC 2 — Binomio
// ═══════════════════════════════════════
function runBinomio() {
  const a   = document.getElementById('bn-a').value.trim() || 'a';
  const b   = document.getElementById('bn-b').value.trim() || 'b';
  const n   = parseInt(document.getElementById('bn-n').value);
  const out = document.getElementById('bn-output');

  if (isNaN(n) || n < 0 || n > 10) {
    out.innerHTML = '<div class="calc-error">n debe ser un número entre 0 y 10.</div>';
    return;
  }

  // Parse b to detect its numeric coefficient and symbolic part
  // e.g. "-2y" → coefB=-2, symB="y"
  // e.g. "y"   → coefB=1,  symB="y"
  // e.g. "-y"  → coefB=-1, symB="y"
  // e.g. "3"   → coefB=3,  symB=""
  function parseTerm(str) {
    str = str.trim();
    const match = str.match(/^([+-]?\d*\.?\d*)([a-zA-Z].*)$/);
    if (match) {
      const numPart = match[1];
      const sym     = match[2];
      let coef = numPart === '' || numPart === '+' ? 1
               : numPart === '-' ? -1
               : parseFloat(numPart);
      return { coef, sym };
    }
    // purely numeric
    const num = parseFloat(str);
    return isNaN(num) ? { coef: 1, sym: str } : { coef: num, sym: '' };
  }

  const { coef: bCoef, sym: bSym } = parseTerm(b);
  const { coef: aCoef, sym: aSym } = parseTerm(a);
  const aIsPureNum = aSym === '';
  const bIsPureNum = bSym === '';

  const terms = [];
  for (let k = 0; k <= n; k++) {
    const c  = comb(n, k);
    const eA = n - k;
    const eB = k;

    // Full numeric coefficient of this term: C(n,k) * aCoef^eA * bCoef^eB
    const numCoef = c * Math.pow(aCoef, eA) * Math.pow(bCoef, eB);
    const roundedCoef = Math.abs(numCoef - Math.round(numCoef)) < 1e-9
                      ? Math.round(numCoef) : parseFloat(numCoef.toFixed(4));

    // Symbolic parts
    const symAPow = aSym === '' ? '' :
                    eA === 0 ? '' :
                    eA === 1 ? aSym : `${aSym}<sup>${eA}</sup>`;

    const symBPow = bSym === '' ? '' :
                    eB === 0 ? '' :
                    eB === 1 ? bSym : `${bSym}<sup>${eB}</sup>`;

    const symPart = symAPow + symBPow;

    // Build display string
    let termStr;
    if (symPart === '') {
      // Fully numeric term
      termStr = String(roundedCoef);
    } else if (roundedCoef === 1) {
      termStr = symPart;
    } else if (roundedCoef === -1) {
      termStr = `-${symPart}`;
    } else {
      termStr = `${roundedCoef}${symPart}`;
    }

    terms.push({ c, eA, eB, coef: roundedCoef, str: termStr });
  }

  // Check if all terms are purely numeric (no symbolic parts)
  const isFullyNumeric = terms.every(t => aSym === '' && bSym === '');
  const numericTotal = isFullyNumeric
    ? terms.reduce((sum, t) => sum + t.coef, 0)
    : null;

  // Join: handle sign so we never get "+ -" or "+-"
  const expr = terms.map((t, i) => {
    if (i === 0) return t.str;
    if (t.coef < 0) return ` - ${t.str.replace(/^-/, '')}`;
    return ` + ${t.str}`;
  }).join('');

  const totalRow = numericTotal !== null ? `
    <div class="result-answer" style="margin-top:0;border-top:1px solid var(--dark4)">
      <span class="answer-label">Suma total</span>
      <span class="answer-value">${numericTotal.toLocaleString()}</span>
    </div>` : '';

  out.innerHTML = `
    <div class="result-header">Expansión de (${a}+${b})<sup>${n}</sup></div>
    <div class="binom-coef-row">
      <span class="binom-coef-label">Coeficientes (fila ${n} del triángulo de Pascal)</span>
      <div class="binom-coef-list">
        ${terms.map(t => `<span class="binom-coef-chip">${t.c}</span>`).join('')}
      </div>
    </div>
    <div class="binom-terms">
      ${terms.map((t, i) => `
        <div class="binom-term">
          <div class="binom-term-k">k = ${i}</div>
          <div class="binom-term-coef">C(${n},${i}) = ${t.c}</div>
          <div class="binom-term-expr">${t.str}</div>
        </div>`).join('')}
    </div>
    <div class="result-answer" style="margin-top:1.2rem${numericTotal !== null ? ';border-bottom:1px solid var(--dark4)' : ''}">
      <span class="answer-label">${numericTotal !== null ? 'Términos' : 'Resultado'}</span>
      <span class="answer-value" style="font-size:0.9rem;letter-spacing:0">${expr}</span>
    </div>
    ${totalRow}`;

  addLog('bn-log', `(${a}+${b})^${n}`, `[${terms.map(t=>t.c).join(', ')}]`);
}

// ═══════════════════════════════════════
// CALC 3 — Recurrencia
// ═══════════════════════════════════════
function runRec() {
  const a0  = parseFloat(document.getElementById('rec-a0').value);
  const a1  = parseFloat(document.getElementById('rec-a1').value);
  const c1  = parseFloat(document.getElementById('rec-c1').value);
  const c2  = parseFloat(document.getElementById('rec-c2').value);
  const N   = parseInt(document.getElementById('rec-n').value);
  const out = document.getElementById('rec-output');

  if ([a0, a1, c1, c2, N].some(isNaN)) {
    out.innerHTML = '<div class="calc-error">Completa todos los campos.</div>';
    return;
  }
  if (N < 3 || N > 20) {
    out.innerHTML = '<div class="calc-error">N debe estar entre 3 y 20.</div>';
    return;
  }

  const seq = [a0, a1];
  for (let i = 2; i < N; i++) seq.push(c1 * seq[i-1] + c2 * seq[i-2]);

  const fmt = v => Number.isInteger(v) ? v : parseFloat(v.toFixed(3));

  out.innerHTML = `
    <div class="result-header">a<sub>n</sub> = ${c1}·a<sub>n-1</sub> + (${c2})·a<sub>n-2</sub> &nbsp; con a<sub>0</sub>=${a0}, a<sub>1</sub>=${a1}</div>
    <div class="seq-grid">
      ${seq.map((v, i) => `
        <div class="seq-item ${i < 2 ? 'seq-init' : ''}">
          <div class="seq-idx">a<sub>${i}</sub></div>
          <div class="seq-val">${fmt(v)}</div>
          ${i < 2 ? '<div class="seq-tag">inicial</div>' : ''}
        </div>`).join('')}
    </div>`;

  addLog('rec-log', `c₁=${c1}, c₂=${c2}, a₀=${a0}, a₁=${a1}`, `[${seq.map(fmt).join(', ')}]`);
}

// ═══════════════════════════════════════
// CALC 4 — Simulación con barras visuales
// ═══════════════════════════════════════
function runSim() {
  const type = document.getElementById('sim-type').value;
  const N    = parseInt(document.getElementById('sim-n').value);
  const out  = document.getElementById('sim-output');

  if (isNaN(N) || N < 10) {
    out.innerHTML = '<div class="calc-error">El número de lanzamientos debe ser al menos 10.</div>';
    return;
  }

  let faces, labels;
  switch (type) {
    case 'dado6':  faces=6;  labels=['1','2','3','4','5','6']; break;
    case 'dado12': faces=12; labels=Array.from({length:12},(_,i)=>String(i+1)); break;
    case 'dado20': faces=20; labels=Array.from({length:20},(_,i)=>String(i+1)); break;
    case 'moneda': faces=2;  labels=['Cara','Sello']; break;
  }

  const counts = new Array(faces).fill(0);
  for (let i = 0; i < N; i++) counts[Math.floor(Math.random() * faces)]++;

  const theoretical = 1 / faces;
  let maxErr = 0;
  const results = counts.map((c, i) => {
    const pct = c / N;
    const err = Math.abs(pct - theoretical) * 100;
    if (err > maxErr) maxErr = err;
    return { label: labels[i], count: c, pct, err };
  });

  const maxCount = Math.max(...counts);
  const typeLabel = { dado6:'Dado de 6 caras', dado12:'Dado de 12 caras', dado20:'Dado de 20 caras', moneda:'Moneda' }[type];

  // Color del error global
  const errColor = maxErr < 1 ? 'var(--correct)' : maxErr < 3 ? 'var(--gold)' : 'var(--wrong)';

  out.innerHTML = `
    <div class="result-header">${typeLabel} &nbsp;·&nbsp; ${N.toLocaleString()} lanzamientos</div>

    <div class="sim-summary">
      <div class="sim-stat">
        <div class="sim-stat-val">${(theoretical*100).toFixed(2)}%</div>
        <div class="sim-stat-lbl">Probabilidad teórica por resultado</div>
      </div>
      <div class="sim-stat">
        <div class="sim-stat-val" style="color:${errColor}">${maxErr.toFixed(2)}%</div>
        <div class="sim-stat-lbl">Mayor desviación encontrada</div>
      </div>
      <div class="sim-stat">
        <div class="sim-stat-val">${N.toLocaleString()}</div>
        <div class="sim-stat-lbl">Lanzamientos totales</div>
      </div>
    </div>

    <div class="sim-legend">
      <span class="sim-legend-bar ok"></span> Cerca del teórico
      <span class="sim-legend-bar warn" style="margin-left:1rem"></span> Ligera desviación
      <span class="sim-legend-bar bad" style="margin-left:1rem"></span> Desviación notable
      <span class="sim-legend-theory" style="margin-left:1rem">|</span> Valor teórico esperado
    </div>

    <div class="sim-bars">
      ${results.map(r => {
        const barPct  = Math.round((r.count / maxCount) * 100);
        const theoPct = Math.round(theoretical * 100);
        const cls     = r.err < 1 ? 'ok' : r.err < 3 ? 'warn' : 'bad';
        return `
        <div class="sim-bar-row">
          <div class="sim-bar-label">${r.label}</div>
          <div class="sim-bar-track">
            <div class="sim-bar-fill ${cls}" style="width:${barPct}%"></div>
            <div class="sim-bar-theory" title="Valor teórico: ${(theoretical*100).toFixed(2)}%"></div>
          </div>
          <div class="sim-bar-stats">
            <span class="sim-count">${r.count.toLocaleString()}</span>
            <span class="sim-pct">${(r.pct*100).toFixed(2)}%</span>
            <span class="sim-err ${cls}">err ±${r.err.toFixed(2)}%</span>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="sim-note">
      La línea vertical muestra dónde debería estar cada barra si la probabilidad fuera perfectamente uniforme.
      Con más lanzamientos, todas las barras se alinean más cerca de ese punto.
    </div>`;

  addLog('sim-log', `${typeLabel} · N=${N.toLocaleString()}`, `Error máx: ${maxErr.toFixed(2)}%`);
}

// ═══════════════════════════════════════
// CALC 5 — Valor Esperado y Varianza
// ═══════════════════════════════════════
function runProb() {
  const xs  = document.getElementById('prob-x').value.split(',').map(s => parseFloat(s.trim()));
  const ps  = document.getElementById('prob-p').value.split(',').map(s => parseFrac(s.trim()));
  const out = document.getElementById('prob-output');

  if (xs.some(isNaN) || ps.some(isNaN)) {
    out.innerHTML = '<div class="calc-error">Valores inválidos. Usa números separados por comas. Las fracciones como 1/6 también funcionan.</div>';
    return;
  }
  if (xs.length !== ps.length) {
    out.innerHTML = '<div class="calc-error">La cantidad de valores en x y en P(x) no coincide.</div>';
    return;
  }

  const sumP = ps.reduce((a, b) => a + b, 0);
  if (Math.abs(sumP - 1) > 0.015) {
    out.innerHTML = `<div class="calc-error">Las probabilidades suman ${sumP.toFixed(4)}, pero deben sumar exactamente 1. Revisa los valores.</div>`;
    return;
  }

  const E     = xs.reduce((s, x, i) => s + x * ps[i], 0);
  const E2    = xs.reduce((s, x, i) => s + x * x * ps[i], 0);
  const Var   = E2 - E * E;
  const sigma = Math.sqrt(Math.abs(Var));

  const tableRows = xs.map((x, i) => `
    <tr>
      <td>${x}</td>
      <td>${ps[i].toFixed(4)}</td>
      <td>${(x * ps[i]).toFixed(4)}</td>
      <td>${(x * x * ps[i]).toFixed(4)}</td>
    </tr>`).join('');

  out.innerHTML = `
    <div class="result-header">Distribución de probabilidad &nbsp;·&nbsp; ${xs.length} valores</div>

    <div class="dist-table-wrap">
      <table class="dist-table">
        <thead>
          <tr><th>x</th><th>P(x)</th><th>x · P(x)</th><th>x² · P(x)</th></tr>
        </thead>
        <tbody>${tableRows}</tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>${sumP.toFixed(4)}</td>
            <td>${E.toFixed(4)}</td>
            <td>${E2.toFixed(4)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="prob-metrics">
      ${metricCard('E[X]', E.toFixed(4), 'Valor esperado — promedio ponderado')}
      ${metricCard('Var(X)', Var.toFixed(4), `${E2.toFixed(4)} − (${E.toFixed(4)})²`)}
      ${metricCard('σ', sigma.toFixed(4), 'Desviación estándar — √Var(X)')}
    </div>`;

  addLog('prob-log', `E[X]=${E.toFixed(3)}, Var=${Var.toFixed(3)}`, `σ=${sigma.toFixed(3)}`);
}

// ═══════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════
let quizScore    = 0;
let quizAnswered = 0;
const TOTAL_AUTO = 12;

function checkMC(btn, qId, isCorrect) {
  const qDiv = document.getElementById(qId);
  if (qDiv.dataset.answered) return;
  qDiv.dataset.answered = '1';

  const opts = qDiv.querySelectorAll('.quiz-opt');
  opts.forEach(o => o.disabled = true);
  btn.classList.add(isCorrect ? 'correct' : 'wrong');

  if (!isCorrect) {
    opts.forEach(o => {
      if (o.onclick && o.onclick.toString().includes('true')) o.classList.add('correct');
    });
  }

  showFeedback(qId, isCorrect);
  if (isCorrect) quizScore++;
  quizAnswered++;
  checkQuizDone();
}

function checkTF(btn, qId, answer) {
  const qDiv = document.getElementById(qId);
  if (qDiv.dataset.answered) return;
  qDiv.dataset.answered = '1';

  const opts = qDiv.querySelectorAll('.quiz-opt');
  opts.forEach(o => o.disabled = true);

  const fb          = document.getElementById(qId + '-fb');
  const isVerdadero = fb.textContent.startsWith('VERDADERO');
  const isCorrect   = (answer === isVerdadero);

  btn.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) {
    opts.forEach(o => {
      if ((isVerdadero && o.textContent.includes('Verdadero')) ||
          (!isVerdadero && o.textContent.includes('Falso'))) o.classList.add('correct');
    });
  }

  showFeedback(qId, isCorrect);
  if (isCorrect) quizScore++;
  quizAnswered++;
  checkQuizDone();
}

function showFeedback(qId, isCorrect) {
  const fb = document.getElementById(qId + '-fb');
  if (!fb) return;
  fb.classList.add('show', isCorrect ? 'fb-correct' : 'fb-wrong');
  fb.textContent = (isCorrect ? '✓ Correcto. ' : '✗ Incorrecto. ') + fb.textContent;
}

function checkQuizDone() {
  if (quizAnswered >= TOTAL_AUTO) {
    const box = document.getElementById('scoreBox');
    box.style.display = 'block';
    document.getElementById('scoreNum').textContent = `${quizScore} / ${TOTAL_AUTO}`;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function resetQuiz() {
  quizScore    = 0;
  quizAnswered = 0;

  document.querySelectorAll('.quiz-q').forEach(q => {
    delete q.dataset.answered;
    q.querySelectorAll('.quiz-opt').forEach(o => {
      o.disabled = false;
      o.classList.remove('correct', 'wrong');
    });
    const fb = q.querySelector('.quiz-feedback');
    if (fb) {
      fb.textContent = fb.textContent.replace(/^[✓✗] (?:Correcto|Incorrecto)\. /, '');
      fb.classList.remove('show', 'fb-correct', 'fb-wrong');
    }
  });

  document.getElementById('scoreBox').style.display = 'none';
  window.scrollTo({ top: document.getElementById('cuestionario').offsetTop, behavior: 'smooth' });
}
