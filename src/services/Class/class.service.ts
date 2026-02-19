import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";

export interface CreateClassDto {
  name: string;
}

export interface UpdateClassDto {
  name: string;
}

export class ClassService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach JWT token automatically
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  // CREATE (ADMIN)
  async create(payload: CreateClassDto): Promise<any> {
    try {
      const response = await this.api.post(`/classes/`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // GET ALL (ADMIN)
  async findAll(): Promise<any> {
    try {
      const response = await this.api.get(`/classes/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // GET BY ID (ADMIN)
  async findOne(id: number): Promise<any> {
    try {
      const response = await this.api.get(`/classes/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // UPDATE (ADMIN)
  async update(id: number, payload: UpdateClassDto): Promise<any> {
    try {
      const response = await this.api.patch(`/classes/${id}`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE (ADMIN)
  async remove(id: number): Promise<any> {
    try {
      const response = await this.api.delete(`/classes/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Centralized error handling
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

export const classService = new ClassService();
