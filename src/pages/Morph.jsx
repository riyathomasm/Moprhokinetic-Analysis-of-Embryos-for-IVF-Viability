import { useState } from 'react';
import './Morph.css';

const PHASE_ORDER = [
  'tPNa','tPNf','t2','t3','t4','t5','t6','t7','t8','t9+','tM','tSB','tB','tEB'
];

function PhaseBar({ phase, data, maxHour }) {
  const left  = (data.start_hour / maxHour) * 100;
  const width = Math.max(((data.end_hour - data.start_hour) / maxHour) * 100, 1);
  const color = data.on_time ? '#16a34a' : '#dc2626';
  return (
    <div className="phase-row">
      <div className="phase-label">{phase}</div>
      <div className="phase-track">
        <div className="phase-bar" style={{ left: `${left}%`, width: `${width}%`, background: color }}
          title={`${data.description} | ${data.start_hour}h–${data.end_hour}h | ${(data.confidence*100).toFixed(0)}%`}
        />
      </div>
      <div className="phase-conf">{(data.confidence * 100).toFixed(0)}%</div>
    </div>
  );
}

function RadarChart({ timeline, viable }) {
  if (!timeline || timeline.length === 0) return null;
  const axes = ['tPNa', 't2', 't4', 't8', 'tEB'];
  const cx = 110, cy = 110, r = 80;
  const step = (Math.PI * 2) / axes.length;
  const getPoint = (val, i) => {
    const x = cx + r * val * Math.cos(i * step - Math.PI / 2);
    const y = cy + r * val * Math.sin(i * step - Math.PI / 2);
    return `${x},${y}`;
  };
  const phaseMap = {};
  timeline.forEach(t => { phaseMap[t.phase] = t; });
  const values = axes.map(a => phaseMap[a] ? phaseMap[a].confidence : 0);
  const points = values.map((v, i) => getPoint(v, i)).join(' ');
  const color  = viable ? '#16a34a' : '#dc2626';
  const levels = [0.25, 0.5, 0.75, 1.0];
  return (
    <svg viewBox="0 0 220 220" style={{ width: '100%', maxWidth: 220 }}>
      {levels.map(l => (
        <polygon key={l}
          points={axes.map((_, i) => getPoint(l, i)).join(' ')}
          fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const x = cx + r * Math.cos(i * step - Math.PI / 2);
        const y = cy + r * Math.sin(i * step - Math.PI / 2);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
      })}
      <polygon points={points} fill={`${color}33`} stroke={color} strokeWidth="2" />
      {axes.map((ax, i) => {
        const x = cx + (r + 18) * Math.cos(i * step - Math.PI / 2);
        const y = cy + (r + 18) * Math.sin(i * step - Math.PI / 2);
        return (
          <text key={ax} x={x} y={y} textAnchor="middle" dominantBaseline="central"
            fontSize="10" fill="#64748b" fontWeight="600">{ax}</text>
        );
      })}
    </svg>
  );
}

function Morph() {
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setScanning] = useState(false);
  const [morphData, setMorphData] = useState(null);
  const [error, setError]     = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setMorphData(null);
    setError(null);
  };

  const runAudit = async () => {
    if (!image) { setError('Please upload an embryo image first.'); return; }
    setScanning(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('image', image);
      const res = await fetch('https://moprhokinetic-analysis-of-embryos-for.onrender.com', {
        method: 'POST', body: form
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMorphData(await res.json());
    } catch (err) {
      setError(`${err.message} — ensure backend is running on port 8001`);
    } finally {
      setScanning(false);
    }
  };

  const timelineMap = {};
  morphData?.timeline?.forEach(t => { timelineMap[t.phase] = t; });
  const maxHour = morphData?.timeline
    ? Math.max(...morphData.timeline.map(t => t.end_hour), 120) : 120;

  const suitColor = { HIGH: '#16a34a', MED: '#d97706', LOW: '#dc2626' }[morphData?.suitability] || '#64748b';

  return (
    <div className="morph-wrapper">
      <div className="morph-header">
        <h1 className="morph-page-title">Morphokinetic Temporal Audit</h1>
        <p className="morph-page-subtitle">
          EfficientNet-B0 + GRU temporal classifier — maps 14 developmental phases from pronuclei appearance through expanded blastocyst.
        </p>
      </div>

      <div className="morph-grid">

        {/* CONTROL */}
        <div className="box control-box">
          <div className="upload-area">
            <label className="upload-label">
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
              {preview
                ? <img src={preview} alt="preview" className="upload-preview" />
                : <div className="upload-placeholder">Click to upload embryo image</div>
              }
            </label>
          </div>
          <div className="control-actions">
            <h2 className="morph-title">Phase Timeline Analysis</h2>
            <p className="morph-subtitle">
              Upload a static embryo image. The system assesses viability and generates
              a full 14-phase morphokinetic developmental timeline with confidence scores.
            </p>
            <button className="scan-btn" onClick={runAudit} disabled={isScanning || !image}>
              {isScanning ? 'Scanning...' : 'Run Morphokinetic Audit'}
            </button>
            {error && <p className="error-msg">{error}</p>}
            {morphData?.note && <p className="note-msg">{morphData.note}</p>}
          </div>
        </div>

        {/* RADAR + TIMELINE */}
        <div className="morph-two-col">
          <div className="box radar-box">
            <div className="box-title">Phase Confidence Signature</div>
            {morphData ? (
              <div className="radar-wrap">
                <RadarChart timeline={morphData.timeline} viable={morphData.viable} />
                <p className="radar-sub">{morphData.total_phases_detected} / 14 phases detected</p>
              </div>
            ) : (
              <div className="placeholder-text">Run audit to see radar</div>
            )}
          </div>

          <div className="box timeline-box">
            <div className="box-title">Developmental Timeline (hours post-fertilization)</div>
            {morphData ? (
              <div className="timeline-wrap">
                <div className="timeline-axis">
                  {[0, 30, 60, 90, 120].map(h => (
                    <span key={h} style={{ left: `${(h / maxHour) * 100}%` }}>{h}h</span>
                  ))}
                </div>
                {PHASE_ORDER.map(phase => timelineMap[phase] ? (
                  <PhaseBar key={phase} phase={phase} data={timelineMap[phase]} maxHour={maxHour} />
                ) : (
                  <div className="phase-row missing" key={phase}>
                    <div className="phase-label">{phase}</div>
                    <div className="phase-track"><div className="phase-missing">not detected</div></div>
                    <div className="phase-conf">—</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="placeholder-text">Timeline appears after audit</div>
            )}
          </div>
        </div>

        {/* VERDICT */}
        <div className="box verdict-box" style={{ borderLeftColor: suitColor }}>
          {morphData ? (
            <>
              <div className="verdict-header">
                <span className="verdict-label">IVF Suitability</span>
                <span className="verdict-score" style={{ color: suitColor }}>
                  {morphData.suitability}
                </span>
              </div>
              <ul className="verdict-reasons">
                {morphData.reasons.map((r, i) => (
                  <li key={i}>
                    <span className="reason-dot" style={{ background: suitColor }} />
                    {r}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="placeholder-text">Verdict appears after audit</div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Morph;