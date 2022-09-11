const express = require('express');
const app = express();
const mongoose = require('mongoose'); // adds MongoDB to the Project
const dotenv = require("dotenv");


//middleware
const bp=require('body-parser');
const morgan = require("morgan");

//Routers
const authRouter = require("./routes/auth");
const ProductRouter = require("./routes/products");
const userRouters = require("./routes/users");
const orderRouters = require("./routes/orders");
const categoryRouters = require("./routes/categories");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded())
//app.use(bp.urlencoded({extended:true}));

 // Mongo DB Connection

mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!"))
.catch((err) =>{
    console.log(err);
});

app.use(bp.json());
app.use(morgan('tiny'));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use("/api/",ProductRouter); 
app.use("/api/auth", authRouter);
app.use("/api/users", userRouters);

app.set('views', __dirname + '/views');

app.get('/', (req, res) => res.render('index'));

// Server Connection

app.listen(3000, () => console.log(`Example app listening on port 3000!`));