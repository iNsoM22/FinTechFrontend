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

    const response = await axios.post(
      `${server}/auth/login?mode=${loginData.mode}`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Login Failed");
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

export interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: string;
    interval_count: number;
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  prices: StripePrice[];
}

export const getStripeProducts = async (): Promise<StripeProduct[] | null> => {
  try {
    const response = await axios.get<StripeProduct[]>(
      `${server}/plan/products`
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to Fetch Plans");
    return null;
  }
};

// Create Stripe Checkout Session
export const createCheckoutSession = async (
  priceId: string
): Promise<string | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No Token Found. Please log in Again.");
      return null;
    }

    const response = await axios.post(
      `${server}/payment/create-checkout-session`,
      { price_id: priceId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.url;
  } catch (error: any) {
    toast.error(
      error.response?.data?.detail || "Failed to Initiate Stripe Checkout"
    );
    return null;
  }
};

// Check My Active Subscription
export const checkMySubscription = async (): Promise<any | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No Token Found. Please log in Again.");
      return null;
    }

    const response = await axios.get(`${server}/subscriptions/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response.status === 404) {
      toast.error("No Active Subscription Found");
    } else {
      toast.error(
        error.response?.data?.detail || "Failed to Fetch Subscription Info"
      );
    }
    return null;
  }
};

// Get Current Account Balance
export const getCurrentAccountBalance = async (): Promise<any | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No Token Found. Please log in Again.");
      return null;
    }

    const response = await axios.get(`${server}/accounts/balance/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response.status === 404) {
      toast.error("Account Not Found");
    } else {
      toast.error(
        error.response?.data?.detail || "Failed to Fetch Account Balance"
      );
    }
    return null;
  }
};

export interface MoneyTransferData {
  receiverAccountId: string;
  receiverUsername: string;
  transferAmount: number;
}

export const requestMoneyTransfer = async (
  data: MoneyTransferData
): Promise<any | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No Token Found. Please log in again.");
      return null;
    }

    const response = await axios.post(
      `${server}/accounts/transfer`,
      {
        receiver_account_id: data.receiverAccountId,
        receiver_username: data.receiverUsername,
        transfer_amount: data.transferAmount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else {
      toast.error("Transfer Failed. Please try again.");
    }
    return null;
  }
};

export interface GetUserTransactionsParams {
  page?: number;
  date_from?: string;
  date_till?: string;
}

export const getUserTransactions = async ({
  page = 1,
  date_from,
  date_till,
}: GetUserTransactionsParams): Promise<any | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No Token Found. Please Log in Again.");
      return null;
    }

    const offset = (page - 1) * 50;
    const params = new URLSearchParams();

    params.append("limit", "50");
    params.append("offset", offset.toString());
    if (date_from) params.append("date_from", date_from);
    if (date_till) params.append("date_till", date_till);

    const response = await axios.get(`${server}/accounts/transactions`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else {
      toast.error("Failed to fetch transactions. Please try again.");
    }
    return null;
  }
};

export interface FilterSubscriptionsParams {
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
}

export const getAllSubscriptions = async ({
  status,
  start_date,
  end_date,
  page = 1,
}: FilterSubscriptionsParams): Promise<any[] | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No Token Found. Please Log in Again.");
      return null;
    }

    const params = new URLSearchParams();
    const offset = (page - 1) * 50;

    params.append("limit", "50");
    params.append("offset", offset.toString());
    if (status) params.append("status", status);
    if (start_date) params.append("start_date", start_date);
    if (end_date) params.append("end_date", end_date);

    const response = await axios.get(`${server}/subscriptions/filter`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else {
      toast.error("Failed to Fetch Subscriptions. Please Try Later.");
    }
    return null;
  }
};

export interface GetAllUsersParams {
  page?: number;
}

export const getAllUsers = async ({
  page = 1,
}: GetAllUsersParams): Promise<any[] | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No Token Found. Please Log in Again.");
      return null;
    }

    const limit = 50;
    const offset = (page - 1) * limit;

    const response = await axios.get(`${server}/user/all`, {
      params: { limit, offset },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else {
      toast.error("Failed to Fetch Users. Please Try Later.");
    }
    return null;
  }
};

export interface UpdateSubscriptionPayload {
  status?: string;
}

export const updateSubscription = async (
  subscription_id: string,
  data: UpdateSubscriptionPayload
): Promise<any | null> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No Token Found. Please Log in Again.");
      return null;
    }

    const response = await axios.put(
      `${server}/subscriptions/${subscription_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else {
      toast.error("Failed to Update Subscription. Please Try Later.");
    }
    return null;
  }
};
