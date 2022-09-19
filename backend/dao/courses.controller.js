import CoursesDAO from "../dao/coursesDAO.js"

// highest layer that contain methods to interact with the frontend
export default class CoursesController {
    // function to get all courses, with filter options
    static async apiGetCourses(req,res,next){
        const coursesPerPage = req.query.restaurantsPerPage ? parseInt(req.query.coursesPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.email){
            filters.email = req.query.email
        } else if (req.query.storeLocation) {
            filters.storeLocation = req.query.storeLocation
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
}