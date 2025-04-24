// 
import { deleteUser, getUser, getUsers, registerUser, updateProfile, userLogin } from "../contoller/authController.js";
import express from 'express'



 export const userRoute = express.Router();
userRoute.post('/auth/register',registerUser)
userRoute.post('/auth/login',userLogin)
userRoute.get('/auth/get/profile/:id', getUser);
userRoute.get('/auth/get/all', getUsers);
userRoute.put("/auth/update/profile/:id", updateProfile);
userRoute.delete("/auth/delete/:id", deleteUser);
// userRoute.put("/auth/update/password/:id", updatePassword);
// userRoute.post("/auth/send/email", resetEmail);
// userRoute.post("/auth/reset/password/:token",resetPassword);

