import express from 'express'
import { getMe, googleLogin, login, logout, register, updateProfilePicture } from '../controller/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const auth_router = express.Router()
auth_router.post('/register',register)
auth_router.post('/login',login)
auth_router.post("/google", googleLogin);
// Protected route
auth_router.get("/me", protectRoute, getMe);
auth_router.put("/picture", protectRoute, updateProfilePicture);
auth_router.post("/logout", logout);


export default auth_router