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
    const reviews = await Review.find();
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
 * @route POST /v1/api/review/add
 * @access Private
 */
const apiCreateReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    rating: req.body.rating,
    description: req.body.description,
    title: req.body.title,
    accountId: req.body.accountId,
    courseId: req.body.courseId,
  });
  res.status(200).json(review);
});

/***
 * @desc Update existing course
 * @route PUT /v1/api/courses/update/:id
 * @access Private
 */
const apiUpdateCourse = asyncHandler(async (req, res) => {
  const course = await Course.find(req.params.id);
  if (!course) {
    res.status(400);
    throw new Error("Course not found");
  }
  if (!req.body) {
    res.status(400);
    throw new Error("Please input your updated values");
  }
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedCourse);
});

/***
 * @desc Delete existing course
 * @route PUT course /v1/api/courses/delete/:id
 * @access Private
 */
const apiDeleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.find(req.params.id);
  if (!course) {
    res.status(400);
    throw new Error("Course not found");
  }
  const deleteIndicator = true;
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    deleteIndicator,
    { new: true }
  );
  res.status(200).json(updatedCourse);
});

module.exports = {
  apiGetReviews,
  apiCreateReview,
};
