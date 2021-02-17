const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const AuthorSchema = new Schema(
{

    name:String,
    img:String,
    password: String,
    email: String,
    

})

AuthorSchema .statics.findByCredentials = async function(email, plainPW)  {
    const author = await this.findOne({ email })
    
  
    if (author) {
      const isMatch = await bcrypt.compare(plainPW, author.password)
      console.log("isMatch?",isMatch)
      if (isMatch) 
      return author
      else return null
    } else {
      return null
    }
  }

  AuthorSchema.pre("save", async function (next) {
    const author= this
    const plainPW = author.password
  
    if (author.isModified("password")) {
      author.password = await bcrypt.hash(plainPW, 10)
    }
    next()
  })

module.exports = mongoose.model("Author", AuthorSchema)