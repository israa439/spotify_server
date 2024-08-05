//IMPORTS
import jwt from "jsonwebtoken";
import { config as dotenvConfig } from "dotenv";
import executeQuery from "../Config/Database.js";

dotenvConfig();

const secret_token = process.env.ACCESS_TOKEN_SECRET;
const secret_refresh_token = process.env.REFRESH_TOKEN_SECRET;

//FUNCTION TO AUTHENTICATE TOKEN

async function authenticateToken(req, res, next) {
  try {
    req.userid = null;
    const token = req.cookies.authToken;
    if (!token) {
      console.log("No token found");
      return next();
    }
    let decoded = jwt.decode(token);
    if (!decoded) {
      console.log("Invalid token");
      return next();
    }
    let currentTime = Date.now();
    if (decoded.exp * 1000 < Date.now()) {
      let result = await executeQuery(
        "SELECT * FROM refresh_tokens WHERE user_id=@user_id",
        { user_id: decoded.userid }
      );
      if (result.length === 0) {
        return res.status(403).send("Your session has expired");
      }
      
      if (new Date(result[0].expiry_date) <= currentTime) {
        await executeQuery(
          "DELETE FROM refresh_tokens WHERE user_id=@user_id",
          { user_id: decoded.userid }
        );
        res.clearCookie("authToken");
        return res.status(403).send("Your session has expired");
      }

      jwt.verify(result[0].token, secret_refresh_token, (err) => {
        if (err) return res.status(403).send(err.message);
        let access_token = jwt.sign({ userid: decoded.userid }, secret_token, {
          expiresIn: "10m",
        });
        res.cookie("authToken", access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });
      });
    } else {
      jwt.verify(token, secret_token, (err) => {
        if (err) return res.status(403).send("Invalid token");
      });
    }

    req.userid = decoded.userid;
    return next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).send("Unauthorized");
  }
}

export default authenticateToken;
