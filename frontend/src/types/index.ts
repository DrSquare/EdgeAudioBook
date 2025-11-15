/**
 * TypeScript type definitions for EdgeAudioBook
 */

export interface UploadResponse {
  job_id: string;
  status: string;
  message: string;
  created_at: string;
}

export interface JobStatus {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  extracted_text?: string;
  word_count?: number;
  confidence_score?: number;
  error?: string;
  message?: string;
}

export interface AudioGenerationRequest {
  text: string;
  voice?: 'male' | 'female';
  speed?: number;
  format?: 'mp3' | 'wav';
}

export interface AudioGenerationResponse {
  audio_id: string;
  status: string;
  estimated_time: number;
  message: string;
}

export interface AudioStatus {
  audio_id: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  progress: number;
  file_url?: string;
  file_size?: number;
  duration?: number;
  format?: string;
  error?: string;
  message?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
}
