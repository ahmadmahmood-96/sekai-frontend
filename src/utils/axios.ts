import axios from "axios";

// Create an Axios instance with a base URL
const client = axios.create({
  baseURL: `http://localhost:3001/`, // Base URL for the API
  headers: {
    "Content-Type": "application/json", // Default content type
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress console error logs for requests that fail
    return Promise.reject(error); // Continue to propagate the error if needed
  }
);

export default client;
