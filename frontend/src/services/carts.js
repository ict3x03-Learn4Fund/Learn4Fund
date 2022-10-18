import http from "../http-common";

const getCart = async (accountId) => {
  const response = await http.get(`/carts/${accountId}`);
  return response;
};

const addCart = async (accountId, courseId, quantity) => {
  const cartItem = { courseId, quantity };
  const cart = { accountId, cartItem };
  const response = await http.post(`/carts/add`, cart);
  return response;
};

const deleteCart = async (accountId, courseId) => {
  const cart = { accountId, courseId };
  return await http.post(`/carts/delete`, cart);
};

const cartsService = {
  getCart,
  addCart,
  deleteCart,
};

export default cartsService;
