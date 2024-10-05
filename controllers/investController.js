import Investment from "../models/investment.js";
import User from "../models/user.js";

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
export const getUserInvestments = async (req, res) => {
  try {
    const userId = req.userId; // Assuming user ID is stored in req.user.id after authentication

    // Fetch user data
    const user = await User.findById(userId).select(
      "annualIncome currentSavings"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user's investments
    const investments = await Investment.find({ userId: userId });

    // Prepare to group stocks
    let totalStockInvestment = 0;
    const groupedStocks = {};

    investments.forEach((investment) => {
      if (investment.investType === "Stocks") {
        investment.stocks.forEach((stock) => {
          if (groupedStocks[stock.name]) {
            // If the stock already exists in the group, update its totals
            groupedStocks[stock.name].numberOfStocks += stock.numberOfStocks;
            groupedStocks[stock.name].investedAmount += stock.investedAmount;
          } else {
            // Otherwise, create a new entry for this stock
            groupedStocks[stock.name] = {
              name: stock.name,
              investedAmount: stock.investedAmount,
              numberOfStocks: stock.numberOfStocks,
              pricePerStock: stock.pricePerStock, // Assuming you want to keep the price per stock as well
              _id: stock._id, // You might want to generate a unique _id or manage it differently
            };
          }
          totalStockInvestment += stock.investedAmount; // Total invested amount
        });
      }
    });

    // Prepare response data
    const response = {
      annualIncome: user.annualIncome,
      currentSavings: user.currentSavings,
      investments: investments,
      totalStockInvestment: totalStockInvestment,
      groupedStocks: Object.values(groupedStocks), // Convert the grouped stocks object to an array
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user investments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
