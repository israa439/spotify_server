//IMPORTS
import express from "express";
import executeQuery from "../Config/Database.js";
const router = express.Router();

// GETTING PODCASTS

router.get("/", async (req, res) => {
  try {
    let query = `SELECT podcast_id ,podcast_url as song_url, podcast_name as song_name,podcast_image as song_image FROM podcasts`;
    let result = await executeQuery(query);
    res.send(result)
  } catch (err) {
    res.send(err);
  }
});

export default router;