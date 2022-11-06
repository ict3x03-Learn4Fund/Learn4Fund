import http from "../http-common"

const getImg = async (id) => {
    const response = await http.get(`/images/getImg/:${id}`)
    return response;
}

const uploadImage = async (formData,userId) => {
    return await http.post(`/images/upload/${userId}`, formData)
}

const imagesService = {
    getImg,
    uploadImage
};

export default imagesService;