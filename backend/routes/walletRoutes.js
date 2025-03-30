// import express from "express";
// import multer from "multer";
// import WalletTransaction from "../models/WalletTransaction.js";
// import User from "../models/User.js";
// import authMiddleware from "../middlewares/authMiddleware.js";
// import adminMiddleware from "../middlewares/adminMiddleware.js";

// const router = express.Router();

// // Setup multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // User requests to add money (uploads screenshot)
// router.post("/deposit", authMiddleware, upload.single("screenshot"), async (req, res) => {
//   try {
//     const { amount } = req.body;
//     if (!amount || isNaN(amount) || amount <= 0) return res.status(400).json({ msg: "Invalid amount" });

//     const screenshotUrl = `uploads/${req.file.originalname}`; // Simulated file storage
//     const transaction = new WalletTransaction({ user: req.user.id, amount, screenshotUrl });

//     await transaction.save();
//     res.json({ msg: "Deposit request submitted", transaction });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// });

// // Admin approves deposit request
// router.put("/approve/:id", adminMiddleware, async (req, res) => {
//   try {
//     const transaction = await WalletTransaction.findById(req.params.id);
//     if (!transaction || transaction.status !== "pending") return res.status(400).json({ msg: "Invalid request" });

//     transaction.status = "approved";
//     await transaction.save();

//     await User.findByIdAndUpdate(transaction.user, { $inc: { balance: transaction.amount } });

//     res.json({ msg: "Deposit approved", transaction });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// });

// // Admin rejects deposit request
// router.put("/reject/:id", adminMiddleware, async (req, res) => {
//   try {
//     const transaction = await WalletTransaction.findById(req.params.id);
//     if (!transaction || transaction.status !== "pending") return res.status(400).json({ msg: "Invalid request" });

//     transaction.status = "rejected";
//     await transaction.save();

//     res.json({ msg: "Deposit rejected", transaction });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// });

// // User fetches wallet balance
// router.get("/balance", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     res.json({ balance: user.balance });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// });

// // Admin fetches all pending deposit requests
// router.get("/pending", adminMiddleware, async (req, res) => {
//   try {
//     const transactions = await WalletTransaction.find({ status: "pending" }).populate("user", "username email");
//     res.json(transactions);
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error", error: err.message });
//   }
// });

// export default router;



import express from "express";
import multer from "multer";
import Wallet from "../models/Wallet.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// 📌 User: Submit Wallet Deposit Request
router.post("/deposit", protect, upload.single("paymentScreenshot"), async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || !req.file) return res.status(400).json({ message: "Amount & Screenshot required" });

    const deposit = await Wallet.create({
      userId: req.user._id,
      amount,
      paymentScreenshot: req.file.path,
    });

    res.status(201).json({ message: "Deposit request submitted", deposit });
  } catch (error) {
    res.status(500).json({ message: "Error processing deposit", error });
  }
});

// 📌 Admin: Approve/Reject Deposit
router.put("/approve/:id", protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    const deposit = await Wallet.findById(req.params.id);
    if (!deposit) return res.status(404).json({ message: "Deposit not found" });

    deposit.status = status;
    await deposit.save();

    res.json({ message: `Deposit ${status}`, deposit });
  } catch (error) {
    res.status(500).json({ message: "Error updating deposit", error });
  }
});

// 📌 User: View Wallet Transactions
router.get("/transactions", protect, async (req, res) => {
  try {
    const transactions = await Wallet.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// 📌 Admin: View Pending Deposits
router.get("/pending", protect, isAdmin, async (req, res) => {
  try {
    const deposits = await Wallet.find({ status: "pending" }).populate("userId", "name email");
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending deposits", error });
  }
});

export default router;

