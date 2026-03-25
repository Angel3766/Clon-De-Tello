import axios from 'axios'

const API = axios.create({
  baseURL: 'http://192.168.58.119:8000/api'
})

export default API