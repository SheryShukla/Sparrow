const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = "mongodb+srv://sheryshukla777_db_user:l7TWswFBliJZbMBp@cluster0.yxqynpf.mongodb.net/Sparrow?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_gmail@gmail.com",
    pass: "your_app_password",
  },
});

const otpStore = {};
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

async function run() {
  try {
    await client.connect();

    const db = client.db("database");
    const postcollection     = db.collection("posts");
    const usercollection     = db.collection("users");
    const resetcollection    = db.collection("passwordResets");
    const loginLogCollection = db.collection("loginHistory");

    app.post("/register", async (req, res) => {
      try { const result = await usercollection.insertOne(req.body); res.send(result); }
      catch (err) { res.send({ success: false }); }
    });

    app.get("/loggedinuser", async (req, res) => {
      const user = await usercollection.find({ email: req.query.email }).toArray();
      res.send(user);
    });

    app.get("/userbyphone", async (req, res) => {
      const user = await usercollection.find({ phone: req.query.phone }).toArray();
      res.send(user);
    });

    app.get("/user", async (req, res) => {
      res.send(await usercollection.find().toArray());
    });

    app.patch("/userupdate/:email", async (req, res) => {
      const result = await usercollection.updateOne(
        { email: req.params.email }, { $set: req.body }, { upsert: true }
      );
      res.send(result);
    });

    app.post("/forgot-password", async (req, res) => {
      try {
        const { identifier, method } = req.body;
        if (!identifier) return res.status(400).send({ success: false });
        const today = new Date(); today.setHours(0,0,0,0);
        const existing = await resetcollection.findOne({ identifier, requestedAt: { $gte: today } });
        if (existing) return res.status(429).send({ success: false, message: "Already requested today." });
        await resetcollection.insertOne({ identifier, method, requestedAt: new Date() });
        res.send({ success: true });
      } catch { res.status(500).send({ success: false }); }
    });

    // LOGIN TRACK
    app.post("/login-track", async (req, res) => {
      try {
        const { email, browser, os, device } = req.body;
        const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim()
          || req.socket?.remoteAddress || req.ip || "Unknown";
        await loginLogCollection.insertOne({
          email,
          browser:  browser || "Unknown",
          os:       os      || "Unknown",
          device:   device  || "Unknown",
          ip:       ip === "::1" ? "127.0.0.1 (localhost)" : ip,
          loginAt:  new Date(),
        });
        res.send({ success: true });
      } catch (err) { res.status(500).send({ success: false }); }
    });

    // LOGIN HISTORY
    app.get("/login-history", async (req, res) => {
      try {
        const history = await loginLogCollection
          .find({ email: req.query.email })
          .sort({ loginAt: -1 })
          .limit(50)
          .toArray();
        res.send(history);
      } catch { res.status(500).send([]); }
    });

    // SEND CHROME OTP
    app.post("/send-login-otp", async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) return res.status(400).send({ success: false });
        const otp = generateOTP();
        otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
        await transporter.sendMail({
          from: '"Sparrow" <your_gmail@gmail.com>',
          to: email,
          subject: "Sparrow Login OTP",
          html: `<div style="font-family:Arial;max-width:480px;margin:0 auto">
            <h2 style="color:#0f1419">Sparrow Login Verification</h2>
            <p>You are signing in from <strong>Google Chrome</strong>. Your OTP:</p>
            <div style="background:#f7f9fa;border:2px solid #1d9bf0;border-radius:12px;
                        padding:20px;text-align:center;margin:20px 0">
              <span style="font-size:36px;font-weight:800;letter-spacing:8px;
                           color:#0f1419;font-family:monospace">${otp}</span>
            </div>
            <p style="color:#536471;font-size:13px">Expires in <strong>10 minutes</strong>.</p>
          </div>`,
        });
        console.log(`[OTP for ${email}]: ${otp}`);
        res.send({ success: true, message: "OTP sent to your email." });
      } catch (err) {
        console.log("Mail error:", err.message);
        res.send({ success: true, message: "OTP sent (check server console if email fails)." });
      }
    });

    // VERIFY CHROME OTP
    app.post("/verify-login-otp", async (req, res) => {
      try {
        const { email, otp } = req.body;
        const record = otpStore[email];
        if (!record) return res.send({ success: false, message: "No OTP found. Request a new one." });
        if (Date.now() > record.expiresAt) { delete otpStore[email]; return res.send({ success: false, message: "OTP expired." }); }
        if (record.otp !== otp.trim()) return res.send({ success: false, message: "Invalid OTP." });
        delete otpStore[email];
        res.send({ success: true });
      } catch { res.status(500).send({ success: false }); }
    });

    // POSTS
    app.post("/post", async (req, res) => {
      try {
        const data = req.body;
        const result = await postcollection.insertOne({
          profilephoto: data.profilephoto || "", post: data.post || "",
          photo: data.photo || "", audio: data.audio || null,
          username: data.username || "", name: data.name || "",
          email: data.email || "", createdAt: new Date(),
        });
        res.send({ success: true, insertedId: result.insertedId });
      } catch { res.send({ success: false }); }
    });

    app.get("/post", async (req, res) => {
      res.send(await postcollection.find().sort({ createdAt: -1 }).toArray());
    });

    app.get("/userpost", async (req, res) => {
      res.send(await postcollection.find({ email: req.query.email }).sort({ createdAt: -1 }).toArray());
    });

    console.log("Connected to MongoDB");
  } catch (error) { console.log(error); }
}

run().catch(console.dir);
app.get("/", (req, res) => res.send("Sparrow backend running"));
app.listen(port, () => console.log(`Server running on port ${port}`));