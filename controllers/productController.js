const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


exports.getOne = async (req, res) => {
  const [[row]] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  res.json(row);
};

exports.create = async (req, res) => {
  const { name, description, price, category, sizes } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  await db.query('INSERT INTO products (name, description, price, category, sizes, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, category, sizes, imageUrl]);
  res.status(201).json({ message: 'Producto creado' });
};

exports.update = async (req, res) => {
  const { name, description, price, category, sizes } = req.body;
  await db.query('UPDATE products SET name=?, description=?, price=?, category=?, sizes=? WHERE id=?',
    [name, description, price, category, sizes, req.params.id]);
  res.json({ message: 'Producto actualizado' });
};

exports.remove = async (req, res) => {
  await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ message: 'Producto eliminado' });
};