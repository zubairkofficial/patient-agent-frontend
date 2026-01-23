import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type { Operation } from "@/types/ProfileTemplate.types";

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

  /**
   * Format enum value to user-friendly name
   * Converts "OPERATION_NAME" to "Operation Name"
   */
  private formatOperationName(enumValue: string): string {
    return enumValue
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Normalize operation data from API
   * The backend returns enum values which need to be transformed into Operation objects
   */
  private normalizeOperation(operation: any, index: number): Operation {
    // If it's already an object with id, name, code, return as is
    if (typeof operation === 'object' && operation !== null) {
      return {
        id: operation.id ?? index + 1,
        name: operation.name || operation.value || String(operation),
        code: operation.code,
      };
    }
    
    // If it's a string (enum value), create an Operation object
    if (typeof operation === 'string') {
      const formattedName = this.formatOperationName(operation);
      return {
        id: index + 1,
        name: formattedName,
        code: operation,
      };
    }
    
    // Fallback
    const stringValue = String(operation);
    return {
      id: index + 1,
      name: this.formatOperationName(stringValue),
      code: stringValue,
    };
  }

  async getAll(): Promise<Operation[]> {
    try {
      const response = await this.api.get("/operations");
      
      let operationsData: any[] = [];
      
      // Handle response structure: { success: true, data: [...] }
      if (response.data?.success && Array.isArray(response.data.data)) {
        operationsData = response.data.data;
      } else if (Array.isArray(response.data?.data)) {
        operationsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        operationsData = response.data;
      }
      
      // Normalize enum values into Operation objects
      return operationsData.map((op, index) => this.normalizeOperation(op, index));
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
