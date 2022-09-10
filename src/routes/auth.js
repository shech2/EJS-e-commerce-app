const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require('crypto-js');


// REGISTER

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC)
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});


// LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if(user.username != req.body.username){ 
            res.status(401).json("Wrong credentials!");
            return;
        };
        if(user.email != req.body.email) {
            res.status(401).json("Wrong credentials!");
            return;
        };
        console.log(user.username);
        console.log(user.email);
        console.log(user.password);


        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        console.log(Originalpassword);

        if(Originalpassword != req.body.password){
            res.status(401).json("Wrong credentials!");
            return;
        }

        const { password, ...others } = user._doc;

        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;