import axios from "axios";

// connection to the backend using axios
export default axios.create({
    baseURL: "http://localhost:5000/api/v1/courses",
    headers: {
        "Content-type": "application/json"
    }
});