import http from "../http-common"

const getImg = async (id) =>{
    const response = await http.get(`/images/getImg/:${id}`)
    return response;
}

const imagesService = {
    getImg,
};

export default imagesService;