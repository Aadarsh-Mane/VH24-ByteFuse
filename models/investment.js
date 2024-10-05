import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  investType: {
    type: String,
    enum: ["Stocks", "Mutual Funds", "Bonds", "Property"],
    required: true,
  },
  stocks: [
    {
      name: { type: String, required: true },
      investedAmount: { type: Number, required: true },
      numberOfStocks: { type: Number, required: true },
      pricePerStock: { type: Number, required: true },
    },
  ],
  mutualFunds: [
    {
      name: { type: String, required: true },
      investedAmount: { type: Number, required: true },
      numberOfUnits: { type: Number, required: true },
      pricePerUnit: { type: Number, required: true },
    },
  ],
  bonds: [
    {
      name: { type: String, required: true },
      investedAmount: { type: Number, required: true },
      maturityDate: { type: Date, required: true },
    },
  ],
  property: [
    {
      name: { type: String, required: true },
      investedAmount: { type: Number, required: true },
      propertyValue: { type: Number, required: true },
      location: { type: String, required: true },
    },
  ],
});

const Investment = mongoose.model("Investment", investmentSchema);

export default Investment;
