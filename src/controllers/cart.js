const CartController = require('../models/cart');
const product = require('../models/Product');


// Add item to cart
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
                }).exec((error, cart) => {
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
                }).exec((error, cart) => {
                    if (error) return res.status(400).json({ error });
                    if (cart) {
                        res.status(201).json({ cart });
                    }
                })
            }
        }
    })
}


// Remove item from cart
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

// Remove all items from cart
exports.removeAll = async (req, res) => {
    if (product) {
        CartController.findOneAndUpdate({ user: req.user.id }, {
            $unset: {
                "cartItems": ""
            }, multi: true
        }).exec((error, _cart) => {
            if (error) return res.status(400).json({ error });
            if (_cart) {
                res.status(201).json({ _cart });
            }
        })
    }
}


// Update quantity of item in cart
exports.updateQuantity = async (req, res) => {
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const productPOST = await product.findById(productId);
    if(quantity > 0){
    if (product) {
        CartController.findOneAndUpdate({ user: req.user.id, "cartItems.product": productPOST.id }, {
            "$set": {
                "cartItems.$": {
                    product: productPOST.id,
                    quantity: quantity,
                    price: productPOST.price,
                    brand: productPOST.brand
                }
            }
        }).exec((error, _cart) => {
            if (error) return res.status(400).json({ error });
            if (_cart) {
                res.status(201).json({ _cart });
            }
        })
    }
}else{
    return res.status(400).json({ error: 'Quantity cannot be less than 1' });

}
}


// Add size to an Item in the cart
exports.addSizeToCart = async (req, res) => {
    const productId = req.body.productId;
    const size = req.body.size;
    const quantity = req.body.quantity;
    const productPOST = await product.findById(productId);
    if (product) {
           CartController.findOneAndUpdate({ user: req.user.id},
            {$set : {'cartItems.$[elem].product.quantity': quantity}},
            {arrayFilters: [{'elem._id': productPOST.id}]}).populate('cartItems.product').exec(
                (error, _cart) => {
                    if (error) return res.status(400).json({ error });
                    if (_cart) {
                        console.log(_cart);
                        res.status(201).json({ _cart });
                    }
                })
    }
}

