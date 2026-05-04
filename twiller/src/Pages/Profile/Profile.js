import "./Profile.css";
import { useState } from "react";
import Editprofile from "./Editprofile/Editprofile";

const posts = [
  { text: "Hello Twitter 👋", time: "2h" },
  { text: "Working on my project 💻", time: "5h" },
  { text: "Nice weather today 🌤️", time: "1d" },
];

const user = {
  name: "Shery",
  email: "shery@gmail.com",
  bio: "Developer",
};

export default function Profile() {

  const [open, setOpen] = useState(false); // ✅ inside component

  return (
    <div className="profile">

      <div className="profile__cover" />

      <div className="profile__info">
        <div className="profile__avatar">👤</div>

        {/* ✅ Controlled modal */}
        <Editprofile open={open} setOpen={setOpen} user={user} />

        <button onClick={() => setOpen(true)}>
          Edit Profile
        </button>

        <h2>{user.name}</h2>
        <p className="profile__username">@sheryshukla058</p>

        <p className="profile__bio">
          {user.bio}
        </p>

        <div className="profile__stats">
          <span><strong>120</strong> Following</span>
          <span><strong>80</strong> Followers</span>
        </div>
      </div>

    </div>
  );
}