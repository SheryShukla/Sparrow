import React, { useState, useEffect } from "react";
import Post from "../Posts/posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import useNotifications, { TRIGGER_KEYWORDS } from "../../../hooks/useNotifications";

const Mainprofile = ({ user }) => {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post, setpost] = useState([]);

  // 🔔 Notification hook
  const {
    notifEnabled,
    permissionStatus,
    enableNotifications,
    disableNotifications,
  } = useNotifications();

  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    fetch(`http://localhost:5000/userpost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setpost(data));
  }, [user.email]);

  const handleuploadcoverimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post("https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335", formData)
      .then((res) => {
        const url = res.data.data.display_url;
        const usercoverimage = { email: user?.email, coverimage: url };
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(usercoverimage),
          }).then((res) => res.json());
        }
      })
      .catch((e) => { console.log(e); setisloading(false); });
  };

  const handleuploadprofileimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post("https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335", formData)
      .then((res) => {
        const url = res.data.data.display_url;
        const userprofileimage = { email: user?.email, profileImage: url };
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userprofileimage),
          }).then((res) => res.json());
        }
      })
      .catch((e) => { console.log(e); setisloading(false); });
  };

  // ── Handle toggle ──
  const handleNotifToggle = async () => {
    if (notifEnabled) {
      disableNotifications();
      showToast("Notifications disabled.");
    } else {
      const success = await enableNotifications();
      if (success) {
        showToast("Notifications enabled! You'll be alerted for cricket & science tweets.");
      } else if (permissionStatus === "denied") {
        showToast("Blocked by browser. Please allow notifications in site settings.");
      }
    }
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>

      <div className="mainprofile">
        <div className="profile-bio">
          <div>
            {/* Cover image */}
            <div className="coverImageContainer">
              <img
                src={loggedinuser[0]?.coverimage ? loggedinuser[0].coverimage : user && user.photoURL}
                alt=""
                className="coverImage"
              />
              <div className="hoverCoverImage">
                <div className="imageIcon_tweetButton">
                  <label htmlFor="image" className="imageIcon">
                    {isloading ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>
                  <input type="file" id="image" className="imageInput" onChange={handleuploadcoverimage} />
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="avatar-img">
              <div className="avatarContainer">
                <img
                  src={loggedinuser[0]?.profileImage ? loggedinuser[0].profileImage : user && user.photoURL}
                  alt=""
                  className="avatar"
                />
                <div className="hoverAvatarImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="profileImage" className="imageIcon">
                      {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input type="file" id="profileImage" className="imageInput" onChange={handleuploadprofileimage} />
                  </div>
                </div>
              </div>

              <div className="userInfo">
                <div>
                  <h3 className="heading-3">
                    {loggedinuser[0]?.name ? loggedinuser[0].name : user && user.displayname}
                  </h3>
                  <p className="usernameSection">@{username}</p>
                </div>
                <Editprofile user={user} loggedinuser={loggedinuser} />
              </div>

              <div className="infoContainer">
                {loggedinuser[0]?.bio ? <p>{loggedinuser[0].bio}</p> : ""}
                <div className="locationAndLink">
                  {loggedinuser[0]?.location && (
                    <p className="suvInfo">
                      <MyLocationIcon /> {loggedinuser[0].location}
                    </p>
                  )}
                  {loggedinuser[0]?.website && (
                    <p className="subInfo link">
                      <AddLinkIcon /> {loggedinuser[0].website}
                    </p>
                  )}
                </div>
              </div>

              {/* ════════════════════════════════════
                  🔔 NOTIFICATION SETTINGS SECTION
              ════════════════════════════════════ */}
              <div className="notif-settings">
                <div className="notif-settings__header">
                  <span className="notif-settings__title">
                    {notifEnabled
                      ? <NotificationsIcon style={{ color: "#1d9bf0", fontSize: 20, verticalAlign: "middle", marginRight: 6 }} />
                      : <NotificationsOffIcon style={{ color: "#536471", fontSize: 20, verticalAlign: "middle", marginRight: 6 }} />
                    }
                    Tweet Notifications
                  </span>

                  {/* Toggle Switch */}
                  <div
                    className={`notif-toggle ${notifEnabled ? "on" : "off"}`}
                    onClick={handleNotifToggle}
                    title={notifEnabled ? "Disable notifications" : "Enable notifications"}
                  >
                    <div className="notif-toggle__knob" />
                  </div>
                </div>

                <p className="notif-settings__desc">
                  {notifEnabled
                    ? `Notifications are ON. You'll get browser alerts for tweets containing:`
                    : `Enable to get browser alerts for tweets containing:`}
                </p>

                <div className="notif-settings__keywords">
                  {TRIGGER_KEYWORDS.map((kw) => (
                    <span key={kw} className={`notif-kw-badge ${notifEnabled ? "active" : ""}`}>
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Browser permission warning */}
                {permissionStatus === "denied" && (
                  <div className="notif-settings__blocked">
                    ⚠️ Notifications are blocked in your browser. Go to{" "}
                    <strong>Site Settings → Notifications</strong> and allow them, then try again.
                  </div>
                )}
              </div>

              {/* Toast message */}
              {toastMsg && (
                <div className="notif-toast">{toastMsg}</div>
              )}

              <h4 className="tweetsText">Tweets</h4>
              <hr />
            </div>

            {post.map((p) => (
              <Post key={p._id} p={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;