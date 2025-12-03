import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const login = async (usernameOrEmail: string, password: string) => {
  await axios.post(`${API_BASE_URL}/members/login`, {
    // Backend expects `username`; pass email as username if needed
    username: usernameOrEmail,
    password,
  });
};

const register = async (payload: { username: string; email: string; password: string }) => {
  await axios.post(`${API_BASE_URL}/members/register`, payload);
};

export { login, register };
