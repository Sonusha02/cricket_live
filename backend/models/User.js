import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 }, // Wallet balance
  role: { type: String, enum: ["user", "admin", "subadmin"], default: "user" },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);