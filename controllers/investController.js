import Investment from "../models/investment.js";

export const addInvestment = async (req, res) => {
  const { investType, stocks } = req.body; // Receive investType and stock data from the request

  try {
    // Create a new investment entry
    const investment = new Investment({
      userId: req.userId, // Assuming you are using JWT and req.user is populated
      investType,
      stocks: investType === "Stocks" ? stocks : [], // Populate stocks only if the investment type is Stocks
      // You can handle mutual funds, bonds, and properties similarly
    });

    await investment.save();
    res
      .status(201)
      .json({ message: "Investment added successfully", investment });
  } catch (error) {
    res.status(500).json({ message: "Error adding investment", error });
  }
};
