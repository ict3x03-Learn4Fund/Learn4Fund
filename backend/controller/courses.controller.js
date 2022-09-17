import CoursesDAO from "../dao/coursesDAO.js"

// highest layer that contain methods to interact with the frontend
export default class CoursesController {
    /***
     * @desc Get All courses
     * @route GET /v1/api/courses/getAll
     * @access Private
     */
    static async apiGetCourses(req,res,next){
        const coursesPerPage = req.query.restaurantsPerPage ? parseInt(req.query.coursesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.name){
            filters.name = req.query.name
        } else if (req.query.courseType) {
            filters.courseType = req.query.courseType
        }

        const { coursesList, totalNumCourses } = await CoursesDAO.getCourses({
            filters, page, coursesPerPage,
        })

        // create json payload
        let response = {
            courses: coursesList,
            page: page,
            filters: filters,
            entries_per_page: coursesPerPage,
            total_results: totalNumCourses,
        }
        res.json(response)
    }

    /***
     * @desc Create new course
     * @route POST /v1/api/courses/createCourse
     * @access Private
     */
    static async apiCreateCourse(req,res,next){
        if (!req.body.text) {
            res.status(400)
            throw new Error('Please add a text field')
        }
        res.status(200).json({ message: 'create course'})
    }

    /***
     * @desc Update existing course
     * @route PUT /v1/api/courses/updateCourse/:id
     * @access Private
     */
    static async apiUpdateCourse(req,res,next){
        res.status(200).json({message: `Update course ${req.params.id}`})
    }

    /***
     * @desc Delete existing course
     * @route DELETE /v1/api/courses/deleteCourse/:id
     * @access Private
     */
    static async apiDeleteCourse(req,res,next){
        res.status(200).json({message: `Delete course ${req.params.id}`}) 
    }
}