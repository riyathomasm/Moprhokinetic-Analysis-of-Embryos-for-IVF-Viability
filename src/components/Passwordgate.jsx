import { useState } from "react";
import "./Passwordgate.css";

const PASSWORD = "redzero_m3";

function PasswordGate({ children }) {
  const [input, setInput]     = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError]     = useState(false);

  if (unlocked) return children;

  const attempt = () => {
    if (input === PASSWORD) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div className="gate-wrapper">
      <div className="gate-card">
        <div className="gate-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 className="gate-title">Restricted Access</h2>
        <p className="gate-subtitle">This section requires authorisation to access.</p>
        <input
          className={`gate-input ${error ? "gate-input--error" : ""}`}
          type="password"
          placeholder="Enter access code"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          autoFocus
        />
        {error && <p className="gate-error">Incorrect access code.</p>}
        <button className="gate-btn" onClick={attempt}>Continue</button>
      </div>
    </div>
  );
}

export default PasswordGate;