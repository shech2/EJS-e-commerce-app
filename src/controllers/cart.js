const CartController = require('../models/cart');
const OrderController = require('../models/order');
const product = require('../models/Product');

// This is your test secret API key.
const stripe = require("stripe")('sk_test_51M1TVWH8e0iQz01ZXwnTrube3wnQ9P1e98dTjCEwFK8Xx8YHKNeR9YOiEOj1bGVPPQybmWpMFra44dzjmMwH4nob00NDoAE71e');


// Add item to cart
exports.addItemToCart = async (req, res) => {
    const POSTProduct = await product.findById(req.body.productId);

    CartController.findOne({ user: req.user.id }).exec((error, cart) => {
        if (error) return res.status(400).json({ error });

        if (cart) { // if cart already exists // if cartItem does not exist
            const product = POSTProduct;

            const item = cart.cartItems.find(c => c.product == product.id && c.size == req.body.size);
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
    const size = req.body.size;


    CartController.findOneAndUpdate(
        { user: req.user.id },
        {
            $pull: {
                cartItems: {
                    product: productId,
                    size
                },
            },
        }
    ).exec((error, _cart) => {
        if (error) return res.status(400).json({ error });
        if (_cart) {
            return res.redirect("/cart");
        }
    });

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
    const size = req.body.size;

    const productPOST = await product.findById(productId);

    if (quantity > 0) {
        if (product) {
            CartController.findOneAndUpdate(
                { user: req.user.id, "cartItems.product": productPOST.id, "cartItems.size": size },
                {
                    $set: {
                        "cartItems.$": {
                            product: productPOST.id,
                            quantity: quantity,
                            price: productPOST.price,
                            brand: productPOST.brand,
                            size: size,
                        },
                    },
                }
            ).exec((error, _cart) => {
                if (error) return res.status(400).json({ error });
                if (_cart) {
                    res.status(201).json({ _cart });
                }
            });
        }
    } else {
        return res.status(400).json({ error: "Quantity cannot be less than 1" });
    }
};

// Add size to an Item in the cart
exports.addSizeToCart = async (req, res) => {
    const POSTProduct = await product.findById(req.body.productId);
    const quantity = req.body.quantity;
    const size = req.body.size;
    if (size == "Select Size") {
        return res.status(500).json({ message: "Error! choose size" });
    }
    product.findOneAndUpdate({ _id: POSTProduct.id }, {
        $set: {
            "size.size": size
        }
    }).exec();

    CartController.findOne({ user: req.user.id }).exec((error, cart) => {
        if (error) return res.status(400).json({ error });
        if (cart) { // if cart already exists // if cartItem does not exist
            const product = POSTProduct;

            let exist = false;
            for (let i = 0; i < cart.cartItems.length; i++) {
                if (cart.cartItems[i].product.toString() == product.id.toString() && cart.cartItems[i].size == size) {
                    exist = true;
                    cart.cartItems[i].quantity += 1;
                    break;
                }
            }
            exist
                ? cart.save()
                : cart
                    .updateOne({
                        $push: {
                            cartItems: {
                                product: product.id,
                                quantity: quantity,
                                price: product.price,
                                brand: product.brand,
                                size: size,
                            },
                        },
                    })
                    .exec(() => res.status(201).json({ cart }));

        } else {
            console.log('no cart found')
        }
    })
}

exports.updateSizeArray = async (req, res) => {
    // get user cart
    const cart = await CartController.findOne({ user: req.user.id }).populate('cartItems.product', '_id name price brand quantity size').exec();
    // for each item in cart call update function
    cart.cartItems.forEach(async (item) => {
        const sizeCart = item.product.size.size;
        item.product.size.sizeArray = item.product.size.sizeArray.filter((item) => item != sizeCart);
        product.findOneAndUpdate({ _id: item.product._id }, {
            $set: {
                "size.sizeArray": item.product.size.sizeArray
            }
        }).exec();
    });
    res.status(200).json({ cart });
}



exports.checkout = async (req, res) => {
    const cart = await CartController.findOne({ user: req.user.id }).populate('cartItems.product', '_id name price brand quantity size').exec();
    // get user order
    const order = await OrderController.findOne({ user: req.user.id }).populate({ path: "orderItems", populate: { path: "product" } }).exec();


    let products = [];
    let totalAmount = 0;
    let tax = 0.17;
    cart.cartItems.forEach((item) => {
        products.push({
            product: item.product._id,
            quantity: item.quantity,
            price: item.price,
            brand: item.brand,
            size: item.size,
        });
        totalAmount = totalAmount + item.product.price * item.quantity;
    });
    totalAmount = totalAmount + totalAmount * tax;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(totalAmount),
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
        customer: {
            name: req.user.username,
            email: req.user.email,
        },
        recipt_email: req.user.email,

    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
};

