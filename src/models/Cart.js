const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
},
    { timestamps: true}
);

module.exports = mongoose.model("Cart", cartSchema);