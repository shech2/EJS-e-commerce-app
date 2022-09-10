const User = require("../models/User");
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

exports.auth_RegController  = async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
        isAdmin: req.body.isAdmin
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.auth_LogController = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if(!user){ 
            res.status(401).json("Wrong credentials!");
            return;
        };

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if(Originalpassword != req.body.password){
            res.status(401).json("incorrect password!");
            return;
        }

        const accessToken = jwt.sign({
            id:user.id,
            isAdmin: user.isAdmin,
        },  process.env.JWT_SEC,
        {expiresIn:"3d"}
        );

        const { password, ...others } = user._doc;
        res.status(200).json({...others, accessToken});
    } catch (err) {
        res.status(500).json(err);
    }
};