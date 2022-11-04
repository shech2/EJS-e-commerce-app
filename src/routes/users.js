const middleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Cart = require("../models/cart");

// UPDATE
router.put("/:id", middleware.authAdmin, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", middleware.authAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Cart.findOneAndDelete({ user: req.params.id });
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER

router.get("/find/:id", middleware.authAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER

router.get("/", middleware.authAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS

router.get("/stats", middleware.authAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.setFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT USER 
router.put("/update/:id", middleware.authAdmin, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    if(req.body.username){
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.user.email,
          password: req.user.password,
        } 
      },
      { new: true }
    );
      if (req.body.email){
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              username: req.user.username,
              email: req.body.email,
              password: req.user.password,
            } 
          },
          { new: true }
        );
      }
      if (req.body.password){
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              username: req.user.username,
              email: req.user.email,
              password: req.body.password,
            } 
          },
          { new: true }
        );
      }
    res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});





module.exports = router;
