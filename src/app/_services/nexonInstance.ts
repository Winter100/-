import axios from "axios";

const base = "https://open.api.nexon.com";
const game = "heroes";
const version = "v2";

const baseURL = `${base}/${game}/${version}`;

export const nexonInstance = axios.create({
  baseURL,
  method: "GET",
  headers: {
    "x-nxopen-api-key": process.env.NEXT_PUBLIC_API_KEY as string,
  },
});
