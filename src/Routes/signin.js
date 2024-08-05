//IMPORTS
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { config as dotenvConfig } from "dotenv";
import executeQuery from "../Config/Database.js";

dotenvConfig();
const router = express.Router();
const secret_token = process.env.ACCESS_TOKEN_SECRET;
const secret_refresh_token = process.env.REFRESH_TOKEN_SECRET;


//CHECKING USER IN AND DECODING PASSWORD
router.post("/", async (req, res) => {
  try {
    let query = `SELECT password,user_id FROM Users WHERE email=@email`;
    const values = {
      email: req.body.email,
      password: req.body.password,
    };
    const result = await executeQuery(query, values);

    if (result.length === 0) {
      res.status(400).send("User not found");
      return;
    }

    const hashed_password = result[0].password;
    const userid = result[0].user_id;

    if (!(await bcrypt.compare(req.body.password, hashed_password))) {
      res.status(400).send("Wrong password");
      return;
    }

    let access_token = jwt.sign({ userid }, secret_token, { expiresIn: "10m" });
    let refresh_token = jwt.sign({ userid }, secret_refresh_token, {
      expiresIn: "7d",
    });
    let currentTimestamp = new Date();
    let expiryTimestamp = new Date(
      currentTimestamp.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    const tokenInfo = {
      user_id: userid,
      token: refresh_token,
      expiry_date: expiryTimestamp.toISOString(),
    };
    await executeQuery("DELETE FROM refresh_tokens WHERE user_id=@user_id");
    await executeQuery(
      "INSERT INTO refresh_tokens (user_id,token,expiry_date) VALUES (@user_id,@token,@expiry_date)",
      tokenInfo
    );

    res.cookie("authToken", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).send("Logged in successfully");
  } catch (err) {
    res.status(500).send("An error occured while checking user");
  }
});

export default router;
