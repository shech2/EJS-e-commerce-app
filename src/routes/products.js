const router = require("express").Router();
const Product = require("../models/Product");
const Category = require("../models/category");
const category = require("../models/category");
const mongoose = require("mongoose");

router.get("/products", async (req, res) => {
    let filter = {};

    if (req.query.category) {
        filter = { category: req.query.categories.split(",") }
    }


    const productList = await Product.find(filter).populate('category'); // filter array of categories

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList);
})

router.get("/products/:id", async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
})

//Create a new product
router.post("/create_product", async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    const product = new Product({
        Product_name: req.body.Product_Name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        size: {size: req.body.size , sizeArray: req.body.sizeArray},
        brand: req.body.brand,
        quantity: req.body.quantity,
        rating: req.body.rating,
        image: req.body.image,
    });


    product.save().then((createdProduct => {
        res.status(201).json(createdProduct);
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    });
});

// update product in admin panel
router.put("/update/:id", async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send("Invalid Product Id");
    }
    var product2 = await Product.findById(req.params.id);

    if(req.body.Product_name){

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
        $set:{
            Product_name: req.body.Product_name,
            price: product2.price,
            description: product2.description,
            category: product2.category,
            size: {size : product2.size , sizeArray: product2.sizeArray},
            brand: product2.brand,
            quantity: product2.quantity,
            rating: product2.rating,
            image: product2.image,
            }
        },
        { new: true }
    );
        product2 = product; 
    }

    res.send(product2);
});



//update product
router.put("/products/:id", async (req, res) => {
    //validate id check
    if (mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send("Invalid Product Id");
    }
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            Product_name: req.body.Product_Name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            size: { size: req.body.size , sizeArray: req.body.sizeArray},
            brand: req.body.brand,
            quantity: req.body.quantity,
            rating: req.body.rating,
            image: req.body.image,
        },
        { new: true }
    );

    if (!product) {
        return res.status(500).send("The product cannot be updated");
    }
    res.send(product);
});

//Delete product
router.delete("/products/:id", (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: "the product is deleted!" })
        } else {
            return res.status(404).json({ success: false, message: "product not found!" })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

router.get("/get/count", async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);

    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount: productCount
    });
})

module.exports = router;