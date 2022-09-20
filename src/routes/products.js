const router = require("express").Router();
const Product = require("../models/Product");
const Category = require("../models/category");

router.get("/products", async (req, res) => {   
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({success: false})
    }
    res.send(productList);
})


router.post("/create_product", async (req,res) => {
    const category = await Category.findById(req.body.category);

    if(!category) return res.status(400).send("Invalid Category");

    const product = new Product({
        Product_name: req.body.Product_Name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        image: req.body.image,
    });

    console.log(product);

    product.save().then((createdProduct => {
        res.redirect("/shop");
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
});

module.exports = router;