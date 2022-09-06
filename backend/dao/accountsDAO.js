let accounts

// class that contains api logic, which is called by the controller class
export default class AccountsDAO{
    // to connect to the database
    static async injectDB(conn){
        if (accounts){
            return
        }
        try {
            accounts = await conn.db(process.env.COURSES_NS).collection("accounts")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in accountsDAO: ${e}`,
            )
        }
    }

    static async getAll(){
        let cursor
        try {
            cursor = await accounts.find()
            const accountLists = cursor.toArray()
            return { accountLists}
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { accountLists: [] }
        }
    }
    
    // api logic for getting account during login 
    static async login({
        verifyingAccount
    } = {}){
        let query
        query = { "username" : verifyingAccount["username"], "password" : verifyingAccount["password"]}

        let cursor

        try {
            console.log(verifyingAccount)
            cursor = await accounts.find(query)
            const account = await cursor.toArray()
            let loginStatus = "fail"
            console.log(account[0].username)
            if (account[0].username == verifyingAccount.username)
                loginStatus = "success"
            return { account: account, loginStatus: loginStatus}
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { account:null, loginStatus: "fail"}
        }
    }

    
}