const jwt = require("jsonwebtoken");


exports.authMiddleware = (req, res, next) => {
    if (req.cookies.jwt) {
        const token = req.cookies.jwt;
        jwt.verify(token, process.env.JWT_SEC, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            } else {
                req.user = decodedToken;
                next();
            }
        });

    }
    else {
        res.redirect("/login");
    }

}

exports.authAdmin = (req, res, next) => {
    if (req.cookies.jwt && req.cookies.user.isAdmin) {
        const token = req.cookies.jwt;
        jwt.verify(token, process.env.JWT_SEC, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            } else {
                if (decodedToken.isAdmin) {
                    req.user = decodedToken;
                    next();
                } else {
                    res.redirect("/login");
                }
            }
        });
    }
    else {
        res.redirect("/login");
    }

}