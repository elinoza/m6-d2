const jwt = require("jsonwebtoken")


const authenticate = async author => {
  try {
      console.log(author)
    const newAccessToken = await generateJWT({ _id: author._id })
   
    return newAccessToken
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

const generateJWT = payload =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1 week' },
      (err, token) => {
        if (err) rej(err)
        res(token)
      }
    )
  )

const verifyJWT = token =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log("decoded",decoded,process.env.JWT_SECRET)
      if (err) rej(err)
      res(decoded)
    })
  )
  module.exports = { authenticate, verifyJWT}