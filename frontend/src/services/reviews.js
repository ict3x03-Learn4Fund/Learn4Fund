import http from "../http-common"

const getReviews = async (courseID) => {
    return await http.get(`/reviews/${courseID}`)
}

const getCreateReview = async (reqReview, userId) => {
    return await http.post(`/reviews/create/${userId}`, reqReview)
}

const verifyReview = async (accountId, courseId) => {
    const request = { accountId, courseId }
    return await http.post(`/reviews/verifyReview/${accountId}`, request)
}

const reviewsService = {
    getReviews,
    getCreateReview,
    verifyReview,
};

export default reviewsService;