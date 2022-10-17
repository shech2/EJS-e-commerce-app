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
                CartController.findOne({ user: req.user.id}).exec((error, cart) => {
                    if(error) res.status(400).json({error});
                    if(cart){
                        const item2 = CartController.findOneAndUpdate({ user: req.user.id , "cartItems.product" : product }, {
                            "$set": {
                                "cartItems.$": {
                                    product: POSTProduct.id,
                                    quantity: POSTProduct.quantity + item.quantity,
                                    price: POSTProduct.price
                                }
                            }
                        }).exec((error, _cart) => {
                            if(error) res.status(400).json({error});
                            if(_cart){
                                res.status(201).json({ cart: _cart });
                            }
                        })
                    }
                });
            }
                    else {
                        cart.updateOne({
                            $push: {
                                cartItems: {
                                    product: product.id,
                                    quantity: product.quantity,
                                    price: product.price
                                }
                            }
                        }).exec((error, _cart) => {
                            if (error) return res.status(400).json({ error });
                            if (_cart) {
                                return res.status(201).json({ cart: _cart });
                            }
                        })
                    }
                }
            })
        }

exports.getCart = async (req, res) => {
    const Cart = CartController.find({user: req.user.id}).exec((error, cart) => {
        if(cart){
            
        }
    })
}