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
import {
  addInvestment,
  getUserInvestments,
} from "../controllers/investController.js";
import {
  fetchTrends,
  getRecommendationTrends,
  getTrendingNews,
  ipo,
} from "../controllers/scrapController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.patch(
  "/editProfile",
  auth,
  upload.single("profileImage"),
  editProfile
);
userRouter.get("/getAllUsers", getAllUsers);
userRouter.get("/getUser", auth, getUser);

userRouter.post("/invest", auth, addInvestment);
userRouter.get("/getUserInvestment", auth, getUserInvestments);

userRouter.get("/getAllQuestions", getQuestions);

userRouter.get("/ipo", ipo);
userRouter.get("/news", fetchNews);
userRouter.get("/trending-news", getTrendingNews);
userRouter.get("/recommended/:symbol", getRecommendationTrends);

userRouter.post("/submit-risk", auth, submitrisk);
export default userRouter;
