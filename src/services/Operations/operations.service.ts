import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type { Symptom, SymptomFormData } from "@/types/Symptom.types";

export class OperationsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include token on every request
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  async getAll(): Promise<Symptom[]> {
    try {
      const response = await this.api.get("/operations");
      const apiData = response.data?.data ?? [];

      return apiData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors and format them for the application
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: string;
      }>;

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

export const operationsService = new OperationsService();
