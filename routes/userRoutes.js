import express from "express";
import { auth } from "../middleware/auth.js";
import {
  editProfile,
  fetchNews,
  getAllUsers,
  getIPO,
  getQuestions,
  getUser,
  signin,
  signup,
  submitrisk,
} from "../controllers/userController.js";
import upload from "../helpers/multer.js";
import { addInvestment } from "../controllers/investController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/submit-risk", auth, submitrisk);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.get("/getUser", auth, getUser);
userRouter.get("/news", fetchNews);
userRouter.post("/invest", auth, addInvestment);
userRouter.get("/ipo", getIPO);
userRouter.get("/getAllQuestions", getQuestions);
userRouter.patch(
  "/editProfile",
  auth,
  upload.single("profileImage"),
  editProfile
);

export default userRouter;
