const asyncHandler = require("express-async-handler");
const Course = require("../models/courseModel");

/***
 * @desc Get All courses
 * @route GET /v1/api/courses
 * @access Private
 */
const apiGetCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ deleteIndicator: "false" });
  res.json(courses);
});

/***
 * @desc Create new course
 * @route POST /v1/api/courses/create
 * @access Private
 */
const apiCreateCourse = asyncHandler(async (req, res) => {
  if (parseFloat(req.body.courseDiscountedPrice) > parseFloat(req.body.courseOriginalPrice)) {
    return res.status(400).json({ message: "Discounted price cannot be higher than original price" });
  }
  const course = await Course.create({                      // Create new course
    courseName: req.body.courseName,
    courseImg: req.body.courseImg,
    courseOriginalPrice: req.body.courseOriginalPrice,
    courseDiscountedPrice: req.body.courseDiscountedPrice,
    canBeDiscounted: req.body.canBeDiscounted,
    courseType: req.body.courseType,
    courseDescription: req.body.courseDescription,
    courseTutor: req.body.courseTutor,
    quantity: req.body.quantity,
    company: req.body.company
  })
  res.status(200).json(course);
});

/***
 * @desc Update existing course
 * @route PUT /v1/api/courses/update/:id
 * @access Private
 */
const apiUpdateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(400);
    throw new Error('Course not found');
  }
  if (!req.body) {
    res.status(400);
    throw new Error('Please input your updated values');
  }
  if (req.body.courseDiscountedPrice > req.body.courseOriginalPrice) {
    return res.status(400).json({ message: "Discounted price cannot be higher than original price" });
  }
  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {                      // Create new course
    courseName: req.body.courseName,
    courseImg: req.body.courseImg,
    courseOriginalPrice: req.body.courseOriginalPrice,
    courseDiscountedPrice: req.body.courseDiscountedPrice,
    canBeDiscounted: req.body.canBeDiscounted,
    courseType: req.body.courseType,
    courseDescription: req.body.courseDescription,
    courseTutor: req.body.courseTutor,
    quantity: req.body.quantity,
    company: req.body.company
  }, { new: true, });
  res.status(200).json(updatedCourse);
});

/***
 * @desc Delete existing course
 * @route PUT course /v1/api/courses/delete/:id
 * @access Private
 */
const apiDeleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(400);
    throw new Error('Course not found');
  }
  const updatedCourse = await Course.findByIdAndUpdate({ _id: req.params.id }, { deleteIndicator: true });
  res.status(200).json(updatedCourse);
});

module.exports = {
  apiGetCourses,
  apiCreateCourse,
  apiUpdateCourse,
  apiDeleteCourse,
};
