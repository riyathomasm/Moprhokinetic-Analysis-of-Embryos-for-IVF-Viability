import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Analysis from "./pages/Analysis";
import Morph from "./pages/Morph";
import About from "./pages/About";
import PasswordGate from "./components/Passwordgate";
import "./App.css";

function Home() {
  return (
    <div className="home-wrapper">
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">AI-Powered Reproductive Medicine</div>
          <h1 className="hero-title">
            Intelligent Embryo<br />
            <span className="hero-title-accent">Viability Assessment</span>
          </h1>
          <p className="hero-subtitle">
            A dual-model AI system combining static morphological grading with
            morphokinetic temporal analysis — designed to support embryologists
            in making evidence-based IVF transfer decisions.
          </p>
          <div className="hero-actions">
            <Link to="/analyse" className="btn-primary">
              Start Analysis
            </Link>
            <Link to="/morph" className="btn-secondary">
              Morphokinetic Audit
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-label">Spatial Model</div>
            <div className="visual-model">EfficientNet-B0</div>
            <div className="visual-desc">Binary viability classification from static embryo images</div>
            <div className="visual-metric"><span>Morphological</span><span>Grading</span></div>
          </div>
          <div className="visual-connector">
            <div className="connector-line" />
            <div className="connector-dot" />
            <div className="connector-line" />
          </div>
          <div className="visual-card visual-card--teal">
            <div className="visual-label">Temporal Model</div>
            <div className="visual-model">EfficientNet + GRU</div>
            <div className="visual-desc">14-phase morphokinetic classification from time-lapse sequences</div>
            <div className="visual-metric"><span>Kinetic</span><span>Analysis</span></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-inner">
          <h2 className="features-title">How it works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>
              <h3>Upload Embryo Image</h3>
              <p>Submit a static microscopy image of the embryo for immediate morphological evaluation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">02</div>
              <h3>Spatial Model Inference</h3>
              <p>EfficientNet-B0 classifies viability and extracts morphological features including symmetry, fragmentation, and texture.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">03</div>
              <h3>Morphokinetic Audit</h3>
              <p>The temporal model maps 14 developmental phases — from pronuclei formation through expanded blastocyst — against expected timing windows.</p>
            </div>
            <div className="feature-card">
              <div className="feature-number">04</div>
              <h3>Combined Verdict</h3>
              <p>A secondary audit logic fuses spatial and kinetic outputs to produce a final IVF suitability recommendation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stats-inner">
          <div className="stat">
            <div className="stat-value">14</div>
            <div className="stat-label">Developmental phases tracked</div>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <div className="stat-value">704</div>
            <div className="stat-label">Time-lapse embryo sequences</div>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <div className="stat-value">2</div>
            <div className="stat-label">Complementary AI models</div>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <div className="stat-value">5</div>
            <div className="stat-label">Morphological axes evaluated</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>EmbryoVision — SRM Institute of Science and Technology</p>
        <p>Dept. of Computing Technologies</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyse" element={
          <PasswordGate><Analysis /></PasswordGate>
        } />
        <Route path="/morph" element={
          <PasswordGate><Morph /></PasswordGate>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;