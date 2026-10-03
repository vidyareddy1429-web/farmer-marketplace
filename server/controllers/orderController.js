const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order & decrease product stock
// @route   POST /api/orders
// @access  Private (Customer)
exports.createOrder = async (req, res, next) => {
  try {
    const { items, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!address || !address.street || !address.city || !address.state || !address.zip || !address.phone) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    // Verify stock and prepare items
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name || item.product} not found` });
      }

      if (product.quantity < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product.name}'. Available: ${product.quantity} ${product.unit}`,
        });
      }

      // Calculate total & build verified item
      calculatedTotal += product.price * item.qty;
      orderItems.push({
        product: product._id,
        farmer: product.farmer,
        name: product.name,
        qty: item.qty,
        price: product.price,
        unit: product.unit,
        image: product.image,
      });

      // Deduct stock
      product.quantity -= item.qty;
      await product.save();
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount: calculatedTotal,
      address,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer order history
// @route   GET /api/orders/my
// @access  Private (Customer)
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'name category image unit')
      .populate('items.farmer', 'name farmName phone location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders containing products listed by the logged-in farmer
// @route   GET /api/orders/farmer
// @access  Private (Farmer)
exports.getFarmerOrders = async (req, res, next) => {
  try {
    // Find all orders where at least one item belongs to this farmer
    const orders = await Order.find({ 'items.farmer': req.user._id })
      .populate('customer', 'name email phone location')
      .populate('items.product', 'name category image unit')
      .sort({ createdAt: -1 });

    // Filter order items so farmer only sees their own products in each order
    const filteredOrders = orders.map((order) => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(
        (item) => item.farmer.toString() === req.user._id.toString()
      );
      return orderObj;
    });

    res.json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status by farmer
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer or Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'accepted', 'shipped', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if status is changed to cancelled -> restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity += item.qty;
          await product.save();
        }
      }
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
