import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Its working");
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
