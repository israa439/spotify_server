// IMPORTS
import express from "express";
import executeQuery from "../Config/Database.js";
import authenticateToken from "../Utils/tokenAuth.js";
const router = express.Router();

// ADDING FAVORITE SONGS
router.post("/", authenticateToken, async (req, res) => {
  try {
    let userId = req.userid;
    const values = {
      user_id: userId,
      song_id: req.body.song_id,
    };
    const result = await executeQuery(
      "SELECT * FROM Favorites_Songs WHERE user_id=@user_id AND song_id=@song_id",
      values
    );

    if (result.length > 0) {
      return res.status(400).send({ res: "Song already added to favorites" });
    }
    await executeQuery(
      "INSERT INTO Favorites_Songs (user_id,song_id) VALUES (@user_id,@song_id)",
      values
    );
        res.status(200).send({ res: "Song added to favorites" });
  } catch (error) {
     console.log(error.message);
     res.status(500).send(error.message);
  }
});
export default router;
