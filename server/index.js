const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

// 🔥 Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
// 🔥 MongoDB URI (keep yours)
const uri = "mongodb+srv://sheryshukla777_db_user:l7TWswFBliJZbMBp@cluster0.yxqynpf.mongodb.net/Sparrow?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const db = client.db("database");
    const postcollection = db.collection("posts");
    const usercollection = db.collection("users");

    // =========================
    // ✅ USER APIs
    // =========================

    // Register user
    app.post("/register", async (req, res) => {
      try {
        const user = req.body;
        const result = await usercollection.insertOne(user);
        res.send(result);
      } catch (err) {
        console.log(err);
        res.send({ success: false });
      }
    });

    // Get logged-in user
    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.find({ email }).toArray();
      res.send(user);
    });

    // Get all users
    app.get("/user", async (req, res) => {
      const users = await usercollection.find().toArray();
      res.send(users);
    });

    // Update user
    app.patch("/userupdate/:email", async (req, res) => {
      const email = req.params.email;
      const profile = req.body;

      const result = await usercollection.updateOne(
        { email: email },
        { $set: profile },
        { upsert: true }
      );

      res.send(result);
    });

    // =========================
    // ✅ POST APIs (MAIN FEATURE)
    // =========================

    // 🚀 CREATE POST (text + image + audio)
    app.post("/post", async (req, res) => {
      try {
        const data = req.body;

        const post = {
          profilephoto: data.profilephoto || "",
          post: data.post || "",
          photo: data.photo || "",
          audio: data.audio || null, // ✅ IMPORTANT
          username: data.username || "",
          name: data.name || "",
          email: data.email || "",
          createdAt: new Date(), // ✅ for sorting
        };

        console.log("New Post:", post); // 🔥 debug

        const result = await postcollection.insertOne(post);

        res.send({
          success: true,
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.log(error);
        res.send({ success: false });
      }
    });

    // 📡 GET ALL POSTS
    app.get("/post", async (req, res) => {
      const posts = await postcollection
        .find()
        .sort({ createdAt: -1 }) // ✅ latest first
        .toArray();

      res.send(posts);
    });

    // 📡 GET USER POSTS
    app.get("/userpost", async (req, res) => {
      const email = req.query.email;

      const posts = await postcollection
        .find({ email })
        .sort({ createdAt: -1 })
        .toArray();

      res.send(posts);
    });

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);  // ✅ MUST BE HERE

app.get("/", (req, res) => {
  res.send("Twiller backend is running 🚀");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});