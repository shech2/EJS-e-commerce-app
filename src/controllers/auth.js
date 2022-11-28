const User = require("../models/User");
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const Cart = require("../models/cart");

// register
exports.auth_RegController = async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
        isAdmin: req.body.isAdmin
    });
    try {
        if (await User.findOne({
            username: newUser.username
        })) {
            req.flash('error', 'This user is already exists!');
            res.redirect("/register");
            return;
        }
        if (await User.findOne({
            email: newUser.email
        })) {
            req.flash('error', 'This email is already in use!');
            res.redirect("/register");
            return;
        }
        const savedUser = await newUser.save();
        console.log(savedUser);
        // Creates a cart for every new user

        const cart = new Cart({
            user: savedUser,
            cartItems: []
        });
        await cart.save();

        res.redirect("/login");
    } catch (err) {
        console.log(err);
        res.redirect("/register");
    }
};


// login
exports.auth_LogController = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if (!user) {
            req.flash('error', 'User has not been found, Please register!');
            res.redirect("/login");
            return;
        };

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (Originalpassword != req.body.password) {
            req.flash('error', 'Password is incorrect!');
            res.redirect("/login");
            return;
        }

        const accessToken = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;
        console.log(JSON.stringify({ ...others, accessToken }));
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.cookie("user", user, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });

        res.redirect("/homepage");
    } catch (err) {
        console.log(err);
        res.redirect("/login");
    }
};

// logout
exports.auth_LogoutController = (req, res) => {
    if (req.cookies.jwt) {
        res.clearCookie("jwt");
        res.clearCookie("user");
        res.redirect("/homepage");
    }
};
