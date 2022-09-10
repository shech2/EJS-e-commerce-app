const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require('crypto-js');


// REGISTER

router.post("/register", async (req,res) =>{
    const newUser = new User({
        username : req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC)
    });
try{
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
}catch(err){
    res.status(500).json(err);
}
});


// LOGIN

router.post("/login", async (req,res) =>{
    
        const user = await User.findOne({username: req.body.username});
        if(!user){
            res.send("User doesn't exist");
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const Originalpassword = hashedPassword.toString();


        const { password, ...others} = user._doc;

        res.status(200).json(others);
});


module.exports = router;