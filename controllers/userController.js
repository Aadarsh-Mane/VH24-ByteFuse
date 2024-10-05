import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../helpers/cloudinary.js";
import RiskQuestion from "../models/risk.js";
const SECRET = "VCET";
import request from "request";
import pkg from "scramjet"; // Importing the whole package as default
const { StringStream } = pkg; // Destructuring to get StringStream
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
  const userId = req.userId; // Extract the authenticated user ID from the session
  console.log(userId);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(userId); // Use the authenticated user's ID

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

// Replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
var url =
  "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo";

export const fetchNews = (req, res) => {
  request.get(
    {
      url: url,
      json: true,
      headers: { "User-Agent": "request" },
    },
    (err, response, data) => {
      if (err) {
        console.log("Error:", err);
        res.status(500).send("Error fetching news");
      } else if (response.statusCode !== 200) {
        console.log("Status:", response.statusCode);
        res.status(response.statusCode).send("Failed to fetch news");
      } else {
        // Log the entire response data to understand its structure
        console.log("Full response data:", JSON.stringify(data, null, 2));

        // Assuming the data has an array of news articles
        if (data && data.feed) {
          // Extracting and formatting the response for all articles
          const newsArticles = data.feed.map((newsArticle) => {
            const {
              title,
              url,
              time_published,
              authors,
              summary,
              banner_image,
              source,
              source_domain,
            } = newsArticle;
            return {
              title,
              url,
              time_published,
              authors,
              summary,
              banner_image,
              source,
              source_domain,
            };
          });

          // Send the formatted response
          res.status(200).json(newsArticles);
        } else {
          res.status(404).send("No news data found");
        }
      }
    }
  );
};
export const getIPO = (req, res) => {
  request
    .get("https://www.alphavantage.co/query?function=IPO_CALENDAR&apikey=demo")
    .pipe(new StringStream())
    .CSVParse()
    .toArray()
    .then((rows) => {
      if (rows.length === 0) {
        res.status(404).json({ message: "No IPO data found" });
        return;
      }

      // Extract header from the first row
      const header = rows[0];
      const ipoData = [];

      // Process each subsequent row and convert to an object using the header
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowData = {};

        header.forEach((key, index) => {
          rowData[key] = row[index];
        });

        ipoData.push(rowData);
      }

      res.status(200).json(ipoData);
    })
    .catch((error) => {
      console.error("Error fetching IPO data:", error);
      res.status(500).send("Error fetching IPO data");
    });
};
