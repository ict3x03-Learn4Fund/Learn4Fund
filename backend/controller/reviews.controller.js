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
    
    const reviews = await Review.find().populate("accountId");          // Get all reviews from DB
    const reviewList = [];                                              // Create an empty array for list of reviews

    for (const review in reviews) {                                     // Loop through all reviews

      if (reviews[review].courseId.toString() === req.params.id) {      // Check if the review is for the course

        let reviewDate = new Date(reviews[review].createdAt)            // Get the date of the review
        const account = await Account.findById(reviews[review].accountId); // Get the account that created the review

        const extendReview = {
          rating: reviews[review].rating,                               // Get the rating given in the review
          description: reviews[review].description,                     // Get the description of the review
          name: account.firstName,                                      // Get the name of the account that created the review
          date: `${reviewDate.getDate()}/${reviewDate.getMonth()}/${reviewDate.getFullYear()}` // Get the date of the review
        };

        reviewList.push(extendReview);          
      }
    }
    // console.log(courses)
    res.status(200).json({ reviews: reviewList });                     // Return the list of reviews
  } catch (error) {
    res.status(400).json(`message: ${error.message}`);                 // Return error message
  }
});

/***
 * @desc Add new review
 * @route POST /v1/api/reviews/add
 * @access Private
 */
const apiCreateReview = asyncHandler(async (req, res) => {
         // Create a new review
  if (!req.body.accountId){                                           // Check if the account id is provided
    return res.status(400).json({message: "account id cannot be null."})
  }
  else {
    // Check if the account has already reviewed the course
    let review = await Review.findOne({accountId: req.body.accountId, courseId: req.body.courseId}) 
    if (!review){                                                       // If the account has not reviewed the course
      review = await Review.create({                                    // Create a new review
        rating: req.body.rating,                                        // Set the rating
        description: req.body.description,                              // Set the description
        accountId: req.body.accountId,                                  // Tie account id to the review
        courseId: req.body.courseId,                                    // Set the course id
      });
    } else {
      review.rating = req.body.rating,                                  // Update the rating
      review.description = req.body.description,                        // Update the description
      review.accountId = req.body.accountId,                            // Update the account id
      review.courseId = req.body.courseId                               // Update the course id
      review.save()
    }

    res.status(200).json(review);                                       // Return the review
  }

});


module.exports = {
  apiGetReviews,
  apiCreateReview,
};
