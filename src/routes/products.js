const router = require("express").Router();
const Product = require("../models/Product");


router.get("/products", async (req, res) => {   
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({success: false})
    }
    res.send(productList);
})

router.post("/create_product", (req,res) => {
    const product = new Product({
        Product_name: req.body.nameProduct,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        image: req.body.image,
    })

    product.save().then((createdProduct => {
        res.status(201).json(createdProduct);
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
});

module.exports = router;