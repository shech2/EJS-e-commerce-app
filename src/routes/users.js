const middleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const Cart = require("../models/cart");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

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
    await Order.find({ user: req.params.id }).then(async (orders) => {
      for (let i = 0; i < orders.length; i++) {
        orders[i].orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        await Order.findByIdAndDelete(orders[i]._id);
      }
    })
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

// Update user per field: (bypass required fields)
router.put("/update/:id", middleware.authAdmin, async (req, res) => {

  var user2 = await User.findById(req.params.id);

  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.user.username,
        email: req.user.email,
        password: req.body.password,
      },
    });
    user2 = user;
  }
  if (req.body.isAdmin) {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.user.username,
        email: req.user.email,
        password: req.user.password,
        isAdmin: req.body.isAdmin,
      },
    });
    user2 = user;
  }
  if (req.body.username) {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.user.email,
          password: req.user.password,
        },

      },
      { new: true }
    );
    user2 = user;
  }

  if (req.body.email) {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.user.username,
          email: req.body.email,
          password: req.user.password,
        },

      },
      { new: true }
    );
    user2 = user;
  }
  if (req.body.username && req.body.email) {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.user.password,
        },


      },
      { new: true }
    );
    user2 = user;

  }
  if (req.body.username && req.body.password) {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.user.email,
          password: req.body.password,
        },

      },
      { new: true }
    );
    user2 = user;
  }
  if (req.body.email && req.body.password) {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.user.username,
          email: req.body.email,
          password: req.body.password,
        },

      },
      { new: true }
    );
    user2 = user;
  }
  res.status(200).json(user2);
});





module.exports = router;
