// IMPORTS

import express from "express";
import executeQuery from "../Config/Database.js";
import authenticateToken from "../Utils/tokenAuth.js";
const router = express.Router();

//REMOVING SONG FROM PODCASTS
router.delete("/", authenticateToken, async (req, res) => {
  try {
    let userId = req.userid;
    let podcastId = req.body.podcast_id;
    if (!userId) {
      return res.status(400).send({ res: "User not found" });
    }
    let query = `DELETE FROM Favorites_Podcasts WHERE user_id=@user_id AND podcast_id=@podcast_id`;
    const values = {
      user_id: userId,
      podcast_id: podcastId,
    };
    const result = await executeQuery(query, values);
    res.status(200).send({ res: "Song removed from podcasts"});
  } catch (error) {
    res
      .status(500)
      .send({ res: "An error occured while removing podcast from favorites" });
  }
});
export default router;
