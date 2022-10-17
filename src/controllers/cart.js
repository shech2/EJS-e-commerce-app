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
                        console.log(item2);
                        console.log(cart.cartItems[0].product);
                        if(cart.cartItems[0].product == product.id){
                            console.log("true");
                        }else{
                            console.log("false");
                        }
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

// exports.getCart = async (req, res) => {
//     CartController.findOne({ user: req.user }).exec((error, cart) => {
//         if (error) return res.status(400).json({ error });
//         if (cart) {
//             let cartItems = {};
//             cart.cartItems.forEach((item, index) => {
//                 cartItems[item.product] = item;
//             });
//             res.status(200).json({ cartItems });
//         }
//     });
// }