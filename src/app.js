const express = require('express');
const app = express();
const mongoose = require('mongoose'); // adds MongoDB to the Project
const dotenv = require("dotenv");
const ejs = require('ejs');


//middleware
const bp=require('body-parser');
const morgan = require("morgan");
app.use(morgan('tiny'));

//Routers
const authRouter = require("./routes/auth");
const ProductRouter = require("./routes/products");
const userRouters = require("./routes/users");
const orderRouters = require("./routes/orders");
const categoryRouters = require("./routes/categories");

// DOTENV:
dotenv.config();

// EXPRESS:
app.use(express.json());
app.use(express.urlencoded())
app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

// Mongo DB Connection
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!"))
.catch((err) =>{
    console.log(err);
});

// EJS:
app.use(express.static("public"));
app.use('/css', express.static(__dirname + "public"));
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.get('/login', (req,res) => res.render('login.ejs'));
app.get('/register', (req,res) => res.render('register.ejs'));
app.post('/register' , authRouter,userRouters);
app.post('/login' , authRouter);

//app.get('/', (req, res) => res.render('index'));



// ROUTES:
app.use("/api/",ProductRouter); 
app.use("/api/auth", authRouter);
app.use("/api/users", userRouters);

// Server Connection
app.listen(3000, () => console.log(`Example app listening on port 3000!`));