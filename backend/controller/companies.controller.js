import companyModel from "../models/companyModel.js"

// highest layer that contain methods to interact with the frontend
export default class CompaniesController {
    /***
     * @desc Get All courses
     * @route GET /v1/api/courses/getAll
     * @access Private
     */
    static async apiGetCompanies(req,res,next){
        const companies = companyModel.find()
        res.json(companies)
    }
}