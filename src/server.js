//IMPORTS
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import signinRoutes from "./Routes/signin.js";
import signupRoutes from "./Routes/signup.js";
import logoutRoutes from "./Routes/logout.js";
import { config as dotenvConfig } from "dotenv";
import userInfoRoutes from "./Routes/userInfo.js";
import getSongsRoutes from "./Routes/getSongs.js";
import getAlbumsRoutes from "./Routes/getAlbums.js";
import sendEmailRoutes from "./Routes/sendEmail.js";
import verifyEmailRoutes from "./Routes/verifyEmail.js";
import getPodcastsRoutes from "./Routes/getPodcasts.js";
import addFavoriteSongRoutes from "./Routes/addFavoriteSong.js";
import addFavoritePodcastRoutes from "./Routes/addFavoritesPodcasts.js";
import getFavoriteSongsRoutes from "./Routes/getFavoriteSongs.js";
import getFavoritePodcastsRoutes from "./Routes/getFavoritePodcast.js";
import deleteFavSongRoutes from "./Routes/removeFavSong.js";
import deleteFavPodcastRoutes from "./Routes/removeFavPodcast.js";
//CREATE SERVER
dotenvConfig();
const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = process.env.CORS_ORIGIN;

//MIDDLEWARE
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: corsOptions,
    credentials: true,
  })
);

//HANDLE PREFLIGHT REQUESTS
app.options(
  "*",
  cors({
    origin: corsOptions,
    credentials: true,
  })
);

// Set CORS headers for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOptions);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//HOME PAGE
app.get("/", (req, res) => {
  res.send("Hello from Homepage");
});

//SIGN IN ROUTES
app.use("/signin", signinRoutes);

//SEND EMAIL ROUTES
app.use("/sendEmail", sendEmailRoutes);

//VERIFY EMAIL ROUTES
app.use("/verifyEmail", verifyEmailRoutes);

//SIGN UP ROUTES
app.use("/signup", signupRoutes);

//GET ALBUMS ROUTES
app.use("/getAlbums", getAlbumsRoutes);

// GET SONGS ROUTES
app.use("/getSongs", getSongsRoutes);

//USER INFO ROUTES
app.use("/userInfo", userInfoRoutes);

//LOGOUT ROUTES
app.use("/logout", logoutRoutes);

//GET PODCASTS ROUTES
app.use("/getPodcasts", getPodcastsRoutes);

// ADD FAVORITE SONGS ROUTES
app.use("/addFavoriteSong", addFavoriteSongRoutes);

// ADD FAVORITE PODCASTS ROUTES
app.use("/addFavoritePodcast", addFavoritePodcastRoutes);

// GET FAVORITE SONGS ROUTES
app.use("/getFavoriteSongs", getFavoriteSongsRoutes);

// GET FAVORITE PODCASTS ROUTES
app.use("/getFavoritePodcasts", getFavoritePodcastsRoutes);

// DELETE FAVORITE SONGS ROUTES
app.use("/deleteFavSong", deleteFavSongRoutes);

// DELETE FAVORITE PODCASTS ROUTES
app.use("/deleteFavPodcast", deleteFavPodcastRoutes);

//LISTEN TO PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
