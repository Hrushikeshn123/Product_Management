const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:{type: String},
    password:{type:String},
    mobile:{type:String},
    email:{type: String}
})

const UserModel = mongoose.model("user",UserSchema,"users")
module.exports=UserModel