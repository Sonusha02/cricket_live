import express from "express";
import Bet from "../models/Bet.js";
import User from "../models/User.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// 📌 Place a bet
router.post("/place", authMiddleware, async (req, res) => {
  try {
    const { matchId, market, selection, odds, stake } = req.body;
    if (!matchId || !market || !selection || !odds || !stake) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.balance < stake) return res.status(400).json({ msg: "Insufficient balance" });

    const potentialWin = stake * odds;
    const bet = new Bet({ user: req.user.id, matchId, market, selection, odds, stake, potentialWin });

    user.balance -= stake; // Deduct bet amount from wallet
    await user.save();
    await bet.save();

    res.json({ msg: "Bet placed successfully", bet });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// 📌 Get all bets of a user
router.get("/my-bets", authMiddleware, async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// 📌 Get all pending bets (for admin to settle)
router.get("/pending", adminMiddleware, async (req, res) => {
  try {
    const pendingBets = await Bet.find({ status: "pending" }).populate("user", "username email");
    res.json(pendingBets);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// 📌 Settle a bet (Admin)
router.put("/settle/:id", adminMiddleware, async (req, res) => {
  try {
    const { result } = req.body; // "won" or "lost"
    const bet = await Bet.findById(req.params.id);
    if (!bet || bet.status !== "pending") return res.status(400).json({ msg: "Invalid bet" });

    bet.status = result;
    await bet.save();

    if (result === "won") {
      const user = await User.findById(bet.user);
      user.balance += bet.potentialWin; // Add winnings to wallet
      await user.save();
    }

    res.json({ msg: `Bet ${result}`, bet });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

router.get("/admin/pending", protect, isAdmin, async (req, res) => {
  try {
    const deposits = await Wallet.find({ status: "pending" }).populate("userId", "name email");
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending deposits", error });
  }
});

router.put("/admin/approve/:id", protect, isAdmin, async (req, res) => {
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



export default router;
