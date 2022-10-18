const Category = require("../models/category");
const router = require("express").Router();

router.get("/category", async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});

//create category
router.post("/category", async (req, res) => {
    var category = new Category({
    name: req.body.name,
  });
  category = await category.save();

  if (!category) return res.status(404).send("the category cannot be created!");

  res.send(category);
});

router.get("/category/:id", async (req, res) => {
  const category = await Category.findById(req.params.id)

  if(!category) {
      res.status(500).json({success: false})
  }
  res.send(category);
})

//delete category
router.delete("/category/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "the category is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// update category
router.put("/category/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!category) return res.status(400).send("the category cannot be created!");

  res.send(category);
});

module.exports = router;
