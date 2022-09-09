const express = require('express');
const bp=require('body-parser');
const app = express();
const mongoose = require('mongoose'); // adds MongoDB to the Project
const donenv = require("dotenv");

donenv.config();
app.use(express.urlencoded())

const loginRouter = require('./routes/login');
app.use('/' , loginRouter);

mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!"))
.catch((err) =>{
    console.log(err);
}); // Connect to DB username : admin password: admin. you can try later.

const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.use(express.static('public'));
app.set("view engine", "ejs");


// test how are you ?
// mongoose.connect("mmongodb+srv://yuval1994:test1994S@cluster1.ijoboz4.mongodb.net/shop" --apiVersion 1 --username <username>")

app.set('views', __dirname + '/views');

app.get('/', (req, res) => res.render('index'));

app.listen(3000, () => console.log(`Example app listening on port 3000!`));