const express = require('express');
const app = express();
const mongoose = require('mongoose'); // adds MongoDB to the Project
const dotenv = require("dotenv");
const express_session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require('express-ejs-layouts');

// COOKIES:
const cookieparser = require('cookie-parser');
app.use(cookieparser());

//Layouts:
app.use(expressLayouts);
app.set('layout', "./layouts/full-width");


//middleware:
const authmw = require('./middleware/authMiddleWare');
const bp=require('body-parser');
const morgan = require("morgan");
app.use(morgan('tiny'));

//Routers:
const authRouter = require("./routes/auth");
const ProductRouter = require("./routes/products");
const userRouters = require("./routes/users");
const orderRouters = require("./routes/orders");
const categoryRouters = require("./routes/categories");

// DOTENV:
dotenv.config();

// EXPRESS:
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

// Mongo DB Connection:
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!"))
.catch((err) =>{
    console.log(err);
});

// session + flash:
app.use(express_session({
    secret: process.env.SESSION_SEC,
    cookie: { maxAge : 6000},
    resave: true,
    saveUninitialized: true
}));
app.use(flash());



// EJS:
app.use(express.static("public"));
app.use('/css', express.static(__dirname + "public"));
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

// GET for login and signup and logout:
app.get('/login', (req,res) => {
    const error = req.flash('error');
    res.render('login.ejs', { error, title: "Login", cssfile: "/css/style-login.css" });
});

app.get('/register', (req,res) => {
    const error = req.flash('error');
    res.render('register.ejs' , { error, title: "Register", cssfile: "/css/register.css" });
});

app.get('/homepage', (req,res) => {
    res.render('homePage.ejs', { title: "Home-Page", cssfile: "/css/full-width.css" });
});

app.get('/logout', authRouter ,(req,res) => {
    res.render ('logout.ejs', { title: "Logout", cssfile: "/css/style-login.css" });
});

// GET SHOP:
app.get('/shop',authmw.authMiddleware,(req,res) => {
    res.render('Shop.ejs', { title: "Shop", cssfile: "/css/shop.css" });
});

// GET ABOUT:
app.get('/about', (req,res) => {
    res.render('About.ejs', { title: "About", cssfile: "/css/about.css" });
});

// Admin page:
app.get('/admin',authmw.authAdmin, (req,res) => {
    res.render('admin.ejs', {title: "Admin page", cssfile: "/css/full-width.css" ,username: req.cookies.username});
});

// POST for login and signup:
app.post('/register' , authRouter,userRouters);
app.post('/login' , authRouter,userRouters);

// Main Route:
app.get('/', (req, res) => res.render('index'));

// ROUTES:
app.use("/api/",ProductRouter); 
app.use("/api/auth", authRouter);
app.use("/api/users", userRouters);

// Server Connection:
app.listen(3000, () => console.log(`Example app listening on port 3000!`));

