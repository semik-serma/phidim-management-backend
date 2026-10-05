import mongoose from "mongoose";

const billItemSchema = new mongoose.Schema(
  {
    particular: {
      type: String,
      required: true,
      trim: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    rate: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const billSchema = new mongoose.Schema(
  {
    project: {
      type: String,
      required: true,
      trim: true,
    },

    customer_name: {
      type: String,
      required: true,
      trim: true,
    },

    phone_number: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    items: {
      type: [billItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "At least one item is required",
      },
    },

    grand_total: {
      type: Number,
      required: true,
      min: 0,
    },

    bill_date: {
      type: Date,
      default: Date.now,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registerModel",
    },
  },
  {
    timestamps: true,
  }
);

const Bill =
  mongoose.models.Bill || mongoose.model("Bill", billSchema);

export default Bill;