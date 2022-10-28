const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemsSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("OrderItem", orderItemsSchema);