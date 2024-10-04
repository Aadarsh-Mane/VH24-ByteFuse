import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    default: 0,
  },
  profileImageUrl: {
    type: String,
    default: "", // default profile image URL value
  },
  annualIncome: {
    type: Number,
    default: 0, // default annual income value
  },
  numberOfDependent: {
    type: Number,
    default: 0,
  },
  healthCondition: {
    type: [String],
    enum: ["Major Disease", "Minor Diseass", "Healthy"],
    default: ["Healthy"],
  },
  highestEdu: {
    type: [String],
    enum: ["Undergraduate", "Postgraduate", "ssc", "hsc", "diploma"],
    default: [],
  },
  futurefinancialgoal: {
    type: [String],
    enum: [
      "Marriage",
      "Buy Home",
      "Children Education",
      "Children Marriage",
      "Startup",
      "Business",
      "Buy Vehicle",
    ],
    default: [],
  },
  currentSavings: {
    type: Number,
    default: 0,
  },
  existingInvestments: {
    type: [String],
    enum: [
      "Low-risk bonds",
      "Mixed mutual funds",
      "Stocks",
      "Conservative bonds",
      "High-dividend stocks",
      "ETFs",
      "Aggressive growth stocks",
      "Real estate",
      "Annuity",
      "Tech stocks",
    ],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
