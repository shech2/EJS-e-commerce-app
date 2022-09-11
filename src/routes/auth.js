const router = require("express").Router();
const controller = require("../controllers/auth");

// REGISTER
router.post("/register",controller.auth_RegController);

// LOGIN
router.post("/login",controller.auth_LogController);


module.exports = router;