const router = require("express").Router();
const Cart = require("../models/cart");
const product = require("../models/Product");

//create cart

router.post("/add-to-cart", async (req, res) => {
    const AddedProduct = await product.findById(req.body.productId);
    if (!AddedProduct) return res.status(400).send("Product not found");

    Cart.save(AddedProduct);
    console.log(Cart.getCart());
});

module.exports = router;
