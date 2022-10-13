const router = require("express").Router();
const {addItemToCart} = require("../controllers/cart");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/add-to-cart', authMiddleware, addItemToCart);

module.exports = router;
