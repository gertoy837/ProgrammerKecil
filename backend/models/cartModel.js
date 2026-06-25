const { ensureDatabaseReady, getPool } = require("../lib/db");
const { mapProductRow } = require("./productModel");

async function getCartForUser(userId) {
  await ensureDatabaseReady();
  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId)) {
    return { error: "Invalid user id", statusCode: 400 };
  }

  const pool = getPool();
  const [cartRows] = await pool.query(
    `SELECT id, userId
     FROM carts
     WHERE userId = ?
     LIMIT 1`,
    [numericUserId]
  );

  if (cartRows.length === 0) {
    return {
      cart: {
        id: null,
        userId: numericUserId,
        items: [],
        totalPrice: 0,
      },
    };
  }

  const cart = cartRows[0];
  const [items] = await pool.query(
    `SELECT ci.id, ci.productId, ci.quantity, p.name, p.price, p.stock, p.description, p.image, p.categoryId, c.name AS categoryName
     FROM cart_items ci
     JOIN products p ON p.id = ci.productId
     LEFT JOIN categories c ON c.id = p.categoryId
     WHERE ci.cartId = ?
     ORDER BY ci.id ASC`,
    [cart.id]
  );

  const mappedItems = items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: mapProductRow({
      id: item.productId,
      name: item.name,
      price: item.price,
      stock: item.stock,
      description: item.description,
      image: item.image,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      averageRating: null,
      reviewCount: 0,
    }),
    subtotal: item.price * item.quantity,
  }));

  return {
    cart: {
      id: cart.id,
      userId: cart.userId,
      items: mappedItems,
      totalPrice: mappedItems.reduce((total, item) => total + item.subtotal, 0),
    },
  };
}

async function addToCart({ userId, productId, quantity = 1 }) {
  await ensureDatabaseReady();
  const numericUserId = Number(userId);
  const numericProductId = Number(productId);
  const numericQuantity = Number(quantity);

  if (!Number.isInteger(numericUserId) || !Number.isInteger(numericProductId) || !Number.isInteger(numericQuantity) || numericQuantity < 1) {
    return { error: "Valid userId, productId, and quantity are required", statusCode: 400 };
  }

  const pool = getPool();
  const [users] = await pool.query("SELECT id FROM users WHERE id = ? LIMIT 1", [numericUserId]);
  const [products] = await pool.query("SELECT id FROM products WHERE id = ? LIMIT 1", [numericProductId]);

  if (users.length === 0) {
    return { error: "User not found", statusCode: 404 };
  }

  if (products.length === 0) {
    return { error: "Product not found", statusCode: 404 };
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [cartRows] = await connection.query(
      `SELECT id FROM carts WHERE userId = ? LIMIT 1 FOR UPDATE`,
      [numericUserId]
    );

    let cartId = cartRows.length > 0 ? cartRows[0].id : null;

    if (!cartId) {
      const [cartResult] = await connection.query(
        `INSERT INTO carts (userId) VALUES (?)`,
        [numericUserId]
      );
      cartId = cartResult.insertId;
    }

    const [existingItems] = await connection.query(
      `SELECT id, quantity FROM cart_items WHERE cartId = ? AND productId = ? LIMIT 1 FOR UPDATE`,
      [cartId, numericProductId]
    );

    if (existingItems.length > 0) {
      await connection.query(
        `UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`,
        [numericQuantity, existingItems[0].id]
      );
    } else {
      await connection.query(
        `INSERT INTO cart_items (cartId, productId, quantity) VALUES (?, ?, ?)`,
        [cartId, numericProductId, numericQuantity]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getCartForUser(numericUserId);
}

async function updateQuantity(cartItemId, quantity) {
  await ensureDatabaseReady();
  const numericId = Number(cartItemId);
  const numericQuantity = Number(quantity);

  if (!Number.isInteger(numericId) || !Number.isInteger(numericQuantity) || numericQuantity < 1) {
    return { error: "Valid cartItemId and quantity are required", statusCode: 400 };
  }

  const pool = getPool();
  try {
    const [result] = await pool.query(
      `UPDATE cart_items SET quantity = ? WHERE id = ?`,
      [numericQuantity, numericId]
    );
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    return { error: error.message, statusCode: 500 };
  }
}

async function updateQuantityForUser(userId, cartItemId, quantity) {
  await ensureDatabaseReady();
  const numericUserId = Number(userId);
  const numericId = Number(cartItemId);
  const numericQuantity = Number(quantity);

  if (!Number.isInteger(numericUserId) || !Number.isInteger(numericId) || !Number.isInteger(numericQuantity) || numericQuantity < 1) {
    return { error: "Valid userId, cartItemId and quantity are required", statusCode: 400 };
  }

  const pool = getPool();

  try {
    const [result] = await pool.query(
      `UPDATE cart_items ci
       JOIN carts c ON c.id = ci.cartId
       SET ci.quantity = ?
       WHERE ci.id = ? AND c.userId = ?`,
      [numericQuantity, numericId, numericUserId]
    );

    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    return { error: error.message, statusCode: 500 };
  }
}

async function deleteItem(cartItemId) {
  await ensureDatabaseReady();
  const numericId = Number(cartItemId);

  if (!Number.isInteger(numericId)) {
    return { error: "Invalid cart item id", statusCode: 400 };
  }

  const pool = getPool();
  try {
    const [result] = await pool.query(
      `DELETE FROM cart_items WHERE id = ?`,
      [numericId]
    );
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    return { error: error.message, statusCode: 500 };
  }
}

async function deleteItemForUser(userId, cartItemId) {
  await ensureDatabaseReady();
  const numericUserId = Number(userId);
  const numericId = Number(cartItemId);

  if (!Number.isInteger(numericUserId) || !Number.isInteger(numericId)) {
    return { error: "Valid userId and cart item id are required", statusCode: 400 };
  }

  const pool = getPool();

  try {
    const [result] = await pool.query(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON c.id = ci.cartId
       WHERE ci.id = ? AND c.userId = ?`,
      [numericId, numericUserId]
    );

    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    return { error: error.message, statusCode: 500 };
  }
}

async function clearCart(userId) {
  await ensureDatabaseReady();
  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId)) {
    return { error: "Invalid user id", statusCode: 400 };
  }

  const pool = getPool();
  try {
    const [cartRows] = await pool.query(`SELECT id FROM carts WHERE userId = ? LIMIT 1`, [numericUserId]);
    
    if (cartRows.length === 0) {
      return { error: "Cart not found", statusCode: 404 };
    }

    const [result] = await pool.query(`DELETE FROM cart_items WHERE cartId = ?`, [cartRows[0].id]);
    return { success: true, affectedRows: result.affectedRows };
  } catch (error) {
    return { error: error.message, statusCode: 500 };
  }
}

async function checkoutCart(userId) {
  await ensureDatabaseReady();
  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId)) {
    return { error: "Invalid user id", statusCode: 400 };
  }

  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [cartRows] = await connection.query(
      `SELECT id FROM carts WHERE userId = ? LIMIT 1 FOR UPDATE`,
      [numericUserId]
    );

    if (cartRows.length === 0) {
      await connection.rollback();
      return { error: "Cart is empty", statusCode: 400 };
    }

    const cartId = cartRows[0].id;

    const [items] = await connection.query(
      `SELECT ci.productId, ci.quantity, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.productId
       WHERE ci.cartId = ?
       FOR UPDATE`,
      [cartId]
    );

    if (items.length === 0) {
      await connection.rollback();
      return { error: "Cart is empty", statusCode: 400 };
    }

    const insufficientStock = items.find((item) => item.quantity > item.stock);

    if (insufficientStock) {
      await connection.rollback();
      return {
        error: `Insufficient stock for product ${insufficientStock.productId}`,
        statusCode: 400,
      };
    }

    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const [orderResult] = await connection.query(
      `INSERT INTO orders (userId, totalPrice) VALUES (?, ?)`,
      [numericUserId, totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const [stockUpdateResult] = await connection.query(
        `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        [item.quantity, item.productId, item.quantity]
      );

      if (stockUpdateResult.affectedRows === 0) {
        await connection.rollback();
        return {
          error: `Insufficient stock for product ${item.productId}`,
          statusCode: 400,
        };
      }

      await connection.query(
        `INSERT INTO order_items (orderId, productId, quantity, priceAtPurchase)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await connection.query(`DELETE FROM cart_items WHERE cartId = ?`, [cartId]);

    const [orderRows] = await connection.query(
      `SELECT id, userId, totalPrice, createdAt FROM orders WHERE id = ? LIMIT 1`,
      [orderId]
    );

    await connection.commit();

    return {
      order: {
        id: orderRows[0].id,
        userId: orderRows[0].userId,
        totalPrice: orderRows[0].totalPrice,
        createdAt: orderRows[0].createdAt,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
          subtotal: item.price * item.quantity,
        })),
      },
    };
  } catch (error) {
    await connection.rollback();
    return { error: error.message, statusCode: 500 };
  } finally {
    connection.release();
  }
}

module.exports = {
  addToCart,
  getCartForUser,
  updateQuantity, 
  updateQuantityForUser,
  deleteItem, 
  deleteItemForUser,
  clearCart,
  checkoutCart,
};
