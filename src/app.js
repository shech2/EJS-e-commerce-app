// Express app initialization
const express = require('express');
const app = express();


// SOCKET IO
const ws = require('ws');
const wss = new ws.WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
    console.log("Client" + ws.listeners() + " Connected to Server on PORT : 3001");
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('Welcome to the M.Y.S.O');
});


// COOKIES:
const cookieparser = require('cookie-parser');
app.use(cookieparser());


// Layouts:
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', "./layouts/full-width");


// Middleware:
const authmw = require('./middleware/authMiddleWare');
const pgMiddleware = require('./middleware/paginationMiddleWare');
const bp = require('body-parser');
const morgan = require("morgan");
app.use(morgan('tiny'));


// Models:
const ProductModel = require("./models/Product");
const Brand = require("./models/brand");
const Order = require("./models/order");
const Cart = require("./models/cart");
const User = require("./models/User");
const Category = require("./models/category");


// Routers:
const cartRouter = require('./routes/cart');
const authRouter = require("./routes/auth");
const ProductRouter = require("./routes/products");
const userRouters = require("./routes/users");
const orderRouters = require("./routes/orders");
const categoryRouters = require("./routes/categories");
const brandRouters = require("./routes/brand");


// DOTENV:
const dotenv = require("dotenv");
dotenv.config();


// EXPRESS:
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bp.urlencoded({ extended: false, limit: '50mb' }));
app.use(bp.json());


// Mongo DB Connection:
const mongoose = require('mongoose'); // adds MongoDB to the Project
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfully!"))
    .catch((err) => {
        console.log(err);
    });


// Session + Flash:
const express_session = require("express-session");
const flash = require("connect-flash");
app.use(express_session({
    secret: process.env.SESSION_SEC,
    cookie: { maxAge: 6000 },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());


// Passport:
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());


// EJS + Views:
app.use(express.static("public"));
app.use('/css', express.static(__dirname + "public"));
app.use('/images', express.static(__dirname + "public"));
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');



// GET for login,signup and logout:
app.get('/login', (req, res) => {
    const error = req.flash('error'); // flash errors
    res.render('./pages/login.ejs', { error, title: "Login", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/style-login.css", user: req.cookies.user });
});


app.get('/register', (req, res) => {
    const error = req.flash('error'); // flash errors
    res.render('./pages/register.ejs', { error, title: "Register", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/register.css", user: req.cookies.user });
});


// LOGOUT:
app.get('/logout', authRouter); // no need to create a new route for logout, just use the authRouter


// GET THE PRODUCTS AT THE HOMEPAGE
app.get('/homepage', (req, res) => {
    var updatedItems = [];
    ProductModel.find({}, async function (err, items) {
        if (err) { console.log(err); }
        if (req.query.search) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].category.name == req.query.search) {
                    updatedItems.push(items[i]);
                }
            }
            res.render('./pages/homePage.ejs', { title: "Home-Page", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/homepage.css", user: req.cookies.user, ProductModel: updatedItems });
        } else {

            ProductModel.find({}, async function (err, products) {
                if (err) { console.log(err); }
                Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
                    if (err) { console.log(err); }
                    res.render('./pages/homePage.ejs', { title: "Home-Page", ProductModel: products, headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/homepage.css", user: req.cookies.user, Cart: cart });
                }).populate({
                    path: 'cartItems.product',
                    populate: ([
                        { path: 'category' },
                        { path: 'brand' }
                    ]) // Multiple populate populate([{},{}]) --> this is the syntax .
                });
            });
        }
    }).populate('category').populate('brand');
});


// GET SHOP:
app.get('/shop', pgMiddleware.paginatedResults(ProductModel), (req, res) => { // pgMiddleware.paginatedResults(ProductModel) --> this is the middleware
    var updatedItems =
    {
        results: [

        ]
    };
    ProductModel.find({}, async function (err, items) {
        if (err) { console.log(err); }
        if (req.query.search) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].category.name == req.query.search) {
                    updatedItems.results.push(items[i]);
                }
            }
            console.log(updatedItems);
            Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
                if (err) { console.log(err); }
                res.render('./pages/shop.ejs', { title: "Shop", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/shop.css", user: req.cookies.user, ProductModel: updatedItems, Cart: cart });
            }).populate({
                path: 'cartItems.product',
                populate: ([
                    { path: 'category' },
                    { path: 'brand' }
                ]) // Multiple populate populate([{},{}]) --> this is the syntax .
            });

        } else {

            ProductModel.find({}, async function (err, products) {
                if (err) { console.log(err); }
                Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
                    if (err) { console.log(err); }
                    res.render('./pages/shop.ejs', { title: "Shop", ProductModel: res.paginatedResults, headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/shop.css", user: req.cookies.user, Cart: cart });

                }).populate({
                    path: 'cartItems.product',
                    populate: ([
                        { path: 'category' },
                        { path: 'brand' }
                    ]) // Multiple populate populate([{},{}]) --> this is the syntax .
                });
            });
        }
    }).populate('category').populate('brand');

});


// GET ABOUT:
app.get('/about', (req, res) => {
    Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
        if (err) { console.log(err); }
        res.render('./pages/about.ejs', { title: "About", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/about.css", user: req.cookies.user, Cart: cart });
    });
});


// GET Product-page:
app.get('/product-page', (req, res) => {
    ProductModel.find({}, async function (err, products) {
        if (err) {
            console.log(err);
        }
        Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
            if (err) { console.log(err); }
            ProductModel.findOne({ _id: req.query.id }, async function (err, product) {
                res.render('./pages/product-page.ejs', { title: "Product-Page", headercss: "/css/header.css", footercss: "/css/footer.css", ProductModel: product, ProductModels: products, cssfile: "/css/product-page.css", user: req.cookies.user, Cart: cart });
            });
        });
    }).populate('category').populate('brand');
});


// GET Admin page:
app.get('/admin', authmw.authAdmin, (req, res) => { // authmw.authAdmin --> this is the middleware
    User.find({}, async function (err, users) {
        if (err) {
            console.log(err);
        } else {
            Cart.findOne({ user: req.user.id }, async function (err, cart) {
                if (err) {
                    console.log(err);
                }
                ProductModel.find({}, async function (err, products) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(products);
                    Order.find({}, async function (err, orders) {
                        if (err) {
                            console.log(err);
                        }
                        res.render('./pages/admin.ejs', { title: "Admin page", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/admin.css", users: users, user: req.cookies.user, Cart: cart, Products: products, Orders: orders });
                    }).populate({ path: 'orderItems', populate: { path: 'product' } }).populate('user');
                }).populate('category').populate('brand').populate('size');
            })
        }
    })
});


// GET Create-Product page:
app.get('/create-product', authmw.authAdmin, (req, res) => {
    Cart.findOne({ user: req.user.id }, async function (err, cart) {
        if (err) {
            console.log(err);
        }
        Category.find({}, async function (err, categories) {
            if (err) {
                console.log(err);
            }
            Brand.find({}, async function (err, brands) {
                if (err) {
                    console.log(err);
                }
                res.render('./pages/createProduct.ejs', { title: "Create Product", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/full-width.css", user: req.cookies.user, Cart: cart, category: categories, brand: brands });
            });
        });
    });
});


// GET Checkout page:
app.get('/checkout', authmw.authMiddleware, (req, res) => {
    Cart.findOne({ user: req.cookies.user }, function (err, cart) {
        if (err) { console.log(err); }
        if (cart) {
            res.render('./pages/checkout.ejs', { title: "Checkout", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/checkout.css", user: req.cookies.user, total: req.query.total, Cart: cart, cartItems: cart.cartItems });
        }
    }).populate({
        path: 'cartItems.product',
        populate: ([
            { path: 'category' },
            { path: 'brand' }
        ]) // Multiple populate populate([{},{}]) --> this is the syntax .
    });
});


// GET Cart page:
app.get('/cart', (req, res) => {
    Cart.findOne({ user: req.cookies.user }, (err, cart) => {
        if (err) {
            console.log(err);
        }
        res.render('./pages/cart.ejs', {title: "Cart", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/cart.css", user: req.cookies.user, cartItems: cart.cartItems, Cart: cart });
    }
    ).populate({ path: 'cartItems.product', populate: { path: 'brand' } });
});


// GET User Profile Page:
app.get('/profile', authmw.authMiddleware, (req, res) => {
    Order.find({ user: req.user.id }, async function (err, orders) {
        if (err) {
            console.log(err);
        }
        Cart.findOne({ user: req.cookies.user }, async function (err, cart) {
            if (err) { console.log(err); }
            res.render('./pages/profile.ejs', { title: "Profile", headercss: "/css/header.css", footercss: "/css/footer.css", cssfile: "/css/profile.css", user: req.cookies.user, orders: orders, Cart: cart });
        });
    });
});


// POST for login and signup:
app.post('/register', authRouter);
app.post('/login', authRouter);


// ROUTES:
app.use("/api/", ProductRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouters);
app.use("/api/", categoryRouters);
app.use("/api/", brandRouters);
app.use("/", orderRouters);
app.use("/", cartRouter);


// Server Connection:
app.listen(3000, () => console.log(`Example app listening on port 3000!`));


