//IMPORTS
import express from "express";
import nodemailer from "nodemailer";
import { config as dotenvConfig } from "dotenv";
import executeQuery from "../Config/Database.js";

dotenvConfig();
const router = express.Router();

//SEND EMAIL WITH VERIFICATION CODE  TO USERS
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
async function sendEmail(email, code) {
  let mailOptions = {
    from: '"Spotify" <noreply@spotify.com>',
    to: email,
    subject: "Account Verification Code",
    text: `Your verification code is: ${code}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("an error occured while sending email", error);
    }
  });
}

router.post("/", async (req, res) => {
  try {
    let query = "SELECT * FROM Users WHERE email=@email";
    let values = {
      email: req.body.email,
    };
    let result = await executeQuery(query, values);

    if (result.length > 0) {
      res.status(400).send("Email already in use");
      return;
    }
    let code = Math.floor(100000 + Math.random() * 900000);
    await sendEmail(req.body.email, code);
    let expiryTimestamp = new Date();
    expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + 5);
    await executeQuery("DELETE FROM verify_email WHERE email=@email", values);

    let query2 =
      "INSERT INTO verify_email (email,code,expiry_date) VALUES (@email,@code,@expiry_date)";
    let values2 = {
      email: req.body.email,
      code: code,
      expiry_date: expiryTimestamp,
    };
    await executeQuery(query2, values2);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error Sending Email", error: error.message });
  }
});

export default router;
