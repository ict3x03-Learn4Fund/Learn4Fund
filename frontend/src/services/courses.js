import http from "../http-common"

const getAll = async () =>{
    const response = await http.get("/courses")
    return response;
}

const coursesService = {
    getAll,
};

export default coursesService;