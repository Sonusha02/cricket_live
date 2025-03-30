import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (user.role !== "admin" && user.role !== "subadmin")) {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

export default adminMiddleware;
