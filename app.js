const express = require('express');
const bp=require('body-parser');
const app = express();
const mongoose = require('mongoose'); // adds MongoDB to the Project
const donenv = require("dotenv");
const authRouter = require("./routes/auth");

donenv.config();

app.use(express.urlencoded())



 // Mongo DB Connection:
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!"))
.catch((err) =>{
    console.log(err);
});

// Body-parser:

// app.use(bp.urlencoded({extended:true}));
// app.use(bp.json());
app.use(express.json());

app.use("/api/auth" , authRouter);
app.use(express.static('public'));
app.set("view engine", "ejs");


app.set('views', __dirname + '/views');

app.get('/', (req, res) => res.render('index'));

// SERVER on port 3000

app.listen(3000, () => console.log(`Example app listening on port 3000!`));