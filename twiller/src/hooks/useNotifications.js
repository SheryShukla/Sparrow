import { useState, useCallback } from "react";

// ── Keywords that trigger notifications ──
export const TRIGGER_KEYWORDS = ["cricket", "science"];

// ── localStorage key for saving user preference ──
const PREF_KEY = "sparrow_notifications_enabled";

// ── Check if a tweet contains any trigger keyword ──
export const getTriggerKeyword = (tweetText) => {
  if (!tweetText) return null;
  const lower = tweetText.toLowerCase();
  return TRIGGER_KEYWORDS.find((kw) => lower.includes(kw)) || null;
};

const useNotifications = () => {
  // Read saved preference from localStorage (default: false)
  const [notifEnabled, setNotifEnabled] = useState(() => {
    return localStorage.getItem(PREF_KEY) === "true";
  });

  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );

  // ── Enable notifications: request permission then save pref ──
  const enableNotifications = useCallback(async () => {
    if (typeof Notification === "undefined") {
      alert("Your browser does not support notifications.");
      return false;
    }

    if (Notification.permission === "denied") {
      alert(
        "Notifications are blocked for this site. Please enable them in your browser settings and try again."
      );
      return false;
    }

    let permission = Notification.permission;

    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    setPermissionStatus(permission);

    if (permission === "granted") {
      localStorage.setItem(PREF_KEY, "true");
      setNotifEnabled(true);

      // Welcome notification
      new Notification("Sparrow Notifications Enabled 🐦", {
        body: 'You\'ll now get alerts for tweets about "cricket" and "science".',
        icon: "/favicon.ico",
      });
      return true;
    } else {
      localStorage.setItem(PREF_KEY, "false");
      setNotifEnabled(false);
      return false;
    }
  }, []);

  // ── Disable notifications: just save pref, no browser API needed ──
  const disableNotifications = useCallback(() => {
    localStorage.setItem(PREF_KEY, "false");
    setNotifEnabled(false);
  }, []);

  // ── Fire a browser notification for a tweet ──
  const sendTweetNotification = useCallback((tweet, keyword) => {
    if (!notifEnabled) return;
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    const author = tweet.name || tweet.username || "Someone";
    const tweetText = tweet.post || "";

    // Highlight the keyword in the body
    const body = tweetText.length > 120
      ? tweetText.substring(0, 120) + "..."
      : tweetText;

    new Notification(`🐦 New tweet about "${keyword}"`, {
      body: `${author}: ${body}`,
      icon: tweet.profilephoto || "/favicon.ico",
      badge: "/favicon.ico",
      tag: `tweet-${tweet._id}`,       // prevents duplicate popups for same tweet
      requireInteraction: false,        // auto-dismiss
    });
  }, [notifEnabled]);

  return {
    notifEnabled,
    permissionStatus,
    enableNotifications,
    disableNotifications,
    sendTweetNotification,
  };
};

export default useNotifications;