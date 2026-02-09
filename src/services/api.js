import axios from "axios";

const api = axios.create({
  baseURL: "http://api-farmacia.test/api",
  headers: {
    "x-api-key": "vz1M5Pk1zhn0AnOtTMwxT0TwQbTco48VcK1zffQmmyHgRaCXQg9Rp41YvGpq",
    "Content-Type": "application/json",
  },
});

export default api;
