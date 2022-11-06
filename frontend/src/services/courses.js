import http from "../http-common"

const getAll = async () => {
    const response = await http.get("/courses")
    return response;
}

const deleteCourse = async (id, userId) => {
    const response = await http.post(`/courses/delete/${id}/${userId}`)
    return response;
}

const createCourse = async (data, userId) => {
    const response = await http.post(`/courses/create/${userId}`, data)
    return response;
}

const updateCourse = async (id, data, userId) => {
    const response = await http.put(`/courses/update/${id}/${userId}`, data)
    return response;
}

const uploadCourseImage = async (imgId, userId) => {
    const response = await http.post(`/courses/uploadCourseImage/${userId}`, imgId);
    return response;
}

const coursesService = {
    getAll,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadCourseImage
};

export default coursesService;