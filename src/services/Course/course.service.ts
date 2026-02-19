import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";

export interface CreateCourseDto {
  name: string;
  description: string;
  classId: number;
}

export interface UpdateCourseDto {
  name?: string;
  description?: string;
  classId?: number;
}

export class CourseService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Attach JWT automatically
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
  async create(payload: CreateCourseDto): Promise<any> {
    try {
      const response = await this.api.post(`/courses/`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // GET ALL (ADMIN)
  async findAll(): Promise<any> {
    try {
      const response = await this.api.get(`/courses/`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // GET BY ID (ADMIN)
  async findOne(id: number): Promise<any> {
    try {
      const response = await this.api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // GET BY CLASS (USER)
  async findByClass(classId: number): Promise<any> {
    try {
      const response = await this.api.get(`/courses/get-by-class/${classId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // UPDATE (USER)
  async update(id: number, payload: UpdateCourseDto): Promise<any> {
    try {
      const response = await this.api.patch(`/courses/${id}`, payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // DELETE (USER)
  async remove(id: number): Promise<any> {
    try {
      const response = await this.api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Centralized Error Handler
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

export const courseService = new CourseService();
