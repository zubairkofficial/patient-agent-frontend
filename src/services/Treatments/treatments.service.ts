import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type { Treatment, TreatmentFormData } from "@/types/Treatment.types";

export class TreatmentsService {
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

  async getAll(): Promise<Treatment[]> {
    try {
      const response = await this.api.get("/treatments");
      const apiData = response.data?.data ?? [];
      return (apiData as any[]).map((item) => this.mapApiTreatment(item));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOne(id: number | string): Promise<Treatment> {
    try {
      const response = await this.api.get(`/treatments/${id}`);
      return this.mapApiTreatment(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(payload: TreatmentFormData): Promise<Treatment> {
    try {
      const response = await this.api.post("/treatments", payload);
      return this.mapApiTreatment(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number | string, payload: TreatmentFormData): Promise<Treatment> {
    try {
      const response = await this.api.patch(`/treatments/${id}`, payload);
      return this.mapApiTreatment(response.data?.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async remove(id: number | string): Promise<void> {
    try {
      await this.api.delete(`/treatments/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private mapApiTreatment(apiTreatment: any): Treatment {
    if (!apiTreatment) {
      throw new Error("Invalid treatment data received from server");
    }

    return {
      id: String(apiTreatment.id ?? apiTreatment.code ?? ""),
      code: String(apiTreatment.code ?? ""),
      name: apiTreatment.name ?? "",
      description: apiTreatment.description ?? "",
      diagnosisId:
        apiTreatment.diagnosisId ??
        apiTreatment.diagnosis_id ??
        apiTreatment.diagnosis?.id ??
        undefined,
      clusterId:
        apiTreatment.clusterId ??
        apiTreatment.cluster_id ??
        apiTreatment.cluster?.id ??
        undefined,
      createdAt: apiTreatment.createdAt,
      updatedAt: apiTreatment.updatedAt,
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

export const treatmentsService = new TreatmentsService();
