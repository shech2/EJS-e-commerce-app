const User = require("../models/user")

function login(username, password) {
    return User.findOne({
        "username": username,
        "email": email,
        "password":password 
     });
}

function register(username, password) {
    const user = new User({ 
        username: username,
        email: email,
        password:password 
    });
    return user.save();
}

module.exports = { login, register };