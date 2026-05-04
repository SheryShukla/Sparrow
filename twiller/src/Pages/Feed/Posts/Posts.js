import React, { useState, useEffect } from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useUserAuth } from "../../../context/UserAuthContext";

const Posts = ({ p }) => {
  const { name, username, photo, post, profilephoto, audio, _id } = p;
  const { user } = useUserAuth();
  const storageKey = `bookmarks_${user?.email}`;

  // ── Check if this post is already bookmarked ──
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved).includes(_id) : false;
    } catch {
      return false;
    }
  });

  // ── Toggle bookmark ──
  const handleBookmark = (e) => {
    e.stopPropagation();

    const saved = localStorage.getItem(storageKey);
    const ids = saved ? JSON.parse(saved) : [];

    let updated;
    if (ids.includes(_id)) {
      updated = ids.filter((id) => id !== _id); // remove
    } else {
      updated = [...ids, _id]; // add
    }

    localStorage.setItem(storageKey, JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="post">
      {/* Avatar */}
      <div className="post__avatar">
        <Avatar src={profilephoto} />
      </div>

      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {name || "Anonymous"}{" "}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" /> @{username}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{post}</p>
          </div>
        </div>

        {/* Audio */}
        {audio && (
          <div>
            <audio controls style={{ width: "100%", marginTop: "10px" }}>
              <source src={audio} type="audio/mp3" />
            </audio>
          </div>
        )}

        {/* Image */}
        {photo && <img src={photo} alt="" width="500" />}

        {/* Footer */}
        <div className="post__footer">
          <ChatBubbleOutlineIcon
            className="post__fotter__icon"
            fontSize="small"
          />
          <RepeatIcon className="post__fotter__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__fotter__icon" fontSize="small" />
          <PublishIcon className="post__fotter__icon" fontSize="small" />

          {/* Bookmark toggle */}
          <button
            className={`post__bookmarkBtn ${isBookmarked ? "bookmarked" : ""}`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
            onClick={handleBookmark}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              color: isBookmarked ? "#1d9bf0" : "#536471",
              transition: "all 0.2s ease",
            }}
          >
            {isBookmarked ? (
              <BookmarkIcon fontSize="small" />
            ) : (
              <BookmarkBorderIcon fontSize="small" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;