import { sql } from "../config/db.js";

export async function getAllTransactions(req, res) {
  try {
    const result = await sql`SELECT * FROM "transactions"`;
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching transactions", error);
    return res.status(500).json({ message: "Error fetching transactions" });
  }
}

export async function postATransaction(req, res) {
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
}
export async function getTransactionByUserId(req, res) {
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
}

export async function deleteTransactionById(req, res) {
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
}

export async function getSummaryByUserId(req, res) {
  const { userId } = req.params;

  try {
    const balanceResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions where user_id = ${userId}`;

    const incomeResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions where user_id = ${userId} amount > 0`;

    const expensesResult =
      await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions where user_id = ${userId} amount < 0`;

    return res.status(201).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error getting transaction summary for user:", error);
    return res
      .status(500)
      .json({ message: "Error getting transaction summary for user:", error });
  }
}
