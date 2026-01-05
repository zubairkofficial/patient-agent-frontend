import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import { BASE_URL } from "@/utils/global.utils";

export class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async register(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const response = await this.api.post("/auth/register", payload);

      const { data } = response.data;
      const { user } = data || {};

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(payload: {
    email: string;
    password: string;
  }) {
    try {
      const response = await this.api.post("/auth/login", payload);

      const { data } = response.data;
      const { accessToken } = data || {};

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendOTP(payload: {
    email: string;
  }) {
    try {
      const response = await this.api.post("/auth/send-otp", payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyOTP(payload: {
    email: string;
    otp: string;
  }) {
    try {
      const response = await this.api.post("/auth/verify-otp", payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) {
    try {
      const response = await this.api.post("/auth/change-password", payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(payload: {
    email: string;
  }) {
    try {
      const response = await this.api.post("/auth/forgot-password", payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyEmail(payload: {
    email: string;
    otp: string;
  }) {
    try {
      const response = await this.api.post("/auth/verify-email", payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  getCurrentUser() {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      return null;
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ 
        message?: string; 
        error?: string;
        statusCode?: number;
      }>;
      
      if (axiosError.response) {
        const responseData = axiosError.response.data as any;
        const message = 
          responseData?.message || 
          responseData?.error || 
          axiosError.message || 
          "An error occurred";
        
        const customError = new Error(message);
        (customError as any).status = axiosError.response.status;
        (customError as any).statusCode = responseData?.statusCode || axiosError.response.status;
        (customError as any).data = axiosError.response.data;
        return customError;
      }
      
      if (axiosError.request) {
        return new Error("Network error. Please check your connection.");
      }
    }
    
    if (error instanceof Error) {
      return error;
    }
    
    return new Error("An unexpected error occurred");
  }
}

export const authService = new AuthService();
