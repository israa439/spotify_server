// IMPORTS

import express from "express";
import executeQuery from "../Config/Database.js";
const router = express.Router();

// GETTING SONGS

router.get("/:AlbumId", async (req, res) => {
  try {
    let album_id=  req.params.AlbumId;
    let query = `SELECT * FROM Songs WHERE album_id = '${album_id}'`;
    res.send(await executeQuery(query));
  } catch (error) {
    res.send(error.message);
  }
});
export default router;
