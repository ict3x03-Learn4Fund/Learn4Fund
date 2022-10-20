import axios from "axios";

// connection to the backend using axios
export default axios.create({
    baseURL: "http://localhost:5000/v1/api",
    headers: {
        "Content-type": "application/json"
    },
    withCredentials: true     // to send cookies
});
axios.defaults.withCredentials = true; // to send cookies