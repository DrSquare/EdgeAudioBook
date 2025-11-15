/**
 * API client service for EdgeAudioBook backend
 */
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import {
  UploadResponse,
  JobStatus,
  AudioGenerationRequest,
  AudioGenerationResponse,
  AudioStatus,
  HealthResponse,
  ApiError
} from '../types';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handler
const handleApiError = (error: AxiosError<ApiError>): never => {
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // Request made but no response
    throw new Error('Unable to connect to server. Please ensure the backend is running.');
  } else {
    // Error in request setup
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

/**
 * Health check
 */
export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

/**
 * Upload file for text extraction
 */
export const uploadFile = async (file: FormData): Promise<UploadResponse> => {
  try {
    const response = await apiClient.post<UploadResponse>('/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

/**
 * Get job status for text extraction
 */
export const getJobStatus = async (jobId: string): Promise<JobStatus> => {
  try {
    const response = await apiClient.get<JobStatus>(`/status/${jobId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

/**
 * Generate audio from text
 */
export const generateAudio = async (
  request: AudioGenerationRequest
): Promise<AudioGenerationResponse> => {
  try {
    const response = await apiClient.post<AudioGenerationResponse>('/generate-audio', request);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

/**
 * Get audio generation status
 */
export const getAudioStatus = async (audioId: string): Promise<AudioStatus> => {
  try {
    const response = await apiClient.get<AudioStatus>(`/audio-status/${audioId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

/**
 * Get download URL for audio file
 */
export const getDownloadUrl = (audioId: string): string => {
  return `${API_BASE_URL}/download/${audioId}`;
};

/**
 * Cleanup resource
 */
export const cleanupResource = async (resourceId: string): Promise<void> => {
  try {
    await apiClient.delete(`/cleanup/${resourceId}`);
  } catch (error) {
    return handleApiError(error as AxiosError<ApiError>);
  }
};

export default {
  checkHealth,
  uploadFile,
  getJobStatus,
  generateAudio,
  getAudioStatus,
  getDownloadUrl,
  cleanupResource
};
