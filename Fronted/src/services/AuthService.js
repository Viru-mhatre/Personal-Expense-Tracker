
import api from "./API";

// REGISTER
export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("email", response.data.email);
    localStorage.setItem("name", response.data.name);

    return response.data;
};

// LOGIN
export const loginUser = async (loginData) => {
    const response = await api.post("/auth/login", loginData);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("email", response.data.email);
    localStorage.setItem("name", response.data.name);

    return response.data;
};

// LOGOUT
export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
};
