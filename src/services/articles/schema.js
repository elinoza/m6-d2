const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const articleSchema = new Schema(
  {
    headLine: {
      type: String,
      required: true,
    },
    subHead: {
      type: String
    },
    content: {
      type: String,
      required: true
    },
    category:{
      name:{
      type: String},
      img:{
        type: String}
      }
      ,
      author:{
        name:{
        type: String},
        img:{
          type: String}
        }
        ,
    cover: {
      type: String }
    }
)

articleSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("article", articleSchema)
