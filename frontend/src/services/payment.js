import http from "../http-common"

const getTransactions = async (accountID) => {
    return await http.get(`/payments/getTransactions/${accountID}`)
}

const makePayment = async (transactionPayload) => {
    return await http.post('/payments/pay', transactionPayload)
}

const getMethods = async (accountID) => {
    return await http.get(`/payments/${accountID}`)
}

const addCard = async (accountID, card) => {
    const request = { accountId: accountID, creditCard: card }
    return await http.post(`/payments/addCard`, request)
}

const addAddr = async (accountID, addr) => {
    const request = { accountId: accountID, billAddress: addr }
    return await http.post(`/payments/addAddr`, request)
}

const paymentsService = {
    getTransactions,
    makePayment,
    getMethods,
    addCard,
    addAddr,
};

export default paymentsService;