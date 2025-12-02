import User from "../models/User.js";


export const listProviders = async (req, res) => {
  const q = (req.query.q || "").trim();
  const category = req.query.category;
  const city = req.query.city;
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const pageSize = Math.min(50, Math.max(6, parseInt(req.query.pageSize || "9", 10)));
  const sort = req.query.sort || "rating"; 

  const filter = { role: "provider" };

  if (category) filter.categories = category;
  if (city) filter["location.city"] = city;

  if (q) {
    filter.$or = [
      { name: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
      { bio: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
      { categories: new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
      { "location.city": new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
    ];
  }

  let sortObj = { rating: -1 };
  if (sort === "newest") sortObj = { createdAt: -1 };

  const total = await User.countDocuments(filter);
  const providers = await User.find(filter)
    .select("name avatar rating reviewsCount bio location categories priceRange isProviderVerified phone")
    .sort(sortObj)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();

  res.json({
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    data: providers,
  });
};

export const getProvider = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid provider id" });
      }
  
      const provider = await User.findOne({ _id: id, role: "provider" })
        .select("-password")
        .lean();
  
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
  
      return res.json({ provider });
    } catch (err) {
      next(err);
    }
  };
  
