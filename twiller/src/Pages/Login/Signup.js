import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import "./login.css";

const SparrowIcon = () => (
  <svg className="bird-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M28 8c-1.5 1-3 1.5-4.5 1.5C22 7.5 20 6 17.5 6c-3.3 0-6 2.7-6 6 0 .5 0 .9.1 1.4C7.7 13.1 4.1 11 2 8c-.5.8-.7 1.8-.7 2.8 0 2 1 3.7 2.5 4.7-.9 0-1.8-.3-2.5-.7v.1c0 2.8 2 5.1 4.6 5.6-.5.1-1 .2-1.5.2-.4 0-.7 0-1.1-.1.7 2.3 2.8 3.9 5.3 4C6.8 25.8 4.5 26.5 2 26.5c-.4 0-.7 0-1-.1C3.6 27.9 6.5 29 9.7 29c11.6 0 18-9.6 18-18v-.8C29 9.5 28.6 8.8 28 8z"
      fill="white"
      opacity="0.9"
    />
  </svg>
);

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password);
      const user = { username, name, email };
      fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then(() => navigate("/"));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
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
            Your voice,<br /><em>amplified</em>
          </h1>
          <p>
            Create your account and start sharing thoughts, stories, and moments with the world.
          </p>
        </div>

        <div className="brand-footer">© 2025 Sparrow</div>
      </div>

      {/* ── Right form panel ── */}
      <div className="form-container">
        <div className="form-box">

          <div className="form-header">
            <h2>Create account</h2>
            <p>Join Sparrow today — it's free</p>
          </div>

          {error && <p className="errorMessage">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-wrapper">
                <label>Username</label>
                <input
                  type="text"
                  className="display-name"
                  placeholder="@username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <label>Full Name</label>
                <input
                  type="text"
                  className="display-name"
                  placeholder="Jane Doe"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <label>Email</label>
                <input
                  type="email"
                  className="email"
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <label>Password</label>
                <input
                  type="password"
                  className="password"
                  placeholder="Create a password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="btn-login">
              <button type="submit" className="btn">
                Create Account
              </button>
            </div>
          </form>

          <div className="divider">
            <span>or sign up with</span>
          </div>

          <GoogleButton
            className="g-btn"
            type="light"
            onClick={handleGoogleSignIn}
          />

          <div className="signup-footer">
            Already have an account?
            <Link to="/login">Sign In</Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Signup;