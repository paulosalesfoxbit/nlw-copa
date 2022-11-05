import axios from "axios";

export const api = axios.create({
  // tem que usar o ip fisico
  baseURL: "http://192.168.0.105:3333",
});
