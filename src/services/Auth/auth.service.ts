import axios from "axios";
import type { AxiosInstance } from "axios";

export class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // 🔐 LOGIN
  async login(payload: {
    email: string;
    password: string;
  }) {
    const response = await this.api.post("/auth/login", payload);

    // assuming backend returns token & user
    const { accessToken, user } = response.data;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  }

  // 🔁 FORGOT PASSWORD
  async forgotPassword(payload: {
    email: string;
  }) {
    const response = await this.api.post(
      "/auth/forgot-password",
      payload
    );
    return response.data;
  }

  // ✅ VERIFY EMAIL
  async verifyEmail(payload: {
    email: string;
    code: string;
  }) {
    const response = await this.api.post(
      "/auth/verify-email",
      payload
    );
    return response.data;
  }

  // 🚪 LOGOUT (NO API CALL)
  async logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  // 👤 GET STORED USER
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}
