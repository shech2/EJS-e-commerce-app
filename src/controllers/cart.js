const { response } = require('express');
const CartController = require('../models/cart');
const product = require('../models/Product');

exports.addItemToCart = async (req, res) => {
    const POSTProduct = await product.findById(req.body.productId);


    CartController.findOne({ user: req.user.id }).exec((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) { // if cart already exists // if cartItem does not exist
            const product = POSTProduct;
            const item = cart.cartItems.find(c => c.product == product.id);
            if (item) {
                CartController.findOneAndUpdate({ user: req.user.id, "cartItems.product": product }, {
                    "$set": {
                        "cartItems.$": {
                            product: POSTProduct.id,
                            quantity: POSTProduct.quantity + item.quantity,
                            price: POSTProduct.price,
                            brand: POSTProduct.brand
                        }
                    }
                }).exec((error,cart) => {
                    if (error) res.status(400).json({ error });
                    if (cart) {
                    res.status(201).json({ cart });
                    }
                });
            }
            else {
                cart.updateOne({
                    $push: {
                        cartItems: {
                            product: product.id,
                            quantity: product.quantity,
                            price: product.price,
                            brand: product.brand
                        }
                    }
                }).exec((error,cart) => {
                    if (error) return res.status(400).json({ error });
                    if (cart) {
                    res.status(201).json({ cart });
                    }
                })
            }
        }
    })
}

exports.RemoveFromCart = async (req, res) => {
    const productId = req.body.productId;
    const productPOST = await product.findById(productId);
    if (product) {
        CartController.findOneAndUpdate({ user: req.user.id }, {
            $pull: {
                cartItems: {
                    product: productPOST.id
                }
            }
        }).exec((error, _cart) => {
            if (error) return res.status(400).json({ error });
            if (_cart) {
                return res.redirect('/cart');
            }
        })
    }
}