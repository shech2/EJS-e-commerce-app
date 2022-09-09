const User = require("../models/user")
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Shop')

function login(username, password) {
    return User.findOne({
        "username": username,
        "password":password 
     });
}

function register(username, password) {
    const user = new User({ 
        username: username,
        password:password 
    });
    return user.save();
}

module.exports = { login, register };