const { Schema } = require("mongoose")
const mongoose = require("mongoose")


const AuthorSchema = new Schema(
{
author:{
    name:{
    type: String},
    img:{
    type: String}
    }

})



module.exports = mongoose.model("Author", AuthorSchema)