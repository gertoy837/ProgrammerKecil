const dataStore = require("../models/dataStore");

exports.checkout = async (req, res) => {
  try {
    const result = await dataStore.checkoutCart(req.user.id);

    if (result.error) {
      return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.status(201).json({ message: "Order created successfully", order: result.order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
