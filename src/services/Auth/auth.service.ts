import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import { BASE_URL } from "@/utils/global.utils";

// Mock admin credentials (for development/testing only)
const MOCK_ADMIN_CREDENTIALS = {
  email: "admin@patientagent.com",
  password: "admin123",
};

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
      // Check for mock admin credentials (development/testing only)
      if (
        payload.email === MOCK_ADMIN_CREDENTIALS.email &&
        payload.password === MOCK_ADMIN_CREDENTIALS.password
      ) {
        // Mock admin login - no API call needed
        const mockAdminToken = `mock_admin_token_${Date.now()}`;
        const mockAdminUser = {
          id: "admin_1",
          email: MOCK_ADMIN_CREDENTIALS.email,
          firstName: "Admin",
          lastName: "User",
          role: "admin",
        };

        localStorage.setItem("accessToken", mockAdminToken);
        localStorage.setItem("user", JSON.stringify(mockAdminUser));
        localStorage.setItem("userRole", "admin");

        return {
          success: true,
          message: "Admin login successful",
          data: {
            accessToken: mockAdminToken,
            user: mockAdminUser,
          },
        };
      }

      // Regular user login - make API call
      const response = await this.api.post("/auth/login", payload);
      const { data } = response.data;
      const { accessToken, user } = data || {};
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        // Store user role if available
        if (user.role) {
          localStorage.setItem("userRole", user.role);
        }
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

  // 🚪 LOGOUT (NO API CALL)
  async logout() {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
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

  // 🔐 GET USER ROLE
  getUserRole(): string | null {
    try {
      return localStorage.getItem("userRole");
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  }

  // 🔐 CHECK IF USER IS ADMIN
  isAdmin(): boolean {
    return this.getUserRole() === "admin";
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
