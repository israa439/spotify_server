import express from "express";
import executeQuery from "../Config/Database.js";
const router = express.Router();

//GETTING ALBUMS

router.get("/", async (req, res) => {
  try {
    let query = `SELECT 
        Albums.album_id,
        Albums.artist_name,
        Albums.image AS album_image,
        Songs.song_id,
        Songs.song_name,
        Songs.song_url,
        Songs.song_image,
        Songs.album_id 
        FROM Albums LEFT JOIN Songs ON Albums.album_id = Songs.album_id;
        `;
    let result = await executeQuery(query);
    let Albums = {};
    result.forEach((item) => {
      if (!Albums[item.album_id]) {
        Albums[item.album_id] = {
          album_id: item.album_id[0],
          artist_name: item.artist_name,
          album_image: item.album_image,
          songs: [],
        };
      }
      if (item.song_id) {
        Albums[item.album_id].songs.push({
          song_id: item.song_id,
          song_name: item.song_name,
          song_url: item.song_url,
          song_image: item.song_image,
          album_id: item.song_album_id,
        });
      }
    });
    const albumList = Object.values(Albums);
    res.send(albumList);
  } catch (error) {
    res.send(error.message);
  }
});

export default router;
