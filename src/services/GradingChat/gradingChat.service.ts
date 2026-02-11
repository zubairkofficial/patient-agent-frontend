import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { BASE_URL } from "@/utils/global.utils";

export interface AgentChatDTO {
	content: string;
	gradingChatId: number;
}

export class GradingChatService {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: BASE_URL,
			headers: {
				"Content-Type": "application/json",
			},
		});

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

	async getChatsByPatientProfile(patientProfileId: number): Promise<any[]> {
		try {
			const response = await this.api.get(`/grading-chat/chats/${patientProfileId}`);
			const apiData = response.data?.data ?? [];
			return Array.isArray(apiData) ? apiData : [];
		} catch (error) {
			throw this.handleError(error);
		}
	}

	async chatAgent(payload: AgentChatDTO): Promise<any> {
		try {
			const response = await this.api.post(`/grading-chat/chat-agent`, payload);
			return response.data?.data ?? response.data;
		} catch (error) {
			throw this.handleError(error);
		}
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

export const gradingChatService = new GradingChatService();

