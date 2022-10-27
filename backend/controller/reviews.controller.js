const asyncHandler = require("express-async-handler");
const Review = require("../models/reviewModel");
const Account = require("../models/accountModel");
const mongoose = require("mongoose");

/***
 * @desc Get All review
 * @route GET /v1/api/reviews
 * @access Public
 */
const apiGetReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await Review.find().populate("accountId");
    const reviewList = [];
    for (const review in reviews) {
      if (reviews[review].courseId.toString() === req.params.id) {
        let reviewDate = new Date(reviews[review].createdAt)
        const account = await Account.findById(reviews[review].accountId);
        const extendReview = {
          rating: reviews[review].rating,
          description: reviews[review].description,
          name: account.firstName,
          date: `${reviewDate.getDate()}/${reviewDate.getMonth()}/${reviewDate.getFullYear()}` 
        };
        reviewList.push(extendReview);
      }
    }
    // console.log(courses)
    res.status(200).json({ reviews: reviewList });
  } catch (error) {
    res.status(400).json(`message: ${error.message}`);
  }
});

/***
 * @desc Add new review
 * @route POST /v1/api/reviews/add
 * @access Private
 */
const apiCreateReview = asyncHandler(async (req, res) => {
  if (!req.body.accountId){
    return res.status(400).json({message: "account id cannot be null."})
  }
  let review = await Review.findOne({accountId: req.body.accountId, courseId: req.body.courseId})
  if (!review){
    review = await Review.create({
      rating: req.body.rating,
      description: req.body.description,
      accountId: req.body.accountId,
      courseId: req.body.courseId,
    });
  } else {
    review.rating = req.body.rating,
    review.description = req.body.description,
    review.accountId = req.body.accountId,
    review.courseId = req.body.courseId
    review.save()
  }

  res.status(200).json(review);
});


module.exports = {
  apiGetReviews,
  apiCreateReview,
};
