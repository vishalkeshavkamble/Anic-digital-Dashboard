import { useEffect, useRef, useState } from 'react';

const TAGLINES = [
  'Run your agency on autopilot',
  'Onboard. Engage. Get paid.',
  'One workspace. Every client.',
  'Pipeline → Payments, in minutes',
];

function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function useTypewriter(words, speed = 55, hold = 1500) {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('typing');
  useEffect(() => {
    const word = words[i % words.length];
    let to;
    if (phase === 'typing') {
      if (text.length < word.length) {
        to = setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
      } else {
        to = setTimeout(() => setPhase('deleting'), hold);
      }
    } else {
      if (text.length > 0) {
        to = setTimeout(() => setText(word.slice(0, text.length - 1)), speed / 2);
      } else {
        setPhase('typing');
        setI((n) => n + 1);
      }
    }
    return () => clearTimeout(to);
  }, [text, phase, i, words, speed, hold]);
  return text;
}

function Sparkline() {
  const points = [12, 18, 14, 22, 19, 28, 24, 34, 30, 42, 38, 52];
  const w = 220, h = 60, pad = 4;
  const max = Math.max(...points), min = Math.min(...points);
  const stepX = (w - pad * 2) / (points.length - 1);
  const path = points
    .map((p, idx) => {
      const x = pad + idx * stepX;
      const y = h - pad - ((p - min) / (max - min)) * (h - pad * 2);
      return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const area = `${path} L${pad + (points.length - 1) * stepX},${h} L${pad},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="anic-spark w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="anic-spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="anic-spark-stroke" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#anic-spark-fill)" stroke="none" />
      <path d={path} fill="none" stroke="url(#anic-spark-stroke)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniBars() {
  const heights = [38, 60, 48, 78, 66, 92, 74];
  return (
    <div className="flex items-end gap-1.5 h-12">
      {heights.map((h, i) => (
        <div
          key={i}
          className="anic-bar w-2 rounded-sm bg-gradient-to-t from-indigo-500 to-fuchsia-400"
          style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}

export default function AnicSaasCard({ mrr = 285, clients = 12, pipeline = 740, conversion = 38 }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const tagline = useTypewriter(TAGLINES);

  const mrrV = useCountUp(mrr);
  const clientsV = useCountUp(clients);
  const pipelineV = useCountUp(pipeline);
  const convV = useCountUp(conversion);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 4, ry: x * 6 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="anic-card text-white shadow-2xl shadow-indigo-900/30"
      style={{
        background:
          'linear-gradient(135deg, #0b1020 0%, #11173a 45%, #1a0f3d 100%)',
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
    >
      {/* Animated background layers */}
      <div className="anic-aurora a1" />
      <div className="anic-aurora a2" />
      <div className="anic-aurora a3" />
      <div className="anic-grid" />
      <div className="anic-shine" />
      <div className="anic-glow-border" />

      {/* Orbiting particles */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
        <div className="anic-orbit" style={{ '--r': '180px', animationDuration: '18s' }}>
          <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_2px_rgba(103,232,249,0.8)]" />
        </div>
        <div className="anic-orbit" style={{ '--r': '240px', animationDuration: '26s', animationDirection: 'reverse' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-pink-300 shadow-[0_0_10px_2px_rgba(249,168,212,0.8)]" />
        </div>
        <div className="anic-orbit" style={{ '--r': '120px', animationDuration: '12s' }}>
          <div className="w-1 h-1 rounded-full bg-indigo-200" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-7 md:p-9 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
        {/* Left: brand + tagline + KPIs */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="anic-float-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-pink-500 text-white p-3 rounded-2xl font-black text-xl shadow-lg shadow-fuchsia-500/30">
                AD
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 anic-pulse-dot" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-indigo-200/80">Anic Digital</p>
              <p className="text-xs text-white/60">Agency Command Center</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 anic-pulse-dot" />
              Live
            </span>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-white via-indigo-100 to-pink-200 bg-clip-text text-transparent">
                Welcome back to Anic Digital
              </span>
            </h2>
            <p className="mt-2 text-base md:text-lg text-indigo-100/85 min-h-[1.75rem]">
              {tagline}
              <span className="anic-caret h-5 align-[-2px]" />
            </p>
          </div>

          {/* KPI chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'MRR',        value: `₹${mrrV}K`,      tint: 'from-indigo-500/30 to-indigo-500/0',  ring: 'ring-indigo-300/30' },
              { label: 'Clients',    value: clientsV,         tint: 'from-emerald-500/30 to-emerald-500/0', ring: 'ring-emerald-300/30' },
              { label: 'Pipeline',   value: `₹${pipelineV}K`, tint: 'from-fuchsia-500/30 to-fuchsia-500/0', ring: 'ring-fuchsia-300/30' },
              { label: 'Conversion', value: `${convV}%`,      tint: 'from-cyan-500/30 to-cyan-500/0',       ring: 'ring-cyan-300/30' },
            ].map((k, i) => (
              <div
                key={k.label}
                className={`anic-fade-in relative rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm px-3.5 py-3 ring-1 ${k.ring} overflow-hidden`}
                style={{ animationDelay: `${150 + i * 120}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${k.tint} pointer-events-none`} />
                <p className="relative text-[10px] uppercase tracking-wider text-white/60">{k.label}</p>
                <p className="relative text-xl font-bold mt-0.5 tabular-nums">{k.value}</p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-sm shadow-lg shadow-black/30 hover:shadow-xl transition-shadow overflow-hidden">
              <span className="relative z-10">✦ Onboard a client</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-0.5">→</span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-200/0 via-indigo-200/60 to-indigo-200/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-sm backdrop-blur transition-colors">
              ◉ View pipeline
            </button>
            <div className="flex items-center gap-1.5 text-xs text-white/60 ml-1">
              <span className="flex -space-x-2">
                {['#f472b6', '#818cf8', '#22d3ee'].map((c) => (
                  <span key={c} className="w-6 h-6 rounded-full ring-2 ring-[#11173a]" style={{ background: c }} />
                ))}
              </span>
              <span>4 reps online</span>
            </div>
          </div>
        </div>

        {/* Right: animated mini-dashboard */}
        <div className="relative">
          <div className="anic-float relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 shadow-xl shadow-black/30">
            {/* window chrome */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-white/50">overview · live</span>
            </div>

            {/* sparkline */}
            <div className="h-16">
              <Sparkline />
            </div>

            {/* metric row */}
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/55">Revenue (30d)</p>
                <p className="text-2xl font-bold tabular-nums">
                  ₹{mrrV * 4}<span className="text-sm text-emerald-300 font-semibold ml-1">▲ 12.4%</span>
                </p>
              </div>
              <MiniBars />
            </div>

            {/* mini list */}
            <div className="mt-4 space-y-2">
              {[
                { c: '#22d3ee', t: 'Acme Co.',     s: 'Onboarded',  v: '₹45K' },
                { c: '#f472b6', t: 'Northwind',    s: 'Proposal',   v: '₹120K' },
                { c: '#a78bfa', t: 'Globex Studios', s: 'Negotiation', v: '₹85K' },
              ].map((row, i) => (
                <div
                  key={row.t}
                  className="anic-fade-in flex items-center gap-2.5 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                  style={{ animationDelay: `${600 + i * 140}ms` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.c, boxShadow: `0 0 8px ${row.c}` }} />
                  <span className="font-medium text-white/90 truncate">{row.t}</span>
                  <span className="text-white/45">·</span>
                  <span className="text-white/55 truncate">{row.s}</span>
                  <span className="ml-auto font-semibold tabular-nums text-white/85">{row.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* floating notification */}
          <div
            className="anic-fade-in anic-float absolute -bottom-3 -left-3 md:-left-6 max-w-[230px] rounded-xl bg-slate-900/85 border border-white/15 backdrop-blur px-3 py-2.5 shadow-2xl shadow-black/50"
            style={{ animationDelay: '900ms' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 grid place-items-center text-base">₹</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-tight">Payment received</p>
                <p className="text-[11px] text-white/60 truncate">Acme Co. · ₹45,000</p>
              </div>
            </div>
          </div>

          {/* floating badge */}
          <div
            className="anic-fade-in absolute -top-3 -right-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 shadow-lg shadow-fuchsia-500/40 uppercase tracking-wider"
            style={{ animationDelay: '700ms' }}
          >
            v5.0 · New
          </div>
        </div>
      </div>
    </div>
  );
}
