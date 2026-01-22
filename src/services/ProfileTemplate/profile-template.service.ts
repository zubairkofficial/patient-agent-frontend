import axios from "axios";
import type { AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type {
  ProfileTemplate,
  CreateProfileTemplateDto,
  UpdateProfileTemplateDto,
  Diagnosis,
  Symptom,
  SeverityScale,
  Operation,
} from "@/types/ProfileTemplate.types";

export class ProfileTemplateService {
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
   * Get all profile templates
   */
  async getAll(): Promise<ProfileTemplate[]> {
    try {
      const response = await this.api.get("/profile-templates");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get profile template by ID
   */
  async getById(id: string | number): Promise<ProfileTemplate> {
    try {
      const response = await this.api.get(`/profile-templates/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new profile template
   */
  async create(
    createDto: CreateProfileTemplateDto
  ): Promise<ProfileTemplate> {
    try {
      const response = await this.api.post("/profile-templates", createDto);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update profile template
   */
  async update(
    id: string | number,
    updateDto: UpdateProfileTemplateDto
  ): Promise<ProfileTemplate> {
    try {
      const response = await this.api.patch(
        `/profile-templates/${id}`,
        updateDto
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete profile template
   */
  async delete(id: string | number): Promise<void> {
    try {
      const response = await this.api.delete(`/profile-templates/${id}`);
      if (!response.data.success) {
        throw new Error("Failed to delete profile template");
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all diagnoses
   */
  async getDiagnoses(): Promise<Diagnosis[]> {
    try {
      const response = await this.api.get("/diagnosis");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all symptoms
   */
  async getSymptoms(): Promise<Symptom[]> {
    try {
      const response = await this.api.get("/symptoms");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get severity scales for a specific symptom
   */
  async getSeverityScalesBySymptom(
    symptomId: string | number
  ): Promise<SeverityScale[]> {
    try {
      const response = await this.api.get(
        `/severity-scales?symptomId=${symptomId}`
      );
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all severity scales
   */
  async getAllSeverityScales(): Promise<SeverityScale[]> {
    try {
      const response = await this.api.get("/severity-scales");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all operations
   */
  async getOperations(): Promise<Operation[]> {
    try {
      const response = await this.api.get("/operations");
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "An error occurred";
      return new Error(message);
    }
    return error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }
}

export const profileTemplateService = new ProfileTemplateService();
