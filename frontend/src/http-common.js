import axios from "axios";

// connection to the backend using axios
export default axios.create({

  // baseURL: "http://learn4fund.tk:5000/v1/api", //modified,was http://localhost:5000
  baseURL: "http://localhost:5000/v1/api", //modified,was http://localhost:5000
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true, // to send cookies
});
axios.defaults.withCredentials = true; // to send cookies
