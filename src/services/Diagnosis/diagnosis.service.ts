import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type { Diagnosis, DiagnosisFormData } from "@/types/Diagnosis.types";

export class DiagnosisService {
  private api: AxiosInstance;

  constructor() {
    const token = localStorage.getItem("accessToken");
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  async getAll(): Promise<Diagnosis[]> {
    try {
      const response = await this.api.get("/diagnoses");
      const apiData = response.data?.data ?? [];
      return (apiData as any[]).map((item) => this.mapApiDiagnosis(item));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOne(id: number | string): Promise<Diagnosis> {
    try {
      const response = await this.api.get(`/diagnoses/${id}`);
      return this.mapApiDiagnosis(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(payload: DiagnosisFormData): Promise<Diagnosis> {
    try {
      const response = await this.api.post("/diagnoses", payload);
      return this.mapApiDiagnosis(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number | string, payload: Partial<DiagnosisFormData>): Promise<Diagnosis> {
    try {
      // Only send fields that have been changed (not undefined/null/empty)
      const updatePayload = Object.entries(payload).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const response = await this.api.patch(`/diagnoses/${id}`, updatePayload);
      return this.mapApiDiagnosis(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async remove(id: number | string): Promise<void> {
    try {
      await this.api.delete(`/diagnoses/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private mapApiDiagnosis(apiDiagnosis: any): Diagnosis {
    if (!apiDiagnosis) {
      throw new Error("Invalid diagnosis data received from server");
    }

    return {
      id: String(apiDiagnosis.id ?? apiDiagnosis.code ?? ""),
      code: String(apiDiagnosis.code ?? ""),
      name: apiDiagnosis.name ?? "",
      description: apiDiagnosis.description ?? "",
      clusterId:
        apiDiagnosis.clusterId ??
        apiDiagnosis.cluster_id ??
        apiDiagnosis.cluster?.id ??
        undefined,
      createdAt: apiDiagnosis.createdAt,
      updatedAt: apiDiagnosis.updatedAt,
    };
  }

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

export const diagnosisService = new DiagnosisService();
