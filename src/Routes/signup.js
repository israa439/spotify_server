//IMPORTS
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { config as dotenvConfig } from "dotenv";
import executeQuery from "../Config/Database.js";

dotenvConfig();
const router = express.Router();
const secret_token = process.env.ACCESS_TOKEN_SECRET;
const secret_refresh_token = process.env.REFRESH_TOKEN_SECRET;

//CREATING A NEW USER AND HASHING PASSWORD
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let userid = uuidv4();
    let query = `INSERT INTO Users (user_name, password,email,user_id,fullname) VALUES (@username, @hashedPassword, @email, @userid,@fullname)`;
    const values = {
      username: req.body.username,
      hashedPassword: hashedPassword,
      email: req.body.email,
      userid: userid,
      fullname: req.body.fullname,
    };

    await executeQuery(query, values);
    let access_token = jwt.sign({ userid }, secret_token, {
      expiresIn: "10m",
    });
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
    await executeQuery(
      "INSERT INTO refresh_tokens (user_id,token,expiry_date) VALUES (@user_id,@token,@expiry_date)",
      tokenInfo
    );

    res.cookie("authToken", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).send("The account was created successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
