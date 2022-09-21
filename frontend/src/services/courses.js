import http from "../http-common"

// class that handles the calling of different api service
class CoursesDataServices {
    getAll(page = 0) {
        return http.get(`/getAll?page=${page}`);
    }

    get(id) {
        return http.get(`/getAll/id/${id}`);
    }

    find(query, by = "email", page = 0){
        return http.get(`/getAll?${by}=${query}&page=${page}`);
    }
}

export default new CoursesDataServices();