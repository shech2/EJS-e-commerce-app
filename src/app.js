const express = require('express');
const bp=require('body-parser');
const app = express();
const mongoose = require('mongoose'); // adds MongoDB to the Project
const donenv = require("dotenv");

donenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!"))
.catch((err) =>{
    console.log(err);
});



app.use(bp.urlencoded({extended:true}));
app.use(bp.json());

app.use(express.static('public'));
app.set("view engine", "ejs");

app.set('views', __dirname + '/views');

app.get('/', (req, res) => res.render('index'));

app.listen(3000, () => console.log(`Example app listening on port 3000!`));