require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require("./routes/orders");

const app = express();

// 🟢 Middlewares (primero)
app.use(cors()); // habilita CORS
app.use(express.json()); // parsea JSON en body
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🟢 Rutas (después)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/orders', orderRoutes); // moved after middleware

// 🔊 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
