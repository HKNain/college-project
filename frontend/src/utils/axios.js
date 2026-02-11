import axios from "axios";

const API = axios.create({
  baseURL: "https://college-project-yjlk.onrender.com/api/",
  withCredentials: true, 
});

export default API;