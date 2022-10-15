const CartController = require('../models/cart');

exports.addItemToCart = (req, res) => {

    CartController.findOne({ user: req.cookies.user })
        .exec((error, cart) => {
            if (error) return console.log(error);
            if (cart) {
                if (cart.cartItems) {   // if cart already exists then update cart by quantity

                        const product = req.body.productId;
                        const item = cart.cartItems.find(c => c.product == product) // find the product in the cart

                    if (item) {
                        CartController.findOneAndUpdate({ "user": req.cookies.user, "cartItems.product": product }, {
                            "$set": {
                                "cartItems": {
                                    quantity: item.quantity + 1
                                }
                            }
                        })

                            .exec((error, _cart) => {
                                if (error) return console.log(error);
                                if (_cart) {
                                    return console.log(res.status(201).json({ cart: _cart }));
                                }
                            })

                    } else {
                        const product = req.body.productId
                        CartController.findOneAndUpdate({ user: req.cookies.user }, {
                            "$push": {
                                "cartItems": {product}
                            }
                        })

                            .exec((error, _cart) => {
                                if (error) return console.log(error);
                                if (_cart) {
                                    return console.log(res.status(201).json({ cart: _cart }));
                                }
                            })
                    }
                }
            }
       })
}



