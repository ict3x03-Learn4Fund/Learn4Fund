import http from "../http-common";

// class that handles the calling of different api service
// get donations from all users
const getDonations = async () => {
  // Making calls to server side
  const response = await http.get("/donations");
  return response.data;
};

// Get total amount of donation
const getTotal = async () => {
  // Making calls to server side
  const response = await http.get("/donations/total");
  return response;
};

// Add donation
const addDonation = async (accountId, amount, showDonation) => {
  const donation = { accountId, amount, showDonation };
  // Making calls to server side
  const response = await http.post("/donations/add", donation);

  return response.data;
};

// get top 5 donors
const getTop5 = async () => {
  return await http.get("/donations/getTop5")
}

// get top 10 recent donors
const getTop10 = async () => {
  return await http.get("/donations/topRecent")
}

// Client side functions
const donationsService = {
  getDonations,
  getTotal,
  addDonation,
  getTop5,
  getTop10,
};

export default donationsService;
