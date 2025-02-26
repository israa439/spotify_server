//IMPORTS
import executeQuery from "../Config/Database.js";
import express from "express";
import authenticateToken from "../Utils/tokenAuth.js";

const router = express.Router();

//LOGOUT
router.post("/", authenticateToken, async (req, res) => {
  try {
    let userId = req.userId;
    await executeQuery("DELETE FROM refresh_token WHERE user_id=@user_id", {
      user_id: userId,
    });
    res.clearCookie("authToken");
    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occured while logging out");
  }
});
export default router;
