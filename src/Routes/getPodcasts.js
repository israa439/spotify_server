//IMPORTS
import express from "express";
import executeQuery from "../Config/Database.js";
const router = express.Router();

// GETTING PODCASTS

router.get("/", async (req, res) => {
  try {
    let query = `SELECT * FROM Podcasts;`;
    let result = await executeQuery(query);
    res.send(result)
  } catch (err) {
    res.send(err);
  }
});

export default router;