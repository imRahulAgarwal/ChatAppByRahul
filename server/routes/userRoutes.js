import express from "express";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", userController.register);

userRouter.post("/login", userController.login);

userRouter.post("/forgot-password", userController.forgotPassword);

userRouter.post("/reset-password", userController.resetPassword);

userRouter.use(isLoggedIn);

userRouter.get("/profile", userController.profile);

userRouter.put("/profile", userController.updateProfile);

userRouter.post("/change-password", userController.changePassword);

// Search users to send friend request
userRouter.get("/search", userController.searchUsers);

// Get all the list of requests - notifications section
userRouter.get("/friend-requests", userController.listRequests);

// Authenticated user can send a friend request to another user
userRouter.post("/friend-requests", userController.sendRequest);

// Friend request send by the user can be removed by themselves
userRouter.delete("/friend-requests/remove", userController.removeRequest);

// Friend request send to the user can accept the friend request
userRouter.patch("/friend-requests/accept", userController.acceptRequest);

// Friend request send to the user can reject the friend request
userRouter.delete("/friend-requests/reject", userController.rejectRequest);

// Get the list of friends
userRouter.get("/friends", userController.listFriends);

// Any of the friend can remove the following
userRouter.delete("/friends", userController.removeFriend);

export default userRouter;
