const express = require("express")

const AuthorSchema = require("./schema")
const { authenticate} = require("../auth/tools")
const { authorize } = require("../auth/middleware")

const authorsRouter = express.Router()

authorsRouter.get("/", authorize, async (req, res, next) => {
  try {
    const authors = await AuthorSchema.find()
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:id", authorize, async (req, res, next) => {
  try {
    const id = req.params.id
    const author = await AuthorSchema.findById(id)
    if (author) {
      res.send(author)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("problem orccured!")
  }
})

authorsRouter.post("/", async (req, res, next) => {
  try {
    
    const newAuthor = new AuthorSchema(req.body)
    const { _id } = await newAuthor.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:id",authorize, async (req, res, next) => {
  try {
    const author = await AuthorSchema.findByIdAndUpdate(req.params.id, req.body)
    if (author) {
      res.send("Ok")
    } else {
      const error = new Error(`author with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:id", authorize,async (req, res, next) => {
  try {
    const author = await AuthorSchema.findByIdAndDelete(req.params.id)
    if (author) {
      res.send("Deleted")
    } else {
      const error = new Error(`author with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})
authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const author= await AuthorSchema.findByCredentials(email, password)
    console.log(author)
    const tokens = await authenticate(author)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

module.exports = authorsRouter