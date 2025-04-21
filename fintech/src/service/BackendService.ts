import axios from "axios";

const server: string = import.meta.env.VITE_SERVER_URL + "/api";

interface UserRegistrationData {
    username: string;
    email: string;
    password: string;
}

// Register User
export const sendUserRegistrationData = async (userData: UserRegistrationData) => {
  try {
    const response = await axios.post(`${server}/register`, userData);
    return response.data;

  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Registration Failed");
  }
};

interface UserLoginData {
    username: string;
    password: string;
}

// Login User
export const sendUserLoginData = async (loginData: UserLoginData) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", loginData.username);
    formData.append("password", loginData.password);

    const response = await axios.post(`${server}/login`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;

  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Login Failed");
  }
};
