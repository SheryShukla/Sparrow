import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPass.css";
import { useUserAuth } from "../../context/UserAuthContext";

// ── Sparrow bird icon (same as Login/Signup) ──
const SparrowIcon = () => (
  <svg className="bird-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M28 8c-1.5 1-3 1.5-4.5 1.5C22 7.5 20 6 17.5 6c-3.3 0-6 2.7-6 6 0 .5 0 .9.1 1.4C7.7 13.1 4.1 11 2 8c-.5.8-.7 1.8-.7 2.8 0 2 1 3.7 2.5 4.7-.9 0-1.8-.3-2.5-.7v.1c0 2.8 2 5.1 4.6 5.6-.5.1-1 .2-1.5.2-.4 0-.7 0-1.1-.1.7 2.3 2.8 3.9 5.3 4C6.8 25.8 4.5 26.5 2 26.5c-.4 0-.7 0-1-.1C3.6 27.9 6.5 29 9.7 29c11.6 0 18-9.6 18-18v-.8C29 9.5 28.6 8.8 28 8z"
      fill="white"
      opacity="0.9"
    />
  </svg>
);

// ── Password Generator: only uppercase + lowercase letters, no numbers, no special chars ──
const generatePassword = (length = 12) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const all = upper + lower;

  // Guarantee at least 2 uppercase and 2 lowercase
  let password =
    upper[Math.floor(Math.random() * upper.length)] +
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    lower[Math.floor(Math.random() * lower.length)];

  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle the password so guaranteed chars aren't always at front
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

// ── Check if user has already requested reset today ──
const hasRequestedToday = (identifier) => {
  const key = `fp_last_${identifier}`;
  const lastRequest = localStorage.getItem(key);
  if (!lastRequest) return false;

  const lastDate = new Date(lastRequest).toDateString();
  const today = new Date().toDateString();
  return lastDate === today;
};

// ── Store today's request ──
const storeRequest = (identifier) => {
  const key = `fp_last_${identifier}`;
  localStorage.setItem(key, new Date().toISOString());
};

// ── Steps ──
const STEP = {
  FORM: "form",         // Enter email or phone
  GENERATED: "generated", // Show generated password
  SUCCESS: "success",   // Done
};

const ForgotPass = () => {
  const [method, setMethod] = useState("email"); // "email" or "phone"
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState(STEP.FORM);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  // ── Handle form submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setWarning("");

    if (!identifier.trim()) {
      setError(`Please enter your ${method === "email" ? "email address" : "phone number"}.`);
      return;
    }

    // ── Rate limit check: 1 per day ──
    if (hasRequestedToday(identifier)) {
      setWarning(
        "You have already requested a password reset today. Please use only 1 time per day. Try again tomorrow."
      );
      return;
    }

    setIsLoading(true);

    try {
      // ── Check if user exists in MongoDB ──
      const endpoint =
        method === "email"
          ? `http://localhost:5000/loggedinuser?email=${identifier}`
          : `http://localhost:5000/userbyphone?phone=${identifier}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!data || data.length === 0) {
        setError(
          `No account found with this ${method === "email" ? "email address" : "phone number"}.`
        );
        setIsLoading(false);
        return;
      }

      // ── Generate password ──
      const newPassword = generatePassword(12);
      setGeneratedPassword(newPassword);

      // ── Log reset request to backend ──
      await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ identifier, method }),
      });

      // ── Store rate limit in localStorage ──
      storeRequest(identifier);

      setStep(STEP.GENERATED);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setIsLoading(false);
  };

  // ── Copy password to clipboard ──
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Regenerate a new password ──
  const handleRegenerate = () => {
    setGeneratedPassword(generatePassword(12));
    setCopied(false);
  };

  return (
    <div className="login-container">

      {/* ── Left brand panel ── */}
      <div className="image-container">
        <div className="brand-logo">
          <SparrowIcon />
          <span>Sparrow</span>
        </div>

        <div className="brand-tagline">
          <h1>
            Reset your<br />
            <em>password</em>
          </h1>
          <p>
            We'll help you get back into your account safely and securely.
          </p>
        </div>

        <div className="brand-footer">© 2025 Sparrow</div>
      </div>

      {/* ── Right form panel ── */}
      <div className="form-container">
        <div className="form-box">

          {/* ════ STEP 1: Enter email/phone ════ */}
          {step === STEP.FORM && (
            <>
              <div className="form-header">
                <h2>Forgot password?</h2>
                <p>Enter your email or phone number to get a new password.</p>
              </div>

              {/* ── Warning (rate limit hit) ── */}
              {warning && (
                <div className="fp-warning">
                  <span className="fp-warning__icon">⚠️</span>
                  <span>{warning}</span>
                </div>
              )}

              {/* ── Error ── */}
              {error && <p className="errorMessage">{error}</p>}

              {/* ── Toggle: Email / Phone ── */}
              <div className="fp-toggle">
                <button
                  type="button"
                  className={`fp-toggle__btn ${method === "email" ? "active" : ""}`}
                  onClick={() => { setMethod("email"); setIdentifier(""); setError(""); setWarning(""); }}
                >
                  Email
                </button>
                <button
                  type="button"
                  className={`fp-toggle__btn ${method === "phone" ? "active" : ""}`}
                  onClick={() => { setMethod("phone"); setIdentifier(""); setError(""); setWarning(""); }}
                >
                  Phone Number
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <div className="input-wrapper">
                    <label>{method === "email" ? "Email Address" : "Phone Number"}</label>
                    <input
                      type={method === "email" ? "email" : "tel"}
                      placeholder={method === "email" ? "you@example.com" : "+91 98765 43210"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                <div className="btn-login">
                  <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? "Checking..." : "Get New Password"}
                  </button>
                </div>
              </form>

              <div className="signup-footer">
                Remember your password?
                <Link to="/login">Sign In</Link>
              </div>
            </>
          )}

          {/* ════ STEP 2: Show generated password ════ */}
          {step === STEP.GENERATED && (
            <>
              <div className="form-header">
                <h2>Your new password</h2>
                <p>
                  Use this generated password to sign in. Copy it before leaving this page.
                </p>
              </div>

              {/* ── Password display box ── */}
              <div className="fp-password-box">
                <div className="fp-password-box__label">Generated Password</div>
                <div className="fp-password-box__value">
                  <span className="fp-password-box__text">{generatedPassword}</span>
                  <button
                    className={`fp-password-box__copy ${copied ? "copied" : ""}`}
                    onClick={handleCopy}
                    type="button"
                  >
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
                <p className="fp-password-box__hint">
                  This password contains only uppercase and lowercase letters.
                </p>
              </div>

              {/* ── Regenerate button ── */}
              <button
                type="button"
                className="fp-regen-btn"
                onClick={handleRegenerate}
              >
                🔄 Generate a different password
              </button>

              {/* ── Instructions ── */}
              <div className="fp-instructions">
                <p><strong>What to do next:</strong></p>
                <ol>
                  <li>Copy the password above.</li>
                  <li>Go to Sign In and enter your {method}.</li>
                  <li>Use this as your password.</li>
                  <li>Change it from your profile settings after logging in.</li>
                </ol>
              </div>

              <div className="btn-login" style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate("/login")}
                >
                  Go to Sign In
                </button>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
};

export default ForgotPass;