import http from "../http-common"

const getAll = async () =>{
    const response = await http.get("/courses")
    return response;
}

const deleteCourse = async (id) =>{
    const response = await http.post(`/courses/delete/${id}`)
    return response;
}

const createCourse = async (data) =>{
    const response = await http.post("/courses/create", data)
    return response;
}

const updateCourse = async (id, data) =>{
    const response = await http.put(`/courses/update/${id}`, data)
    return response;
}

const uploadCourseImage = async (imgId) => {
    const response = await http.post(`/courses/uploadCourseImage`, imgId);
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