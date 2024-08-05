// IMPORTS
import express from "express";
import executeQuery from "../Config/Database.js";
import authenticateToken from "../Utils/tokenAuth.js";

const router = express.Router();

//USER INFO

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.userid;
    if (!userId) {
      return res.status(400).send("User not found");
    }
    let query = `SELECT fullname FROM Users WHERE user_id = '${userId}'`;
    let result = await executeQuery(query);
    res.send(result[0].fullname);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("An error occured while fetching user info");
  }
});

export default router;
