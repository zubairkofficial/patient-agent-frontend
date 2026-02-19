import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";
import type {
  PatientProfile,
  PatientProfileResponse,
  GeneratePatientProfileDto,
  SavePatientProfileDto,
  RegeneratePatientProfileDto,
} from "@/types/PatientProfile.types";

export class PatientProfileService {
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
   * Generate a patient profile based on a diagnosis
   */
  async generate(
    diagnosis_id: number,
    course_id: number,
    instruction?: string,
  ): Promise<PatientProfileResponse> {
    try {
      const response = await this.api.post("/patient-profiles/generate", {
        diagnosis_id,
        course_id,
        instruction,
      });
      // Return raw data from server (no parsing)
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get list of patient profiles (admin)
   */
  async findAll(): Promise<PatientProfile[]> {
    try {
      const response = await this.api.get("/patient-profiles");
      return response.data?.data ?? [];
    } catch (error) {
      console.log(error);
      throw this.handleError(error);
    }
  }

  /**
   * Get a single patient profile by id
   */
  async findOne(id: number | string): Promise<PatientProfile> {
    try {
      const response = await this.api.get(`/patient-profiles/${id}`);
      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Remove (soft) a patient profile
   */
  async remove(id: number | string): Promise<void> {
    try {
      await this.api.delete(`/patient-profiles/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Save or unsave a patient profile
   */
  async saveProfile(
    id: number | string,
    save: boolean,
  ): Promise<PatientProfile> {
    try {
      const response = await this.api.post(
        `/patient-profiles/${id}/save-profile`,
        {
          save,
        },
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Regenerate a patient profile with instruction
   */
  async regenerateProfile(
    id: number | string,
    instruction?: string,
  ): Promise<PatientProfileResponse> {
    try {
      const response = await this.api.post(
        `/patient-profiles/${id}/regenerate`,
        {
          instruction,
        },
      );
      // Return raw data from server (no parsing)
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

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

export const patientProfileService = new PatientProfileService();
