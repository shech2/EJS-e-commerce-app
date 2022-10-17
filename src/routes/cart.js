const router = require("express").Router();
const CartController = require("../controllers/cart");
const authmw = require("../middleware/authMiddleware");

router.post('/add-to-cart', authmw.authMiddleware , CartController.addItemToCart);

router.post('/remove-from-cart', authmw.authMiddleware , CartController.RemoveFromCart);


module.exports = router;
