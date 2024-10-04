import express from "express";
import { auth } from "../middleware/auth.js";
import { editProfile, signin, signup } from "../controllers/userController.js";
import upload from "../helpers/multer.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.patch(
  "/user/:id/edit",
  auth,
  upload.single("profileImage"),
  editProfile
);

export default userRouter;
