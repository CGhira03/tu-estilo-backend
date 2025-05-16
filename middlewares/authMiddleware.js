const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Separar "Bearer <token>"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token inválido:', err.message);
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    console.log('Token decodificado:', decoded); // ✅ Verifica que incluya `role`
    req.user = decoded; // aseguramos que contenga id, role, etc.
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAdmin
};
