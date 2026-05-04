import React, { useEffect, useState } from "react";
import "./Bookmark.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useUserAuth } from "../../context/UserAuthContext";

const Bookmark = () => {
  const { user } = useUserAuth();
  const [allPosts, setAllPosts] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load saved bookmark IDs from localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem(`bookmarks_${user?.email}`);
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
  }, [user]);

  // ── Fetch all posts from server ──
  useEffect(() => {
    fetch("http://localhost:5000/post")
      .then((res) => res.json())
      .then((data) => {
        setAllPosts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // ── Save bookmark IDs to localStorage ──
  const saveBookmarks = (ids) => {
    localStorage.setItem(`bookmarks_${user?.email}`, JSON.stringify(ids));
    setBookmarkedIds(ids);
  };

  // ── Remove a single bookmark ──
  const removeBookmark = (postId) => {
    const updated = bookmarkedIds.filter((id) => id !== postId);
    saveBookmarks(updated);
  };

  // ── Clear all bookmarks ──
  const clearAll = () => {
    if (window.confirm("Clear all bookmarks?")) {
      saveBookmarks([]);
    }
  };

  // ── Filter only bookmarked posts ──
  const bookmarkedPosts = allPosts.filter((p) =>
    bookmarkedIds.includes(p._id)
  );

  return (
    <div className="bookmarks">

      {/* ── HEADER ── */}
      <div className="bookmarks__header" style={{ position: "relative" }}>
        <h2>Bookmarks</h2>
        <p>@{user?.email?.split("@")[0]}</p>
        {bookmarkedPosts.length > 0 && (
          <button className="bookmarks__clearBtn" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>

      {/* ── LOADING ── */}
      {isLoading && (
        <div className="bookmarks__loading">Loading bookmarks...</div>
      )}

      {/* ── EMPTY STATE ── */}
      {!isLoading && bookmarkedPosts.length === 0 && (
        <div className="bookmarks__empty">
          <div className="bookmarks__empty__icon">🔖</div>
          <h3>Save posts for later</h3>
          <p>
            Bookmark posts to easily find them again in the future. Your
            bookmarks are only visible to you.
          </p>
        </div>
      )}

      {/* ── BOOKMARKED POSTS ── */}
      {bookmarkedPosts.map((p) => (
        <BookmarkedPost
          key={p._id}
          p={p}
          onRemove={() => removeBookmark(p._id)}
        />
      ))}
    </div>
  );
};

// ── Individual bookmarked post card ──
const BookmarkedPost = ({ p, onRemove }) => {
  const { name, username, photo, post, profilephoto, audio } = p;

  return (
    <div className="post">
      {/* Avatar */}
      <div className="post__avatar">
        <Avatar src={profilephoto} />
      </div>

      {/* Body */}
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
        {photo && (
          <img
            src={photo}
            alt=""
            style={{ width: "100%", borderRadius: "16px", marginTop: "10px" }}
          />
        )}

        {/* Footer icons */}
        <div className="post__footer">
          <ChatBubbleOutlineIcon
            className="post__fotter__icon"
            fontSize="small"
          />
          <RepeatIcon className="post__fotter__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__fotter__icon" fontSize="small" />
          <PublishIcon className="post__fotter__icon" fontSize="small" />

          {/* Bookmark (filled = bookmarked, click to remove) */}
          <button
            className="post__bookmarkBtn bookmarked"
            title="Remove bookmark"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <BookmarkIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bookmark;