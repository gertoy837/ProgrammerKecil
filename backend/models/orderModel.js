const { ensureDatabaseReady, getPool } = require("../lib/db");
const { toPublicUploadPath } = require("../lib/fileHelper");

async function getAllOrders() {
  await ensureDatabaseReady();
  const pool = getPool();
  
  const [orders] = await pool.query(`
    SELECT o.id, o.userId, u.name AS userName, o.totalPrice, o.createdAt
    FROM orders o
    LEFT JOIN users u ON u.id = o.userId
    ORDER BY o.createdAt DESC
  `);
  
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const [items] = await pool.query(`
        SELECT oi.id, oi.productId, oi.quantity, oi.priceAtPurchase, p.name AS productName, p.image AS productImage
        FROM order_items oi
        LEFT JOIN products p ON p.id = oi.productId
        WHERE oi.orderId = ?
      `, [order.id]);
      
      return {
        id: order.id,
        userId: order.userId,
        userName: order.userName || "Guest User",
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        items: items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName || "Unknown Product",
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
          productImage: toPublicUploadPath(item.productImage)
        }))
      };
    })
  );
  
  return ordersWithItems;
}

module.exports = {
  getAllOrders
};
