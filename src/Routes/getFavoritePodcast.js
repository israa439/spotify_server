// IMPORTS

import express from "express";
import executeQuery from "../Config/Database.js";
import authenticateToken from "../Utils/tokenAuth.js";
const router = express.Router();

// ADDING FAVORITE SONGS
router.get("/", authenticateToken, async (req, res) => {
  try {
    let userId = req.userid;
    if (!userId) {
      return res.status(400).send({ res: "User not found" });
    }
    let query = `SELECT P.podcast_id,P.podcast_image,P.podcast_url,P.podcast_name
                  FROM Favorites_Podcasts AS FP
                  INNER JOIN podcasts AS P
                  ON FP.podcast_id =P.podcast_id 
                  WHERE user_id=@user_id`;
    const values = {
      user_id: userId,
    };
    const result = await executeQuery(query, values);
    res.status(200).send(result);
  } catch (error) {
    res
      .status(500)
      .send({ res: "An error occured while fetching user favorite podcasts" });
  }
});
export default router;
