import Bill from "../models/billModel.js";
import {
  successResponse,
  errorResponse,
} from "../utils/response.js";


// ==========================================
// CREATE BILL
// POST /api/bills
// ==========================================
export const createBill = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.auth?.userId;

    const {
      project,
      customer_name,
      phone_number,
      address,
      items,
      bill_date,
    } = req.body;

    if (
      !project ||
      !customer_name ||
      !phone_number ||
      !address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return errorResponse(res, "All fields are required", 400);
    }

    const invalidItem = items.some(
      (item) =>
        !item.particular?.trim() ||
        Number(item.qty) <= 0 ||
        item.rate === undefined ||
        item.rate === null ||
        item.rate === "" ||
        Number(item.rate) < 0
    );

    if (invalidItem) {
      return errorResponse(
        res,
        "Please fill all item details correctly",
        400
      );
    }

    const calculatedItems = items.map((item) => {
      const qty = Number(item.qty);
      const rate = Number(item.rate);

      return {
        particular: item.particular.trim(),
        qty,
        rate,
        total: qty * rate,
      };
    });

    const grand_total = calculatedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const bill = await Bill.create({
      userId,
      project: project.trim(),
      customer_name: customer_name.trim(),
      phone_number: phone_number.trim(),
      address: address.trim(),
      items: calculatedItems,
      grand_total,
      bill_date: bill_date || Date.now(),
    });

    return successResponse(
      res,
      "Bill created successfully",
      bill,
      201
    );
  } catch (error) {
    console.error("CREATE BILL ERROR:", error);

    return errorResponse(
      res,
      error.message || "Failed to create bill",
      500
    );
  }
};


export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findById(id);

    if (!bill) {
      return errorResponse(res, "Bill not found", 404);
    }

    return successResponse(
      res,
      "Bill fetched successfully",
      bill,
      200
    );
  } catch (error) {
    console.error("GET BILL ERROR:", error);

    return errorResponse(
      res,
      error.message || "Failed to fetch bill",
      500
    );
  }
};

export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });

    return successResponse(res, "Bills fetched successfully", bills);
  } catch (error) {
    console.log("error at getAllBills controller", error);
    return errorResponse(res, "Error while trying to fetch all bills", 500, error);
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByIdAndDelete(id);

    if (!bill) {
      return errorResponse(res, "Bill not found", 404);
    }

    return successResponse(res, "Bill deleted successfully", bill, 200);
  } catch (error) {
    console.error("DELETE BILL ERROR:", error);
    return errorResponse(res, error.message || "Failed to delete bill", 500);
  }
};

