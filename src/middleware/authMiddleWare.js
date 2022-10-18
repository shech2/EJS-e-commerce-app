const jwt = require("jsonwebtoken");


exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    // const params = new URLSearchParams(window.location.search)
    if(token){
        jwt.verify(token, process.env.JWT_SEC, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect("/login");
            } else {
                // req.params = params;
                req.user = decodedToken;
                next();
            }
        });
        
    }
    else{
        res.redirect("/login");
    }

}

exports.authAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    const isAdmin = req.cookies.isAdmin;
    // const params = new URLSearchParams(window.location.search)
    if(token && isAdmin){
        jwt.verify(token, process.env.JWT_SEC, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect("/login");
            } else {
                if(decodedToken.isAdmin){
                    // req.params = params;
                    req.user = decodedToken;
                    next();
                } else {
                    res.redirect("/login");
                }
            }
        });
    }
    else{
        res.redirect("/login");
    }

}