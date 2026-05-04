import React, { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { detectBrowserInfo, isMobileAccessAllowed, getISTTimeString } from "../hooks/useDeviceDetect";
import "./ProtectedRoute.css";

const MobileTimeBlock = () => {
  const [currentTime, setCurrentTime] = useState(getISTTimeString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getISTTimeString()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="guard__screen">
      <div className="guard__card">
        <div className="guard__icon">📱</div>
        <h2>Mobile Access Restricted</h2>
        <p>
          Mobile access to Sparrow is only available between{" "}
          <strong>10:00 AM – 1:00 PM IST</strong>.
        </p>
        <div className="guard__time-box">
          <span className="guard__time-label">Current IST Time</span>
          <span className="guard__time-value">{currentTime}</span>
        </div>
        <p className="guard__hint">Please come back during the allowed time window.</p>
      </div>
    </div>
  );
};
const ChromeOTPModal = ({ user, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    handleSendOTP();
  }, []);

  const handleSendOTP = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/send-login-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setSuccess(`OTP sent to ${user.email}`);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Server error. Please try again.");
    }
    setSending(false);
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/verify-login-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: user.email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        onVerified();
      } else {
        setError(data.message || "Invalid or expired OTP.");
      }
    } catch {
      setError("Server error. Please try again.");
    }
    setVerifying(false);
  };

  return (
    <div className="guard__screen">
      <div className="guard__card">
        <div className="guard__icon">🔐</div>
        <h2>Chrome Verification Required</h2>
        <p>
          A one-time password has been sent to{" "}
          <strong>{user?.email}</strong>. Enter it below to continue.
        </p>

        {success && <div className="guard__success">{success}</div>}
        {error   && <div className="guard__error">{error}</div>}

        <div className="guard__otp-input-wrap">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="guard__otp-input"
          />
        </div>

        <button
          className="guard__btn guard__btn--primary"
          onClick={handleVerify}
          disabled={verifying}
        >
          {verifying ? "Verifying..." : "Verify & Continue"}
        </button>

        <button
          className="guard__btn guard__btn--ghost"
          onClick={handleSendOTP}
          disabled={sending}
        >
          {sending ? "Sending..." : "Resend OTP"}
        </button>

        <p className="guard__hint">
          Check your inbox — OTP expires in 10 minutes.
        </p>
      </div>
    </div>
  );
};

const Protectedroute = ({ children }) => {
  const { user } = useUserAuth();
  const [guardState, setGuardState] = useState("checking"); // checking | allowed | chrome_otp | mobile_blocked

  const logLoginEvent = useCallback(async (userObj) => {
    const { browser, os, device } = detectBrowserInfo();
    try {
      await fetch("http://localhost:5000/login-track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: userObj.email,
          browser,
          os,
          device,
        }),
      });
    } catch (e) {
      console.log("Login track error:", e);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const { isChrome, isEdge, isMobile } = detectBrowserInfo();

    if (isMobile) {
      if (!isMobileAccessAllowed()) {
        setGuardState("mobile_blocked");
        return;
      }
    }

    if (isChrome) {
      // Check if already verified this session
      const verified = sessionStorage.getItem(`chrome_verified_${user.email}`);
      if (!verified) {
        setGuardState("chrome_otp");
        return;
      }
    }

    setGuardState("allowed");
    logLoginEvent(user);
  }, [user, logLoginEvent]);

  if (!user) return <Navigate to="/login" />;

  if (guardState === "checking") return null;

  if (guardState === "mobile_blocked") return <MobileTimeBlock />;

  if (guardState === "chrome_otp") {
    return (
      <ChromeOTPModal
        user={user}
        onVerified={() => {
          sessionStorage.setItem(`chrome_verified_${user.email}`, "true");
          setGuardState("allowed");
          logLoginEvent(user);
        }}
  
        />
    );
  }

  return children;
};

export default Protectedroute;