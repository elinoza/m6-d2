const express = require("express")
const uniqid= require("uniqid")
const mongoose = require("mongoose")
const articleSchema = require("./schema")
const reviewSchema = require("../reviews/schema")

const articlesRouter = express.Router()

articlesRouter.get("/", async (req, res, next) => {
  try {
    const articles = await articleSchema.find()
    res.send(articles)
  } catch (error) {
    next(error)
  }
})

articlesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const article = await articleSchema.findById(id)
    if (article) {
      res.send(article)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading articles list a problem occurred!")
  }
})

articlesRouter.post("/", async (req, res, next) => {
  try {
    const newarticle = new articleSchema(req.body)
    const { _id } = await newarticle.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

articlesRouter.put("/:id", async (req, res, next) => {
  try {
    const article = await articleSchema.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (article) {
      res.send(article)
    } else {
      const error = new Error(`article with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

articlesRouter.delete("/:id", async (req, res, next) => {
  try {
    const article = await articleSchema.findByIdAndDelete(req.params.id)
    if (article) {
      res.send("Deleted")
    } else {
      const error = new Error(`article with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

/// EMBEDDING REVIEWS PART BELOW
articlesRouter.post("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
   
    const review = new reviewSchema(req.body)
    const reviewToInsert = { ...review.toObject(), date: new Date(),id:uniqid() }

    const updated = await articleSchema.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: reviewToInsert,
        },
      },
      { runValidators: true, new: true }
    )
    res.status(201).send(updated)
  } catch (error) {
    next(error)
  }
})

articlesRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const { reviews} = await articleSchema.findById(req.params.id, {
      reviews: 1,
      _id: 0,
    })
    res.send(reviews)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviews} = await articleSchema.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
      reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    )

    if (reviews && reviews.length > 0) {
      res.send(reviews[0])
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.delete("/:id/purchaseHistory/:reviewId", async (req, res, next) => {
  try {
    const modifiedreview = await articleSchema.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          purchaseHistory: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      },
      {
        new: true,
      }
    )
    res.send(modifiedreview)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviews} = await articleSchema.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.id),
      },
      {
        _id: 0,
        reviews: {
          $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
        },
      }
    )

    if (reviews&& reviews.length > 0) {
      const reviewToReplace = { ...reviews[0].toObject(), ...req.body }

      const modifiedreview = await articleSchema.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          "purchaseHistory._id": mongoose.Types.ObjectId(req.params.reviewId),
        },
        { $set: { "purchaseHistory.$": reviewToReplace } },
        {
          runValidators: true,
          new: true,
        }
      )
      res.send(modifiedreview)
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = articlesRouter
