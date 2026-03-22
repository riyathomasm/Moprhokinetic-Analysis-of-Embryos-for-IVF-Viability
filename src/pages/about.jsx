import "./About.css";

function About() {
  return (
    <div className="about-wrapper">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-badge">Research Project</div>
        <h1 className="about-title">
          Morphokinetic Analysis and<br />
          <span className="about-title-accent">Classification of Embryo Viability</span>
        </h1>
        <p className="about-lead">
          A multi-stage spatio-temporal AI system designed to bridge the gap between
          static morphological grading and morphokinetic time-lapse analysis in
          assisted reproductive technology.
        </p>
        <div className="about-meta">
          <span>SRM Institute of Science and Technology</span>
          <span className="about-meta-dot" />
          <span>Dept. of Computing Technologies</span>
          <span className="about-meta-dot" />
          <span>Kattankalathur, Chennai</span>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-section-label">The Problem</div>
          <h2 className="about-section-title">Why existing systems fall short</h2>
          <div className="about-prose">
            <p>
              Infertility affects approximately 17.5% of the global adult population, with
              In Vitro Fertilization being the most widely used assisted reproductive technology.
              However, IVF success rates remain limited primarily due to difficulties in
              identifying the most viable embryo for transfer.
            </p>
            <p>
              Traditional embryo grading relies on static morphological assessment by
              embryologists — a process that is time-consuming, subjective, and highly
              variable between practitioners. Widely used systems such as Gardner's criteria
              fail to capture subtle dynamic features that are strong predictors of viability.
            </p>
            <p>
              More recent AI approaches operate in isolation: either on static images or
              time-lapse kinematics, without considering the holistic context. The absence
              of transparency in these models further hinders clinical adoption.
            </p>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="about-section about-section--alt">
        <div className="about-section-inner">
          <div className="about-section-label">Our Approach</div>
          <h2 className="about-section-title">A dual-model audit system</h2>
          <div className="about-models">

            <div className="about-model-card">
              <div className="about-model-num">Model 1</div>
              <h3 className="about-model-name">Spatial Morphological Model</h3>
              <div className="about-model-arch">EfficientNet-B0</div>
              <p className="about-model-desc">
                Performs binary viability classification from static embryo images.
                Fine-tuned on the HVWC 2023 World Championship embryo classification
                dataset, the model evaluates morphological integrity including blastomere
                symmetry, fragmentation, cytoplasmic texture, and zona pellucida characteristics.
              </p>
              <div className="about-model-tags">
                <span>Binary classification</span>
                <span>224x224 input</span>
                <span>ImageNet pre-trained</span>
                <span>5 morphological axes</span>
              </div>
            </div>

            <div className="about-model-connector">
              <div className="about-connector-line" />
              <div className="about-connector-label">Secondary Audit Logic</div>
              <div className="about-connector-line" />
            </div>

            <div className="about-model-card about-model-card--teal">
              <div className="about-model-num about-model-num--teal">Model 2</div>
              <h3 className="about-model-name">Spatio-Temporal Model</h3>
              <div className="about-model-arch about-model-arch--teal">EfficientNet-B0 + GRU</div>
              <p className="about-model-desc">
                Processes 16-frame temporal sequences to classify 14 critical developmental
                phases — from pronuclei appearance through expanded blastocyst. The CNN
                backbone extracts per-frame spatial features, which are passed through a
                two-layer GRU to capture developmental velocity and phase transitions.
              </p>
              <div className="about-model-tags">
                <span>14 morphokinetic phases</span>
                <span>16-frame sequences</span>
                <span>Hidden size 512</span>
                <span>704 embryo videos</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PHASES */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-section-label">Morphokinetic Phases</div>
          <h2 className="about-section-title">14 developmental milestones tracked</h2>
          <div className="about-phases-grid">
            {[
              { phase: 'tPNa',  time: '0–5h',    desc: 'Pronuclei appearance' },
              { phase: 'tPNf',  time: '5–10h',   desc: 'Pronuclei fading' },
              { phase: 't2',    time: '25–28h',  desc: '2-cell division' },
              { phase: 't3',    time: '35–38h',  desc: '3-cell stage' },
              { phase: 't4',    time: '37–40h',  desc: '4-cell division' },
              { phase: 't5',    time: '48–52h',  desc: '5-cell stage' },
              { phase: 't6',    time: '50–54h',  desc: '6-cell stage' },
              { phase: 't7',    time: '52–56h',  desc: '7-cell stage' },
              { phase: 't8',    time: '54–58h',  desc: '8-cell division' },
              { phase: 't9+',   time: '58–65h',  desc: '9+ cell compaction' },
              { phase: 'tM',    time: '72–80h',  desc: 'Morula stage' },
              { phase: 'tSB',   time: '90–96h',  desc: 'Early blastocyst' },
              { phase: 'tB',    time: '96–108h', desc: 'Blastocyst' },
              { phase: 'tEB',   time: '108–120h',desc: 'Expanded blastocyst' },
            ].map(({ phase, time, desc }) => (
              <div className="about-phase-item" key={phase}>
                <div className="about-phase-name">{phase}</div>
                <div className="about-phase-time">{time}</div>
                <div className="about-phase-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATASET */}
      <section className="about-section about-section--alt">
        <div className="about-section-inner">
          <div className="about-section-label">Dataset</div>
          <h2 className="about-section-title">Training data</h2>
          <div className="about-datasets">
            <div className="about-dataset-card">
              <div className="about-dataset-title">HVWC 2023</div>
              <div className="about-dataset-sub">World Championship Embryo Classification</div>
              <p>Static embryo images with binary viability labels used to train the spatial EfficientNet-B0 classifier.</p>
              <div className="about-dataset-stats">
                <div><strong>Task</strong>Binary classification</div>
                <div><strong>Classes</strong>Viable / Non-Viable</div>
                <div><strong>Input</strong>Static JPEG images</div>
              </div>
            </div>
            <div className="about-dataset-card">
              <div className="about-dataset-title">Gomez et al. 2022</div>
              <div className="about-dataset-sub">Human Embryo Time-Lapse Video Dataset</div>
              <p>704 fully annotated time-lapse embryo videos across 7 focal planes with 16 developmental phase annotations. Published on Zenodo (DOI: 10.5281/zenodo.6390798).</p>
              <div className="about-dataset-stats">
                <div><strong>Videos</strong>704 embryos</div>
                <div><strong>Phases</strong>16 annotated</div>
                <div><strong>Images</strong>2.4M total frames</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEYWORDS */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-section-label">Keywords</div>
          <div className="about-keywords">
            {[
              'In Vitro Fertilization',
              'Embryo Viability',
              'Morphokinetics',
              'EfficientNet-B0',
              'Gated Recurrent Unit',
              'Time-Lapse Imaging',
              'Reproductive Health',
              'Deep Learning',
              'Binary Classification',
              'Spatio-Temporal Analysis',
              'Blastocyst Assessment',
              'Assisted Reproductive Technology',
            ].map(k => (
              <span className="about-keyword" key={k}>{k}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;