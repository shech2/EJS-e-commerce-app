const jwt = require("jsonwebtoken");


exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SEC, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect("/login");
            } else {
                next();
            }
        });
        const user =  jwt.verify(token,process.env.JWT_SEC);
        req.user = user;
        console.log(user.id);

    }
    else{
        res.redirect("/login");
    }

}

exports.authAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    const isAdmin = req.cookies.isAdmin;
    if(token && isAdmin){
        jwt.verify(token, process.env.JWT_SEC, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect("/login");
            } else {
                if(decodedToken.isAdmin){
                    next();
                } else {
                    res.redirect("/login");
                }
            }
        });
        const user =  jwt.verify(token,process.env.JWT_SEC);
        req.user = user;
        console.log(user.id);
    }
    else{
        res.redirect("/login");
    }

}