import http from "../http-common"

const getTransactions = async (accountID) => {
    return await http.get(`/payments/getTransactions/${accountID}`)
}

const makePayment = async (transactionPayload, accountId) => {
    return await http.post(`/payments/pay/${accountId}`, transactionPayload)
}

const getMethods = async (accountID) => {
    return await http.get(`/payments/${accountID}`)
}

const addCard = async (accountID, card) => {
    const request = { accountId: accountID, creditCard: card }
    return await http.post(`/payments/addCard/${accountID}`, request)
}

const addAddr = async (accountID, addr) => {
    const request = { accountId: accountID, billAddress: addr }
    return await http.post(`/payments/addAddr/${accountID}`, request)
}

const paymentsService = {
    getTransactions,
    makePayment,
    getMethods,
    addCard,
    addAddr,
};

export default paymentsService;