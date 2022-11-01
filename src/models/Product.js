const mongoose = require("mongoose");
const product = require("../models/Product");
const Schema = mongoose.Schema; 
const productSchema = new Schema(
    {
    Product_name: {
        type: String,
         required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required:true
    },
    size: [
        {
            Product_name: {
                type: String,
            },
            size:{
                type: Number,
            },
            quantity: {
                type: Number,
            }
        }
    ],
    
    brand: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Brand', 
         required: true},
    category: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Category', 
         required: true},
    quantity: {
        type: Number,
        default: 1,
        required:true
    },
    image: [{
        type: String,
        required:true
    }],
    rating: {
        type: Number,
        required:true
    },
},
    { timestamps: true}
);

productSchema.virtual("id").get(function() {
    return this._id.toHexString();
});

productSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Product", productSchema);


