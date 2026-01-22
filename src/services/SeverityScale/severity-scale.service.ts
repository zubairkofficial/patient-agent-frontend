import axios from "axios";
import type { AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type { SeverityScale, SeverityScaleFormData, CreateSeverityScaleDto } from "@/types/SeverityScale.types";

export class SeverityScaleService {
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
      }
    );
  }

  /**
   * Normalize severity scale data from API
   */
  private normalizeSeverityScale(scale: any): SeverityScale {
    return {
      id: String(scale.id),
      name: scale.name || "",
      symptomId: scale.symptomId,
      details: scale.details || {},
    };
  }

  /**
   * Get all severity scales
   */
  async getAll(): Promise<SeverityScale[]> {
    try {
      const response = await this.api.get("/severity-scales");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map((scale: any) => this.normalizeSeverityScale(scale));
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a single severity scale by ID
   */
  async getById(id: string | number): Promise<SeverityScale> {
    try {
      const response = await this.api.get(`/severity-scales/${id}`);
      if (response.data.success) {
        return this.normalizeSeverityScale(response.data.data);
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get severity scales by symptom ID
   */
  async getBySymptomId(symptomId: string | number): Promise<SeverityScale[]> {
    try {
      const response = await this.api.get(`/severity-scales/by-symptom/${symptomId}`);
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map((scale: any) => this.normalizeSeverityScale(scale));
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new severity scale
   * Requires name and symptomId fields for creation
   */
  async create(createData: CreateSeverityScaleDto): Promise<SeverityScale> {
    try {
      // Validate required fields
      if (!createData.name?.trim()) {
        throw new Error("Severity scale name is required");
      }
      if (!createData.symptomId) {
        throw new Error("Symptom is required");
      }

      // Send name, symptomId, and details (if provided)
      const payload: any = {
        name: createData.name.trim(),
        symptomId: createData.symptomId,
      };

      if (createData.details) {
        payload.details = createData.details;
      }

      const response = await this.api.post("/severity-scales", payload);
      if (response.data.success && response.data.data) {
        return this.normalizeSeverityScale(response.data.data);
      }
      throw new Error(response.data.message || "Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update an existing severity scale
   */
  async update(
    id: string | number,
    updateData: Partial<SeverityScaleFormData>
  ): Promise<SeverityScale> {
    try {
      // Only send fields that have been changed (not undefined/null/empty)
      const updatePayload = Object.entries(updateData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          // For arrays, check if it's not empty
          if (Array.isArray(value)) {
            if (value.length > 0) {
              acc[key] = value;
            }
          } else if (typeof value === "string" && value !== "") {
            acc[key] = value;
          } else if (typeof value === "object" && value !== null) {
            acc[key] = value;
          } else if (typeof value !== "string") {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as Record<string, any>);

      const response = await this.api.patch(`/severity-scales/${id}`, updatePayload);
      if (response.data.success) {
        return this.normalizeSeverityScale(response.data.data);
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a severity scale
   */
  async delete(id: string | number): Promise<void> {
    try {
      await this.api.delete(`/severity-scales/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.statusText || error.message;
      const status = error.response?.status;
      
      // Log detailed error info for debugging
      console.error("SeverityScale API Error:", {
        status,
        message,
        data: error.response?.data,
        config: error.config?.url
      });

      return new Error(`API Error (${status}): ${message}`);
    }
    
    console.error("SeverityScale Error:", error);
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }
}

// Export singleton instance
export const severityScaleService = new SeverityScaleService();
