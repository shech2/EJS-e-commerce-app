const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const router = require("express").Router();
// const OrderItem = require("../models/order-item");

router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "username")
    .sort({ dateOrdered: -1 }); // -1 it means descending order

  if (!orderList) {
    res.status(500).json({ success: false });

  }
  res.send(orderList);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "username")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

//update order
router.put("/order/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("the category cannot be created!");

  res.send(order);
});


//create the orders id
router.post("/create-order", async (req, res) => {
  const orders = JSON.parse(req.body.orderItems);
  const orderItemsIds = Promise.all(
    orders.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  //attach the orderItemsIds to the order
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress: req.body.shippingAddress,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  try {
    order = await order.save();

    res.send(order);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

//delete order
router.delete("/order/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id).then(async order => {
    if (order) {
      await order.orderItems.map(async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem);
      });
      return res
        .status(200).json({ success: true, message: "the order is deleted!" });
    } else {
      return res.status(404).json({ success: false, message: "order not found!" });
    }
  })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
