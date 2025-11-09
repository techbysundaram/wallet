import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    console.log("Database initialised successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); //status code 1 means failure, 0 success
  }
}

app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transactions =
      await sql`INSERT INTO transactions(user_id,amount,category,title)
     VALUES (${user_id},${amount},${category},${title})`;

    console.log(transactions);
    res.status(201).json(transactions[0]);
  } catch (error) {
    console.log("Error creating transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
  });
});
