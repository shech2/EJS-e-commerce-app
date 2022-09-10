const express = require('express');


const loginController = require("../controllers/login");

const router = express.Router();

router.get("/usertest", (req,res) =>{
    res.send("hello");
});

router.post("/usertestpost", (req,res) =>{
    const username = req.body.username;
});

// router.post('/login', loginController.login);
// router.post('/register', loginController.register);

module.exports = router;