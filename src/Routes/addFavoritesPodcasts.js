// IMPORTS

import express from "express";
import executeQuery from "../Config/Database.js";
import authenticateToken from "../Utils/tokenAuth.js";
const router = express.Router();

// ADDING FAVORITE PODCASTS
router.post("/", authenticateToken, async (req, res) => {
  try {
    let userId = req.userid;
    const values = {
      user_id: userId,
      podcast_id: req.body.podcast_id,
    };
    const result1 = await executeQuery(
      "SELECT * FROM Favorites_Podcasts WHERE user_id=@user_id AND podcast_id=@podcast_id",
      values
    );
    if (result1.length > 0) {
      return res.status(400).send({ res: "Podcast already added to favorites" });
    }
    await executeQuery(
      "INSERT INTO Favorites_Podcasts (user_id,podcast_id) VALUES (@user_id,@podcast_id)",
      values
    );
    res.status(200).send({ res: "Podcast added to favorites" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});
export default router;
