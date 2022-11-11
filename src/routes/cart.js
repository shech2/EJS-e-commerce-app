const router = require("express").Router();
const CartController = require("../controllers/cart");
const authmw = require("../middleware/authMiddleware");

router.post('/add-to-cart', authmw.authMiddleware, CartController.addItemToCart);

router.post('/remove-from-cart', authmw.authMiddleware, CartController.RemoveFromCart);

router.post('/remove-all', authmw.authMiddleware, CartController.removeAll);

router.post('/update-cart', authmw.authMiddleware, CartController.updateQuantity);

router.post('/add-size-to-cart', authmw.authMiddleware, CartController.addSizeToCart);

router.post('/update-size-array', authmw.authMiddleware, CartController.updateSizeArray);

router.post('/checkout', authmw.authMiddleware, CartController.checkout);


module.exports = router;
