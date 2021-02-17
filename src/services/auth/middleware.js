const jwt = require("jsonwebtoken")
const AuthorSchema = require("../authors/schema")
const { verifyJWT } = require("./tools")

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    // console.log("token",token)
    const decoded = await verifyJWT(token)
    // console.log("decoded",decoded)
    const user = await AuthorSchema.findOne({
      _id: decoded._id,
    })
    console.log("user",user)

    if (!user) {
      throw new Error()
    }
console.log(req.user,req.token)
    req.token = token
    req.user = user
    next()
  } catch (e) {
    const err = new Error("Please authenticate")
    err.httpStatusCode = 401
    next(err)
  }
}

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") next()
  else {
    const err = new Error("Only for admins!")
    err.httpStatusCode = 403
    next(err)
  }
}

module.exports = { authorize, adminOnlyMiddleware }