const User = require("../models/user")
const mongoose = require('mongoose')

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