import AccountsDAO from "../accountsDAO.js"

// highest layer that contain methods to interact with the frontend
export default class AccountsController {
    static async apiGetAll(req,res,next){
        const { accountLists } = await AccountsDAO.getAll()
        let response = {
            accountLists: accountLists
        }
        res.json(response)
    }

    // function to get all courses, with filter options
    static async apiLogin(req,res,next){
        const verifyingAccount = req.body.verifyingAccount

        const { account, loginStatus } = await AccountsDAO.login({
            verifyingAccount
        })

        // create json payload
        let response = {
            account: account,
            loginStatus: loginStatus,
        }
        res.json(response)
    }
}