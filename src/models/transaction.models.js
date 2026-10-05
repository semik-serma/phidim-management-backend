// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      required: true,
      enum: ['Credit / Money In', 'Debit / Money Out'],
    },
    date: {
      type: Date,
      required: true,
    },
    account: {
      type: String,
      required: true,
      enum: ['Cash', 'Bank'], // adjust to your accounts
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reference: {
      type: String,
      trim: true,
      default: '',   // bill no. / customer / supplier
    },
    entryTime: {
      type: Date,
      default: Date.now,
    },
    enteredBy: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export const Transaction = mongoose.model('Transaction', transactionSchema);

