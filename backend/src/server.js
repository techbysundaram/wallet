import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoute.js";
dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(rateLimiter);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT;

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is working" });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
  });
});
