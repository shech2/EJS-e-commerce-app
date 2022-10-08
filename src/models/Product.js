const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
<<<<<<< HEAD
    Product_name: {type: String, required: true},
    description: {type: String,required: true},
    price: {type: Number,required:true},
    category: {type: Object,required:true},
    stock: {type: Number,required:true},
    image: {type: String,required:true},
    rating: {type: Number,required:true},
=======
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Category', 
         required: true},
    stock: {
        type: Number,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    rating: {
        type: Number,
        required:true
    },
>>>>>>> 7baa25910482dba2e2bea67c61bdd526e87557e3
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


