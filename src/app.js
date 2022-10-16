const express = require('express');
const app = express();
const mongoose = require('mongoose'); // adds MongoDB to the Project
const dotenv = require("dotenv");
const express_session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require('express-ejs-layouts');
const Cart = require("./models/cart");
const passport = require("passport");
var parr = [];

// COOKIES:
const cookieparser = require('cookie-parser');
app.use(cookieparser());


//Layouts:
app.use(expressLayouts);
app.set('layout', "./layouts/full-width");


//middleware:
const authmw = require('./middleware/authMiddleWare');
const bp = require('body-parser');
const morgan = require("morgan");
app.use(morgan('tiny'));

//Routers:
const cartRouter = require('./routes/cart');
const authRouter = require("./routes/auth");
const ProductRouter = require("./routes/products");
const userRouters = require("./routes/users");
const orderRouters = require("./routes/orders");
const categoryRouters = require("./routes/categories");
const ProductModel = require("./models/Product");
const { $where } = require('./models/User');

// DOTENV:
dotenv.config();

// EXPRESS:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

// Mongo DB Connection:
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfully!"))
    .catch((err) => {
        console.log(err);
    });

// Product MODEL:
ProductModel.find({}, async function (err, products) {
    if (err) {
        console.log(err);
    }
    parr = products;
});

// session + flash:
app.use(express_session({
    secret: process.env.SESSION_SEC,
    cookie: { maxAge: 6000 },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Passport:
app.use(passport.initialize());
app.use(passport.session());

// EJS:
app.use(express.static("public"));
app.use('/css', express.static(__dirname + "public"));
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

// GET for login,signup and logout:

app.get('/login', (req, res) => {
    const error = req.flash('error');
    res.render('./pages/login.ejs', { error, title: "Login", cssfile: "/css/style-login.css", username: req.cookies.username});
});

app.get('/register', (req, res) => {
    const error = req.flash('error');
    res.render('./pages/register.ejs', { error, title: "Register", cssfile: "/css/register.css",username: req.cookies.username});
});

app.get('/homepage', (req,res) => {
    res.render('./pages/homePage.ejs', { title: "Home-Page", cssfile: "/css/homepage.css",username: req.cookies.username });
});

// LOGOUT:
app.get('/logout', authRouter);

// GET SHOP:
app.get('/shop', (req, res) => {
    res.render('./pages/shop.ejs', { title: "Shop", ProductModel: parr, cssfile: "/css/shop.css", username: req.cookies.username});
});

// GET ABOUT:
app.get('/about', (req, res) => {
    res.render('./pages/About.ejs', { title: "About", cssfile: "/css/about.css", username: req.cookies.username });
});

//Product-page:
app.get('/product-page', (req, res) => {
    res.render('./pages/product-page.ejs', { title: "Product-Page", ProductModel: parr, cssfile: "/css/full-width.css", username: req.cookies.username });
});

// Admin page:
app.get('/admin', authmw.authAdmin, (req, res) => {
    res.render('./pages/admin.ejs', { title: "Admin page", cssfile: "/css/full-width.css", username: req.cookies.username });
});

// Create-Product page:
app.get('/create-product', authmw.authAdmin, (req, res) => {
    res.render('./pages/CreateProduct.ejs', { title: "Create Product", cssfile: "/css/full-width.css", username: req.cookies.username});
});
// Cart page:
app.get('/cart2', authmw.authAdmin, (req, res) => {
    res.render('./pages/cart2.ejs', { title: "Cart", cssfile: "/css/cart.css", username: req.cookies.username });
});

// POST for login and signup:
app.post('/register', authRouter);
app.post('/login', authRouter);

// Main Route:
app.get('/', (req, res) => res.render('index'));

// ROUTES:
app.use("/api/", ProductRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouters);
app.use("/api/categories", categoryRouters);
app.use("/api/orders", orderRouters);
app.use("/", cartRouter);

// Server Connection:
app.listen(3000, () => console.log(`Example app listening on port 3000!`));


