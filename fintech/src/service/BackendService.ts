import axios from "axios";
import toast from "react-hot-toast";

const server: string = import.meta.env.VITE_SERVER_URL + "/api";

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

// Register User
export const sendUserRegistrationData = async (
  userData: UserRegistrationData
) => {
  try {
    const response = await axios.post(`${server}/auth/register`, userData);
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Registration Failed");
  }
};

export interface UserLoginData {
  username: string;
  password: string;
  mode: string;
}

// Login User
export const sendUserLoginData = async (loginData: UserLoginData) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", loginData.username);
    formData.append("password", loginData.password);

    const response = await axios.post(`${server}/auth/login?mode=${loginData.mode}`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error: any) {
    toast.error( error.response?.data?.detail || "Login Failed")
    return null;
  }
};


// Token Validation
export const validateTokenUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("No Token Found. Please log in Again.");
    return null;
  }

  try {
    const response = await axios.get(`${server}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;

  } catch (error) {
    toast.error("Session Expired or Invalid Token. Please log in Again.");

    localStorage.removeItem("token");
    return null;
  }
};