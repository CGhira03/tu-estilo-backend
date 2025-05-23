// backend/controllers/orderController.js
const db = require('../config/db');

exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { products } = req.body;
    const userId = req.user.id;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No hay productos en la orden" });
    }

    let total = 0;

    await connection.beginTransaction();

    for (const item of products) {
      const [productRows] = await connection.query('SELECT * FROM products WHERE id = ?', [item.productId]);
      const product = productRows[0];

      if (!product) {
        await connection.rollback();
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      if (product.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ message: `Stock insuficiente para ${product.nombre}` });
      }

      total += product.precio * item.quantity;

      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (userId, total, status) VALUES (?, ?, ?)',
      [userId, total, 'pendiente']
    );

    const orderId = orderResult.insertId;

    // Insertar detalles de la orden
    for (const item of products) {
      await connection.query(
        'INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)',
        [orderId, item.productId, item.quantity]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Orden creada", orderId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Error al crear la orden" });
  } finally {
    connection.release();
  }
};
