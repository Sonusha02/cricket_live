import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  screenshotUrl: { type: String, required: true }, // Store screenshot link
}, { timestamps: true });

export default mongoose.model("WalletTransaction", WalletTransactionSchema);
