import http from "../http-common"

const getAll = async () =>{
    const response = await http.get("/courses")
    return response;
}

const deleteCourse = async (id) =>{
    const response = await http.delete(`/courses/${id}`)
    return response;
}

const coursesService = {
    getAll,
    deleteCourse
};

export default coursesService;