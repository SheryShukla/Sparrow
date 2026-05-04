import React, { useEffect, useState, useRef } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";
import useNotifications, { getTriggerKeyword } from "../../hooks/useNotifications";

const Feed = () => {
  const [post, setpost] = useState([]);

  // ── Notification hook ──
  const { notifEnabled, sendTweetNotification } = useNotifications();

  // ── Track which post IDs we've already notified about (avoids repeat alerts on re-render) ──
  const notifiedIds = useRef(new Set());

  const fetchPosts = () => {
    fetch("http://localhost:5000/post")
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ── When posts load, check for keyword tweets and fire notifications ──
  useEffect(() => {
    if (!notifEnabled) return;
    if (!post || post.length === 0) return;

    post.forEach((tweet) => {
      // Skip if we already notified for this tweet
      if (notifiedIds.current.has(tweet._id)) return;

      const keyword = getTriggerKeyword(tweet.post);
      if (keyword) {
        notifiedIds.current.add(tweet._id);
        sendTweetNotification(tweet, keyword);
      }
    });
  }, [post, notifEnabled, sendTweetNotification]);

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <Tweetbox refreshPosts={fetchPosts} />
      {post.map((p) => (
        <Posts key={p._id} p={p} />
      ))}
    </div>
  );
};

export default Feed;