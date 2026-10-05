import { registerModel } from "../models/auth.models.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { hash_password } from "../utils/hashPassword.js";
import { verifyGoogleToken } from "../utils/verifyGoogleToken.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return errorResponse(res, "All the fields are required", 400);
    }

    const find_mail = await registerModel.findOne({ email });
    if (find_mail) {
      return errorResponse(res, "Email already exists", 409);
    }

    const hash_pass = await hash_password(password);
    const create_user = await registerModel.create({
      full_name,
      email,
      password: hash_pass,
    });

    if (create_user) {
      return successResponse(res, "User created successfully", null, 201);
    }
  } catch (error) {
    console.log("error at register controller", error);
    return errorResponse(res, "Error at register controller", 400, error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const user = await registerModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    if (user.provider === "google" && !user.password) {
      return errorResponse(
        res,
        "This account was registered using Google. Please click 'Continue with Google'.",
        400
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    generateToken(res, user._id);

    return successResponse(
      res,
      "Login successful",
      {
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          picture: user.picture || "",
        },
      },
      200
    );
  } catch (error) {
    console.error("Error at login controller:", error);
    return errorResponse(res, "Error at login controller", 500, error);
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return errorResponse(res, "Google token is required", 400);
    }

    const googleUser = await verifyGoogleToken(token);

    if (!googleUser.email_verified) {
      return errorResponse(res, "Google email not verified", 401);
    }

    let user = await registerModel.findOne({
      $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
    });

    if (!user) {
      user = await registerModel.create({
        full_name: googleUser.full_name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        provider: "google",
        picture: googleUser.picture || "",
      });
    } else {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        user.provider = "google";
        updated = true;
      }
      if (googleUser.picture && user.picture !== googleUser.picture) {
        user.picture = googleUser.picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    generateToken(res, user._id);

    return successResponse(
      res,
      "Google login successful",
      {
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          picture: user.picture || googleUser.picture || "",
        },
      },
      200
    );
  } catch (error) {
    console.error("Error at google login controller:", error);
    return errorResponse(res, "Error at google login controller", 500, error);
  }
};

export const getMe = async (req, res) => {
  try {
    return successResponse(
      res,
      "User fetched successfully",
      {
        user: {
          id: req.user._id,
          full_name: req.user.full_name,
          email: req.user.email,
          role: req.user.role,
          picture: req.user.picture || "",
        },
      },
      200
    );
  } catch (error) {
    console.error("Error at getMe controller:", error);
    return errorResponse(res, "Error at getMe controller", 500, error);
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const { picture } = req.body;
    if (typeof picture !== "string") {
      return errorResponse(res, "Picture must be a valid string or URL", 400);
    }

    const user = await registerModel.findByIdAndUpdate(
      req.user._id,
      { picture: picture.trim() },
      { new: true }
    ).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "Profile picture updated successfully", {
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        picture: user.picture || "",
      },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return errorResponse(res, "Failed to update profile picture", 500, error);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return successResponse(res, "Logged out successfully", null, 200);
  } catch (error) {
    console.error("Error at logout controller:", error);
    return errorResponse(res, "Error at logout controller", 500, error);
  }
};