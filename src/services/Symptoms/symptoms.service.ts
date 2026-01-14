import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type { Symptom, SymptomFormData } from "@/types/Symptom.types";

export class SymptomsService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
    });

    // Attach auth token from localStorage to every request if available
    this.api.interceptors.request.use((config) => {
      if (!config.headers) {
        config.headers = {};
      }

      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      // Always send JSON
      config.headers["Content-Type"] = "application/json";

      return config;
    });
  }

  /**
   * Ensure backend-required fields (code, label) are present.
   * Code comes from user input when provided, otherwise a slugified version of the name.
   * Label mirrors name for backward compatibility with older API shapes.
   */
  private buildPayload(payload: SymptomFormData) {
    const name = payload.name?.trim() ?? "";
    const rawCode = payload.code?.trim();

    const fallbackCode = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .slice(0, 100); // keep code reasonable length

    const code = rawCode || fallbackCode;

    return {
      ...payload,
      code,
      // Some older API versions expect `label`; keep sending it
      label: name || payload.code,
    };
  }

  /**
   * Fetch all symptoms
   * Backend response shape (from NestJS service):
   * { success: boolean; message: string; data: Symptom[] }
   */
  async getAll(): Promise<Symptom[]> {
    try {
      const response = await this.api.get("/symptoms");
      const apiData = response.data?.data ?? [];

      return (apiData as any[]).map((item) => this.mapApiSymptom(item));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Fetch single symptom by id
   */
  async getOne(id: number | string): Promise<Symptom> {
    try {
      const response = await this.api.get(`/symptoms/${id}`);
      const apiSymptom = response.data?.data;
      return this.mapApiSymptom(apiSymptom);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create a new symptom
   */
  async create(payload: SymptomFormData): Promise<Symptom> {
    try {
      const response = await this.api.post("/symptoms", this.buildPayload(payload));
      const apiSymptom = response.data?.data;
      return this.mapApiSymptom(apiSymptom);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update an existing symptom by id
   */
  async update(id: number | string, payload: SymptomFormData): Promise<Symptom> {
    try {
      const response = await this.api.patch(
        `/symptoms/${id}`,
        this.buildPayload(payload)
      );
      const apiSymptom = response.data?.data;
      return this.mapApiSymptom(apiSymptom);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a symptom by id
   */
  async remove(id: number | string): Promise<void> {
    try {
      await this.api.delete(`/symptoms/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Map backend symptom shape to frontend `Symptom` type.
   * This is defensive to handle possible field name differences.
   */
  private mapApiSymptom(apiSymptom: any): Symptom {
    if (!apiSymptom) {
      throw new Error("Invalid symptom data received from server");
    }

    // Extract the numeric ID - backend uses this for validation
    const id = apiSymptom.id ?? apiSymptom.symptomId;
    
    if (!id) {
      throw new Error("Symptom ID is missing from server response");
    }

    // Extract code - used for display and identification
    const code = apiSymptom.code ?? String(apiSymptom.name ?? "");

    return {
      id: String(id),
      code: String(code),
      name: apiSymptom.name ?? apiSymptom.label ?? String(code),
      description: apiSymptom.description ?? "",
      createdAt: apiSymptom.createdAt,
      updatedAt: apiSymptom.updatedAt,
    };
  }

  /**
   * Handle API errors and format them for the application
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;

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

export const symptomsService = new SymptomsService();

