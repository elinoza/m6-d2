const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const AuthorSchema = new Schema(
{

    name:{
    type: String},
    img:{
    type: String},
    password: String,
    email: String,
    

})

AuthorSchema .statics.findByCredentials = async (email, plainPW) => {
    const user = await this.findOne({ email })
  
    if (user) {
      const isMatch = await bcrypt.compare(plainPW, user.password)
      if (isMatch) return user
      else return null
    } else {
      return null
    }
  }

module.exports = mongoose.model("Author", AuthorSchema)