const Brand = require("../models/brand");
const router = require("express").Router();

router.get("/brand", async (req, res) => {
  const brandList = await Brand.find();

  if (!brandList) {
    res.status(500).json({ success: false });
  }
  res.send(brandList);
});

//create brand
router.post("/brand", async (req, res) => {
    var brand = new Brand({
    name: req.body.name,
  });
  brand = await brand.save();

  if (!brand) return res.status(404).send("the brand cannot be created!");

  res.send(brand);
});

router.get("/brand/:id", async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  if(!brand) {
      res.status(500).json({success: false})
  }
  res.send(brand);
})

//delete brand
router.delete("/brand/:id", (req, res) => {
  Brand.findByIdAndRemove(req.params.id)
    .then((brand) => {
      if (brand) {
        return res
          .status(200)
          .json({ success: true, message: "the brand is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "brand not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// update brand
router.put("/brand/:id", async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!brand) return res.status(400).send("the brand cannot be created!");

  res.send(brand);
});

module.exports = router;
