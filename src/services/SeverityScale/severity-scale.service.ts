import axios from "axios";
import type { AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type { SeverityScale, SeverityScaleFormData, CreateSeverityScaleDto } from "@/types/SeverityScale.types";

export class SeverityScaleService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
    });

    // Attach auth token from localStorage to every request if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Always send JSON
      config.headers["Content-Type"] = "application/json";

      return config;
    });
  }

  /**
   * Normalize severity scale data from API
   */
  private normalizeSeverityScale(scale: any): SeverityScale {
    return {
      id: String(scale.id),
      name: scale.name || "",
      description: scale.description || undefined,
      levels: Array.isArray(scale.levels) ? scale.levels : [],
      symptomId: scale.symptomId,
      symptom: scale.symptom
        ? {
            id: scale.symptom.id,
            code: scale.symptom.code,
            name: scale.symptom.name,
            description: scale.symptom.description,
          }
        : undefined,
      details: scale.details
        ? {
            levels: Array.isArray(scale.details.levels) ? scale.details.levels : undefined,
            ranges: scale.details.ranges
              ? {
                  min: scale.details.ranges.min,
                  max: scale.details.ranges.max,
                }
              : undefined,
            // Preserve any additional properties
            ...(Object.keys(scale.details).reduce((acc, key) => {
              if (key !== "levels" && key !== "ranges") {
                acc[key] = scale.details[key];
              }
              return acc;
            }, {} as any)),
          }
        : undefined,
      createdAt: scale.createdAt,
      updatedAt: scale.updatedAt,
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
      const response = await this.api.patch(`/severity-scales/${id}`, updateData);
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
