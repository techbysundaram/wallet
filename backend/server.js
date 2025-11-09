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

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is working" });
});

app.get("/api/transactions", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM "transactions"`;
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching transactions", error);
    return res.status(500).json({ message: "Error fetching transactions" });
  }
});

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
    return res.status(201).json(transactions[0]);
  } catch (error) {
    console.log("Error creating transaction", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transaction =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    console.log(transaction);
    return res.status(201).json(transaction);
  } catch (error) {
    console.error("Error getting transaction for user:", error);
    return res
      .status(500)
      .json({ message: "Error getting transaction for user:", error });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Please send correct id" });
    }

    const result =
      await sql`DELETE FROM transactions where id = ${id} RETURNING *`;

    if (result.length === 0) {
      return res.status(400).json({ message: "No transaction found" });
    }

    return res.status(201).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction for user:", error);
    return res
      .status(500)
      .json({ message: "Error deleting transaction for user:", error });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
  });
});
