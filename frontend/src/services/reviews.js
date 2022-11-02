import http from "../http-common"

const getReviews = async (courseID) =>{
    return await http.get(`/reviews/${courseID}`)
}

const getCreateReview = async (reqReview) =>{
    return await http.post("/reviews/create", reqReview)
}

const reviewsService = {
    getReviews,
    getCreateReview,
};

export default reviewsService;