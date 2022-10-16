const CartController = require('../models/cart');
const product = require('../models/Product');

exports.addItemToCart = async (req, res) => {
    const POSTProduct = await product.findById(req.body.productId);


    CartController.findOne({ user: req.user.id }).exec((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) { // if cart already exists // if cartItem does not exist
            const product = cart.cartItems.find(c => c.product == POSTProduct.id);
            if (product) {
                console.log("product already exists in cart");
                console.log(product);
                cart.updateOne({
                    "product" : req.body.productId
                },
                { $set : {
                    cartItems: {
                        quantity: product.quantity + 1
                    }
                }
                
                }).exec((error,_cart) => {
                    if (error) return res.status(400).json({ error });
                    if(_cart){
                        return res.status(201).json({ cart: _cart});
                    }
                })
            } else {
                cart.updateOne({
                    $push: {
                        cartItems: {
                            product: POSTProduct._id,
                            quantity: POSTProduct.quantity,
                            price: POSTProduct.price
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