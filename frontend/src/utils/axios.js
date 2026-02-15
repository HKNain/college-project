import axios from "axios";

const API = axios.create({
  // baseURL: "https://college-project-yjlk.onrender.com/api/",
  baseURL: "http://localhost:5000/api/",
  withCredentials: true, 
});

export default API;