import axios from "axios";

const api = axios.create({
    baseURL: "https://meerana-ai.uaenorth.cloudapp.azure.com/skillyfy",
});

export default api;
