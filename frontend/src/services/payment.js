import http from "../http-common"

const getTransactions = async (accountID) =>{
    return await http.get(`/payments/getTransactions/${accountID}`)
}

const makePayment = async (transactionPayload) => {
    return await http.post('/payments/pay', transactionPayload)
}

const getMethods = async (accountID) => {
    return await http.get(`/payments/${accountID}`)
}

const paymentsService = {
    getTransactions,
    makePayment,
    getMethods,
};

export default paymentsService;