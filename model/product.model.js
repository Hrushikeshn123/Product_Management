const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    productName:{type: String},
    qty:{type:Number},
    price:{type:Number},
    mangDate:{type: String},
    id:{ type: mongoose.Schema.Types.ObjectId},
    image: { type: String},
})

const ProductModel = mongoose.model("product",ProductSchema,"products")
module.exports=ProductModel