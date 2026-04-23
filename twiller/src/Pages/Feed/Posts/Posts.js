import React from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";

const Posts = ({ p }) => {
  const { name, username, photo, post, profilephoto, audio } = p; // ✅ added audio

  return (
    <div className="post">
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

        {/* ✅ SHOW AUDIO IF EXISTS */}
        {audio && (
          <div>
            <audio controls style={{ width: "100%", marginTop: "10px" }}>
              <source src={audio} type="audio/mp3" />
            </audio>
          </div>
        )}

        {/* ✅ IMAGE */}
        {photo && <img src={photo} alt="" width="500" />}

        <div className="post__footer">
          <ChatBubbleOutlineIcon className="post__fotter__icon" fontSize="small" />
          <RepeatIcon className="post__fotter__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__fotter__icon" fontSize="small" />
          <PublishIcon className="post__fotter__icon" fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Posts;