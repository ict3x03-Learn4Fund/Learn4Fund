import http from "../http-common";

const getCart = async (accountId) => {
  const response = await http.get(`/carts/${accountId}`);
  return response;
};

const addCart = async (accountId, courseId, quantity) => {
  const cartItem = { courseId, quantity };
  const cart = { accountId, cartItem };
  const response = await http.post(`/carts/add/${accountId}`, cart);
  return response;
};

const deleteCart = async (accountId, courseId) => {
  const cart = { accountId, courseId };
  return await http.post(`/carts/delete/${accountId}`, cart);
};

const getTotal = async (accoundId) => {
  return await http.get(`/carts/${accoundId}/totalNo`);
}

const addDonationToCart = async (accountId, donationAmt, showDonation) => {
  const cart = { accountId, donationAmt, showDonation };
  return await http.post(`/carts/addDonation/${accountId}`, cart);
}

const clearDonationsInCart = async (accoundId) => {
  return await http.get(`/carts/clearDonation/${accoundId}`)
}

const cartsService = {
  getCart,
  addCart,
  deleteCart,
  getTotal,
  addDonationToCart,
  clearDonationsInCart
};

export default cartsService;
