// IMPORTS

import express from "express";
import executeQuery from "../Config/Database.js";
import authenticateToken from "../Utils/tokenAuth.js";
const router = express.Router();

//REMOVING SONG FROM FAVORITES
router.delete("/", authenticateToken, async (req, res) => {
    try {
       
        let userId = req.userid;
        let songId = req.body.song_id;
        if (!userId) {
        return res.status(400).send({ res: "User not found" });
        }
        let query = `DELETE FROM Favorites_Songs WHERE user_id=@user_id AND song_id=@song_id`;
        const values = {
        user_id: userId,
        song_id: songId,
        };
        const result = await executeQuery(query, values);
        res.status(200).send({ res: "Song removed from favorites" });
    } catch (error) {
        res.status(500).send({ res: "An error occured while removing song from favorites" });
    }
});

export default router;