const Category = require("../models/category");
const router = require("express").Router();





router.get("/", async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});

module.exports = router;