import React, { useState, useRef } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";

const Tweetbox = ({ refreshPosts }) => {
  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const { user } = useUserAuth();
  const [loggedinsuer] = useLoggedinuser();
  const email = user?.email;

  // 🎤 AUDIO STATES
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const userprofilepic = loggedinsuer[0]?.profileImage
    ? loggedinsuer[0].profileImage
    : user && user.photoURL;

  // 📸 IMAGE UPLOAD
  const handleuploadimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        setimageurl(res.data.data.display_url);
        setisloading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 🎤 RECORD AUDIO
  const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const recorder = new MediaRecorder(stream);
  mediaRecorderRef.current = recorder;

  audioChunksRef.current = [];

  recorder.ondataavailable = (event) => {
    audioChunksRef.current.push(event.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });

    if (blob.size > 100 * 1024 * 1024) {
      alert("Audio exceeds 100MB");
      return;
    }

    setAudioBlob(blob);
    setAudioURL(URL.createObjectURL(blob));
  };

  recorder.start();
  setIsRecording(true);

  setTimeout(() => {
    if (recorder.state === "recording") {
      recorder.stop();
      setIsRecording(false);
      alert("Max 5 minutes reached");
    }
  }, 5 * 60 * 1000);
};

  const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }
};

  

  // ☁️ UPLOAD AUDIO
  const uploadAudio = async () => {
    if (!audioBlob) return null;

    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("upload_preset", "your_preset");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/video/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  // 🚀 SEND POST
  const sendPost = async (userpost) => {
  let audioUrl = null;

  // ✅ upload audio first
  if (audioBlob) {
    audioUrl = await uploadAudio();
  }

  userpost.audio = audioUrl;

  console.log("Final post:", userpost); // 🔥 debug

  const res = await fetch("http://localhost:5000/post", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userpost),
  });

  const data = await res.json();
  console.log("Response:", data);

  // ✅ reset fields
  setpost("");
  setimageurl("");
  setAudioBlob(null);
  setAudioURL("");

  // 🔥 TEMP (you can keep for now)
  window.location.reload();
};

  // 📝 HANDLE TWEET
  const handletweet = (e) => {
  e.preventDefault();

  const userpost = {
    profilephoto: user?.photoURL || "",  // ✅ fallback
    post: post,
    photo: imageurl,
    username: email?.split("@")[0],
    name: user?.displayName || "Anonymous", // ✅ FIX
    email: email,
  };

  console.log("Sending post:", userpost);

  sendPost(userpost);
};

  return (
    <div className="tweetBox">
      <form onSubmit={handletweet}>
        <div className="tweetBox__input">
          <Avatar src={userprofilepic} />
          <input
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
          />
        </div>

        <div className="imageIcon_tweetButton">

        {/* 📸 IMAGE ICON */}
        <label htmlFor="image" className="imageIcon">
          {isloading ? (
            <p>Uploading Image</p>
          ) : (
            <p>
              {imageurl ? "Image Uploaded" : <AddPhotoAlternateOutlinedIcon />}
            </p>
          )}
        </label>
        
        <input
          type="file"
          id="image"
          className="imageInput"
          onChange={handleuploadimage}
        />

        {/* 🎤 AUDIO ICON (RIGHT SIDE) */}
        <div 
          className="audioIcon" 
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "⏹" : "🎤"}
        </div>
        
        <Button className="tweetBox__tweetButton" type="submit">
          Post
        </Button>
      </div>
        

        {audioURL && (
          <div style={{ marginTop: "10px" }}>
            <audio controls>
              <source src={audioURL} type="audio/mp3" />
            </audio>
          </div>
        )}
      </form>
      <hr />
    </div>
  );
};

export default Tweetbox;
