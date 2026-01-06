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

  // 🔁 FORGOT PASSWORD
  async forgotPassword(payload: {
    email: string;
  }) {
    try {
      const response = await this.api.post(
        "/auth/forgot-password",
        payload
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ✅ VERIFY EMAIL
  async verifyEmail(payload: {
    email: string;
    code: string;
  }) {
    try {
      const response = await this.api.post(
        "/auth/verify-email",
        payload
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // 🚪 LOGOUT (NO API CALL)
  async logout() {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch (error) {
      // Log error but don't throw - logout should always succeed
      console.error("Error during logout:", error);
    }
  }

  // 👤 GET STORED USER
  getCurrentUser() {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      // If parsing fails, clear corrupted data
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      return null;
    }
  }

  /**
   * Handle API errors and format them for the application
   */
  private handleError(error: unknown): Error {
    // Check if it's an Axios error
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      
      // Server responded with error status
      if (axiosError.response) {
        const message = 
          axiosError.response.data?.message || 
          axiosError.response.data?.error || 
          axiosError.message || 
          "An error occurred";
        
        const customError = new Error(message);
        (customError as any).status = axiosError.response.status;
        (customError as any).data = axiosError.response.data;
        return customError;
      }
      
      // Request was made but no response received
      if (axiosError.request) {
        return new Error("Network error. Please check your connection.");
      }
    }
    
    // Handle other types of errors
    if (error instanceof Error) {
      return error;
    }
    
    // Unknown error type
    return new Error("An unexpected error occurred");
  }
}

export const authService = new AuthService();
