import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../helpers/cloudinary.js";
import RiskQuestion from "../models/risk.js";
const SECRET = "VCET";
import axios from "axios";
// hi
export const signup = async (req, res) => {
  const {
    email,
    username,
    password,
    age,
    annualIncome,
    numberOfDependent,
    healthCondition,
    highestEdu,
    futurefinancialgoal,
    currentSavings,
    existingInvestments,
  } = req.body;

  try {
    console.log("data here : " + username);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the provided fields
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      age,
      annualIncome,
      numberOfDependent,
      healthCondition,
      highestEdu,
      futurefinancialgoal,
      currentSavings,
      existingInvestments,
    });

    await newUser.save();
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      message: "User registered successfully",
      user: newUser,
      token: token, // Include the token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(404).json({ message: "invalid credetails" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {}
};

export const editProfile = async (req, res) => {
  const userId = req.userId;
  const {
    username,
    age,
    annualIncome,
    numberOfDependent,
    healthCondition,
    highestEdu,
    futurefinancialgoal,
    currentSavings,
    existingInvestments,
  } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileImageUrl = user.profileImageUrl; // Keep existing image if no new one is provided

    if (req.file) {
      // Upload image directly to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "user_profiles", // Change folder as needed
              resource_type: "auto", // Automatically detect the file type
            },
            (error, result) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                resolve(result);
              }
            }
          )
          .end(req.file.buffer); // Pass the buffer to Cloudinary
      });

      profileImageUrl = uploadResult.secure_url; // Save the image URL
    }

    // Update user fields only if they are provided
    if (username !== undefined) user.username = username;
    if (age !== undefined) user.age = age;
    if (annualIncome !== undefined) user.annualIncome = annualIncome;
    if (numberOfDependent !== undefined)
      user.numberOfDependent = numberOfDependent;
    if (currentSavings !== undefined) user.currentSavings = currentSavings;
    if (healthCondition) user.healthCondition = healthCondition.split(",");
    if (highestEdu) user.highestEdu = highestEdu.split(",");
    if (futurefinancialgoal)
      user.futurefinancialgoal = futurefinancialgoal.split(",");
    if (existingInvestments)
      user.existingInvestments = existingInvestments.split(",");
    // Update the profile image URL if a new image was uploaded
    if (profileImageUrl) {
      user.profileImageUrl = profileImageUrl;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};
export const submitrisk = async (req, res) => {
  const userId = req.userId; // Get the user ID from the auth middleware
  const answers = req.body.answers; // Assume this is an array of selected option points

  // Calculate the total points
  const totalPoints = answers.reduce((acc, points) => acc + points, 0);

  // Determine the user's risk tolerance category
  let riskCategory, interpretation;
  if (totalPoints <= 7) {
    riskCategory = "low";
    interpretation = "Prefers stability and capital preservation.";
  } else if (totalPoints <= 12) {
    riskCategory = "medium";
    interpretation = "Open to some risk for potential growth.";
  } else {
    riskCategory = "high";
    interpretation = "Willing to take significant risks for high returns.";
  }

  // Construct the risk tolerance string
  // const riskTolerance = `${riskCategory} - ${interpretation}`;
  const riskTolerance = riskCategory;
  // Update the user's risk tolerance in the database
  try {
    await User.findByIdAndUpdate(userId, { riskTolerance });
    res.json({
      totalPoints,
      riskCategory,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating the user's risk tolerance",
    });
  }
};
export const getQuestions = async (req, res) => {
  try {
    const questions = await RiskQuestion.find(); // Fetch all questions from the database
    res.json(questions);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching risk assessment questions",
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const getAllUsers = await User.find();
    res.json(getAllUsers);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching risk assessment questions",
    });
  }
};
export const getUser = async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    // axios
    //   .get("http://192.168.221.205:8080/ai/computePortfolio/")
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.log({ error: error.message });
    //   });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching your user information",
      errors: error.message,
    });
  }
};
