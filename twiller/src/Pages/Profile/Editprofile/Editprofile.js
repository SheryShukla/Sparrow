import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./Editprofile.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
};

function Editchild({ dob, setdob }) {
  const [open, setopen] = useState(false);
  const handleopen = () => {
    setopen(true);
  };
  const handleclose = () => {
    setopen(false);
  };
  return (
    <React.Fragment>
      <div className="birthdate-section" onClick={handleopen}>
        <span>Edit</span>
      </div>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleclose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-descriptiom"
      >
        <Box sx={{ ...style, width: 300, height: 300 }}>
          <div className="text">
            <h2>Edit date of birth</h2>
            <p>
              This can only be changed a few times
              <br />
              Make sure you enter the age of the <br />
              person using the account.{" "}
            </p>
            <input type="date" onChange={(e) => setdob(e.target.value)} />
            <button
              className="e-button"
              onClick={() => {
                setopen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

const Editprofile = ({ open, setOpen, user }) => {

  const [dob, setdob] = useState("");

  const [name, setname] = useState(user?.name || "");
  const [bio, setbio] = useState(user?.bio || "");
  const [location, setlocation] = useState(user?.location || "");
  const [website, setwebsite] = useState(user?.website || "");

  const handlesave = () => {
    const editinfo = { name, bio, location, website, dob };

    fetch(`http://localhost:5000/userupdate/${user?.email}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(editinfo),
    })
      .then((res) => res.json())
      .then(() => {
        setOpen(false); // ✅ close modal
      });
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <Box style={style} className="modal">

        <div className="header">
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>

          <h2>Edit Profile</h2>

          <button onClick={handlesave}>Save</button>
        </div>

        <TextField
          fullWidth
          label="Name"
          variant="filled"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />

        <TextField
          fullWidth
          label="Bio"
          variant="filled"
          value={bio}
          onChange={(e) => setbio(e.target.value)}
        />

      </Box>
    </Modal>
  );
};

export default Editprofile;
