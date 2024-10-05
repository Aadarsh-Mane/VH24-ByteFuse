import mongoose from "mongoose";
import RiskQuestion from "./models/risk.js";

// MongoDB connection string (replace with your actual URI)
const mongoURI =
  "mongodb+srv://onlyaddy68:5mPZQwXW2cYyzw2q@vcet.c0gng.mongodb.net/vcetbackend?retryWrites=true&w=majority&appName=vcet";

// Function to seed risk questions into the database
async function seedRiskQuestions() {
  const questions = [
    {
      question:
        "How would you react if your investments dropped by 10% in a month?",
      options: [
        { option: "Sell all investments", points: 1 },
        { option: "Hold for recovery", points: 2 },
        { option: "Buy more shares", points: 3 },
      ],
    },
    {
      question: "What type of growth do you prefer?",
      options: [
        { option: "Steady, low risk", points: 1 },
        { option: "Moderate, balanced growth", points: 2 },
        { option: "High, aggressive growth", points: 3 },
      ],
    },
    {
      question: "If you lost 10% of your investment, how would you feel?",
      options: [
        { option: "Extremely anxious", points: 1 },
        { option: "Somewhat concerned", points: 2 },
        { option: "Motivated to invest", points: 3 },
      ],
    },
    {
      question: "What is your investment horizon?",
      options: [
        { option: "Less than one year", points: 1 },
        { option: "One to five years", points: 2 },
        { option: "Over five years", points: 3 },
      ],
    },
    {
      question: "How do you view financial risks?",
      options: [
        { option: "Avoid at all", points: 1 },
        { option: "Accept some risk", points: 2 },
        { option: "Seek high risk", points: 3 },
      ],
    },
  ];

  try {
    await RiskQuestion.deleteMany(); // Clear existing questions to avoid duplicates
    await RiskQuestion.insertMany(questions); // Insert new questions
    console.log("Risk questions seeded successfully!");
  } catch (error) {
    console.error("Error seeding risk questions:", error);
  } finally {
    mongoose.connection.close(); // Close the connection after the operation
  }
}

// Connect to MongoDB and call the seed function
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedRiskQuestions();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
