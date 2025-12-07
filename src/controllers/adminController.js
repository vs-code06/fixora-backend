import User from "../models/User.js";
import BookingMaster from "../models/BookingMaster.js";
import Contact from "../models/Contact.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalProviders = await User.countDocuments({ role: "provider" });
        const totalBookings = await BookingMaster.countDocuments();

        // Calculate total revenue from completed bookings
        const revenueAgg = await BookingMaster.aggregate([
            { $match: { status: "completed", price: { $exists: true, $ne: null } } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        res.json({
            success: true,
            data: {
                totalUsers,
                totalProviders,
                totalBookings,
                totalRevenue
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all users (non-providers)
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || "";

        const query = {
            role: "user",
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        };

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: users,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all providers
// @route   GET /api/admin/providers
// @access  Admin
export const getAllProviders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || "";

        const query = {
            role: "provider",
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        };

        const total = await User.countDocuments(query);
        const providers = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: providers,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Verify or Unverify Provider
// @route   PATCH /api/admin/providers/:id/verify
// @access  Admin
export const verifyProvider = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== "provider") {
            return res.status(404).json({ success: false, error: "Provider not found" });
        }

        user.isProviderVerified = !user.isProviderVerified;
        await user.save();

        res.json({
            success: true,
            data: { _id: user._id, isProviderVerified: user.isProviderVerified }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Admin
export const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || "";

        // First find users matching search to get their IDs
        let userIds = [];
        let providerIds = [];

        if (search) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select('_id');
            const ids = users.map(u => u._id);
            userIds = ids;
            providerIds = ids;
        }

        const query = {};
        if (search) {
            query.$or = [
                { serviceTitle: { $regex: search, $options: "i" } },
                { user: { $in: userIds } },
                { provider: { $in: providerIds } }
            ];
        }

        const total = await BookingMaster.countDocuments(query);
        const bookings = await BookingMaster.find(query)
            .populate("user", "name email")
            .populate("provider", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get all contact queries
// @route   GET /api/admin/queries
// @access  Admin
export const getQueries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || "";

        const query = {
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { message: { $regex: search, $options: "i" } }
            ]
        };

        const total = await Contact.countDocuments(query);
        const queries = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: queries,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete a query
// @route   DELETE /api/admin/queries/:id
// @access  Admin
export const deleteQuery = async (req, res) => {
    try {
        const query = await Contact.findByIdAndDelete(req.params.id);
        if (!query) {
            return res.status(404).json({ success: false, error: "Query not found" });
        }
        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete user or provider
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
