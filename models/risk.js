import mongoose from "mongoose";
const riskQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      option: { type: String, required: true },
      points: { type: Number, required: true },
    },
  ],
});

const RiskQuestion = mongoose.model("RiskQuestion", riskQuestionSchema);
export default RiskQuestion;
