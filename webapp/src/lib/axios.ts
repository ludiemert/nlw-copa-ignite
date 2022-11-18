  import axios from "axios";

  //passo a url que nao muda na chamada http
  export const api = axios.create({
    baseURL: 'http://localhost:3333'
  })