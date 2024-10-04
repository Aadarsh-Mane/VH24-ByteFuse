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
    type: String,
    default: "",
  },
  highestEdu: {
    type: String,
    default: "",
  },
  futurefinancialgoal: {
    type: String,
  },
  currentSavings: {
    type: Number,
    default: 0,
  },
  existingInvestments: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
