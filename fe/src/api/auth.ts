import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api';

const login = async (username:string, password:string) => {
    await axios.post(`${API_BASE_URL}/members/login`, {
        username,
        password
    })
}
export {login};
