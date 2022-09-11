const express = require('express');
const bp=require('body-parser');
const app = express();
const mongoose = require('mongoose'); // adds MongoDB to the Project
const dotenv = require("dotenv");
const authRouter = require("./routes/auth");
const ProductRouter = require("./routes/Product");
const morgan = require("morgan");

dotenv.config();

app.use(express.urlencoded())
app.use(express.json());




 // Mongo DB Connection

mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!"))
.catch((err) =>{
    console.log(err);
});

// app.use(bp.urlencoded({extended:true}));

app.use(bp.json());
app.use("/api/auth" , authRouter);
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use("/api/",ProductRouter); 
app.set("view engine", "ejs");


app.set('views', __dirname + '/views');

app.get('/', (req, res) => res.render('index'));

// Server Connection

app.listen(3000, () => console.log(`Example app listening on port 3000!`));