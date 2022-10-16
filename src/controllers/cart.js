const CartController = require('../models/cart');

exports.addItemToCart = (req, res) => {

    CartController.findOne({ user: req.cookies.user }).exec((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) {
            // if cart already exists then update cart by quantity
            const product = req.body.cartItems.product;
            const item = cart.cartItems.find(c => c.product == product);
            let condition, update;
            if (item) {
                condition = { "user": req.cookies.user, "cartItems.product": product };
                update = {
                    "$set": {
                        "cartItems.$": {
                            ...req.body.cartItems,
                            quantity: item.quantity + req.body.cartItems.quantity
                        }
                    }
                };
            } else {
                condition = { user: req.cookies.user };
                update = {
                    "$push": {
                        "cartItems": req.body.cartItems
                    }
                };
            }
            CartController.findOneAndUpdate(condition, update).exec((error, _cart) => {
                if (error) return res.status(400).json({ error });
                if (_cart) {
                    return res.status(201).json({ cart: _cart });
                }
            });
        }
    });

}



