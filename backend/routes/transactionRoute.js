import express from "express";

import {
  deleteTransactionById,
  getAllTransactions,
  getSummaryByUserId,
  getTransactionByUserId,
  postATransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getAllTransactions);

router.post("/", postATransaction);

router.get("/:userId", getTransactionByUserId);

router.delete("/:id", deleteTransactionById);

router.get("/:userId", getSummaryByUserId);

export default router;
