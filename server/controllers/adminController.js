const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get all users (with role filter)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle farmer approval
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
exports.approveFarmer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : !user.isApproved;
    await user.save();

    res.json({
      success: true,
      message: `Farmer approval set to ${user.isApproved}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProductAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product listing removed by admin',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await User.countDocuments();
    const activeProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total platform sales revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFarmers,
        totalCustomers,
        totalProducts: activeProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
