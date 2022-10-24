import http from "../http-common"

const getTransactions = async (accountID) =>{
    return await http.get(`/payments/getTransactions/${accountID}`)
}

const paymentsService = {
    getTransactions,
};

export default paymentsService;