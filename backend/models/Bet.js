import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  matchId: { type: String, required: true },
  market: { type: String, enum: ["Match Winner", "Over/Under"], required: true },
  selection: { type: String, required: true }, // e.g., "India" or "Over 150 Runs"
  odds: { type: Number, required: true },
  stake: { type: Number, required: true },
  potentialPayout: { type: Number, required: true },
  status: { type: String, enum: ["pending", "won", "lost"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Bet", betSchema);
