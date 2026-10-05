import express from "express";

import {
  createBill,
  deleteBill,
  getAllBills,
  getBillById,
} from "../controller/billController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const bill_router = express.Router();

bill_router.post(
  "/create-bill",
  protectRoute,
  //   requireAdmin,
  createBill
);

bill_router.get(
  "/bill/:id",
  protectRoute,
  getBillById
);

bill_router.get(
  "/bills",
  protectRoute,
  getAllBills
);

bill_router.delete(
  "/bill/:id",
  protectRoute,
  deleteBill
);

export default bill_router;