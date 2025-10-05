import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";

const app = express();
app.use(express.json());

const codes = {}; // { email: { code, expires } }

app.post("/send-code", async (req, res) => {
  const { email } = req.body;
  const code = crypto.randomInt(100000, 999999).toString();
  codes[email] = { code, expires: Date.now() + 5 * 60 * 1000 };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com",
      pass: "your-app-password",
    },
  });

  await transporter.sendMail({
    from: "VehicleTracker <yourgmail@gmail.com>",
    to: email,
    subject: "Your VehicleTracker Verification Code",
    text: `Your verification code is ${code}. It expires in 5 minutes.`,
  });

  res.json({ message: "Code sent" });
});

app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  const record = codes[email];
  if (!record) return res.status(400).json({ error: "No code sent" });
  if (record.expires < Date.now())
    return res.status(400).json({ error: "Code expired" });
  if (record.code !== code)
    return res.status(400).json({ error: "Invalid code" });

  delete codes[email];
  res.json({ success: true, token: "driver-token-here" });
});

app.listen(5000, () => console.log("Server running on port 5000"));