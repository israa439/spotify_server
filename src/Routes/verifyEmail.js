//IMPORTS
import express from "express";
import executeQuery from "../Config/Database.js";

const router = express.Router();

//VERIFYING CODE SENT TO USER

router.post("/", async (req, res) => {
  try {
    let query = "SELECT * FROM verify_email WHERE email=@email";
    let values = {
      email: req.body.email,
    };
    let result = await executeQuery(query, values);
    let record = result[0];
    let expiryDate = new Date(record.expiry_date);
    let currentDate = new Date();
    if (currentDate > expiryDate) {
      res.status(400).send("code expired");
      await executeQuery("DELETE FROM verify_email WHERE email=@email", values);
      return;
    }
    if (parseInt(req.body.code, 10) === parseInt(record.code, 10)) {
      res.status(200).send("code verified");
      await executeQuery("DELETE FROM verify_email WHERE email=@email", values);
      return;
    }
    res.status(400).send("code incorrect");
  } catch (err) {
    res.status(500).send("An error occured while verifying code");
  }
});

export default router;
