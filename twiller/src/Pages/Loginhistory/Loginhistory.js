import React, { useEffect, useState } from "react";
import "./Loginhistory.css";
import { useUserAuth } from "../../context/UserAuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import ComputerIcon from "@mui/icons-material/Computer";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import TabletIcon from "@mui/icons-material/Tablet";

const DeviceIcon = ({ device }) => {
  const style = { fontSize: 18, verticalAlign: "middle", marginRight: 6 };
  if (device === "Mobile")  return <PhoneAndroidIcon style={style} />;
  if (device === "Tablet")  return <TabletIcon style={style} />;
  return <ComputerIcon style={style} />;
};

const browserEmoji = (browser) => {
  if (!browser) return "🌐";
  const b = browser.toLowerCase();
  if (b.includes("chrome"))  return "🟡";
  if (b.includes("edge"))    return "🔵";
  if (b.includes("firefox")) return "🦊";
  if (b.includes("safari"))  return "🧭";
  return "🌐";
};

const Loginhistory = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:5000/login-history?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="login-history">

      <div className="login-history__header">
        <button className="login-history__back" onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize="small" />
        </button>
        <div>
          <h2>Login History</h2>
          <p>All sessions for @{user?.email?.split("@")[0]}</p>
        </div>
      </div>

      {isLoading && (
        <div className="login-history__loading">Loading history...</div>
      )}

      {!isLoading && history.length === 0 && (
        <div className="login-history__empty">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h3>No login history yet</h3>
          <p>Your login sessions will appear here.</p>
        </div>
      )}

      {!isLoading && history.length > 0 && (
        <div className="login-history__table-wrap">
          <table className="login-history__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Date & Time</th>
                <th>Browser</th>
                <th>Operating System</th>
                <th>Device</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => (
                <tr key={entry._id || i} className={i === 0 ? "lh-row--latest" : ""}>
                  <td className="lh-num">{i + 1}</td>
                  <td className="lh-date">{formatDate(entry.loginAt)}</td>
                  <td className="lh-browser">
                    <span className="lh-emoji">{browserEmoji(entry.browser)}</span>
                    {entry.browser || "Unknown"}
                    {i === 0 && <span className="lh-badge">Current</span>}
                  </td>
                  <td>{entry.os || "Unknown"}</td>
                  <td className="lh-device">
                    <DeviceIcon device={entry.device} />
                    {entry.device || "Unknown"}
                  </td>
                  <td className="lh-ip">
                    <code>{entry.ip || "—"}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default Loginhistory;