const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
    }],
    shippingAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },    
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: "Pending"
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dateOrdered: {
        type: Date,
        default: Date.now, //creates the time where the post request is made
    },  
});

orderSchema.virtual("id").get(function() {
    return this._id.toHexString();
});

orderSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Order", orderSchema);