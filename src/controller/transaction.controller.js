import mongoose from "mongoose";
import { Transaction } from "../models/transaction.models.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const createTransaction = async (req, res) => {
  try {
    const {
      transactionType,
      date,
      account,
      amount,
      reference,
      entryTime,
      enteredBy,
      description,
    } = req.body;

    if (!transactionType || !date || !account || !enteredBy || amount === undefined || amount === "") {
      return errorResponse(res, "Required fields are missing", 400);
    }

    const transaction = await Transaction.create({
      transactionType,
      date,
      account,
      amount: Number(amount),
      reference,
      entryTime: entryTime || Date.now(),
      enteredBy,
      description,
    });

    return successResponse(res, "Transaction created successfully", transaction, 201);
  } catch (error) {
    console.log("error at createTransaction controller", error);
    return errorResponse(res, "Error at create transaction controller", 400, error);
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1, createdAt: -1 });

    return successResponse(res, "Transactions fetched successfully", transactions);
  } catch (error) {
    console.log("error at getTransactions controller", error);
    return errorResponse(res, "Error at get transactions controller", 500, error);
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid transaction id", 400);
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return errorResponse(res, "Transaction not found", 404);
    }

    return successResponse(res, "Transaction fetched successfully", transaction);
  } catch (error) {
    console.log("error at getTransactionById controller", error);
    return errorResponse(res, "Error at get transaction by id controller", 500, error);
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, "Invalid transaction id", 400);
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return errorResponse(res, "Transaction not found", 404);
    }

    return successResponse(res, "Transaction deleted successfully", transaction);
  } catch (error) {
    console.log("error at deleteTransaction controller", error);
    return errorResponse(res, "Error at delete transaction controller", 500, error);
  }
};