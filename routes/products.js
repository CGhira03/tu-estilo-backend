const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); // el middleware que sube imágenes
const productController = require('../controllers/productController');
const { verifyToken } = require('../middlewares/authMiddleware'); // protege rutas

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);

router.post('/', verifyToken, upload.single('image'), productController.create);
router.put('/:id', verifyToken, upload.single('image'), productController.update);
router.delete('/:id', verifyToken, productController.remove);

module.exports = router;
