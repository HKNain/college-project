import axios from "axios";

const API = axios.create({
  baseURL: "https://iiit-snp-backend.onrender.com/api/",
  // baseURL: "http://localhost:5000/api/",
  withCredentials: true, 
});

export default API;