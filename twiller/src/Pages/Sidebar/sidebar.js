import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreIcon from "@mui/icons-material/More";
import DoneIcon from "@mui/icons-material/Done";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import Customlink from "./Customlink";
import Sidebaroption from "./Sidebaroption";
import useLoggedinuser from "../../hooks/useLoggedinuser";

/* ── Sparrow bird SVG icon ── */
const SparrowBird = () => (
  <svg className="sidebar__birdSvg" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 8c-1.5 1-3 1.5-4.5 1.5C22 7.5 20 6 17.5 6c-3.3 0-6 2.7-6 6 0 .5 0 .9.1 1.4C7.7 13.1 4.1 11 2 8c-.5.8-.7 1.8-.7 2.8 0 2 1 3.7 2.5 4.7-.9 0-1.8-.3-2.5-.7v.1c0 2.8 2 5.1 4.6 5.6-.5.1-1 .2-1.5.2-.4 0-.7 0-1.1-.1.7 2.3 2.8 3.9 5.3 4C6.8 25.8 4.5 26.5 2 26.5c-.4 0-.7 0-1-.1C3.6 27.9 6.5 29 9.7 29c11.6 0 18-9.6 18-18v-.8C29 9.5 28.6 8.8 28 8z" />
  </svg>
);

const Sidebar = ({ handlelogout, user }) => {
  const [anchorE1, setAnchorE1] = useState(null);
  const openmenu = Boolean(anchorE1);
  const [loggedinuser] = useLoggedinuser();
  const navigate = useNavigate();

  const handleclick = (e) => setAnchorE1(e.currentTarget);
  const handleclose = () => setAnchorE1(null);

  const result = user?.email?.split("@")[0];
  const profileImage = loggedinuser[0]?.profileImage || (user && user.photoURL);
  const displayName = loggedinuser[0]?.name || (user && user.displayName);

  return (
    <div className="sidebar">

      {/* ── Brand ── */}
      <div className="sidebar__twitterIcon" onClick={() => navigate("/home/feed")}>
        <SparrowBird />
        <span className="sidebar__brandName">Sparrow</span>
      </div>

      {/* ── Nav links ── */}
      <nav className="sidebar__nav">
        <Customlink to="/home/feed">
          <Sidebaroption Icon={HomeIcon} text="Home" />
        </Customlink>
        <Customlink to="/home/explore">
          <Sidebaroption Icon={SearchIcon} text="Explore" />
        </Customlink>
        <Customlink to="/home/notification">
          <Sidebaroption Icon={NotificationsNoneIcon} text="Notifications" />
        </Customlink>
        <Customlink to="/home/messages">
          <Sidebaroption Icon={MailOutlineIcon} text="Messages" />
        </Customlink>
        <Customlink to="/home/bookmarks">
          <Sidebaroption Icon={BookmarkBorderIcon} text="Bookmarks" />
        </Customlink>
        <Customlink to="/home/lists">
          <Sidebaroption Icon={ListAltIcon} text="Lists" />
        </Customlink>
        <Customlink to="/home/profile">
          <Sidebaroption Icon={PermIdentityIcon} text="Profile" />
        </Customlink>
        <Customlink to="/home/more">
          <Sidebaroption Icon={MoreIcon} text="More" />
        </Customlink>
      </nav>

      {/* ── Post button ── */}
      <Button variant="contained" className="sidebar__tweet" fullWidth>
        Post
      </Button>

      {/* ── User profile row ── */}
      <div className="Profile__info">
        <Avatar src={profileImage} />
        <div className="user__info">
          <h4>{displayName}</h4>
          <h5>@{result}</h5>
        </div>
        <IconButton
          size="small"
          aria-controls={openmenu ? "account-menu" : undefined}
          aria-haspopup="true"
          onClick={handleclick}
        >
          <MoreHorizIcon />
        </IconButton>

        <Menu
          id="account-menu"
          anchorEl={anchorE1}
          open={openmenu}
          onClick={handleclose}
          onClose={handleclose}
        >
          <MenuItem onClick={() => navigate("/home/profile")}>
            <Avatar src={profileImage} sx={{ mr: 1.5, width: 32, height: 32 }} />
            <div className="user__info subUser__info">
              <div>
                <h4>{displayName}</h4>
                <h5>@{result}</h5>
              </div>
              <ListItemIcon className="done__icon">
                <DoneIcon fontSize="small" />
              </ListItemIcon>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleclose}>Add an existing account</MenuItem>
          <MenuItem onClick={handlelogout}>Log out @{result}</MenuItem>
        </Menu>
      </div>

    </div>
  );
};

export default Sidebar;