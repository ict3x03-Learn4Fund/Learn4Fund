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
  return response.data;
};

// Add donation
const addDonation = async (accountId, amount, showDonation) => {
  const donation = { accountId, amount, showDonation };
  // Making calls to server side
  const response = await http.post("/donations/add", donation);

  return response.data;
};

// Client side functions
const donationsService = {
  getDonations,
  getTotal,
  addDonation,
};

export default donationsService;
