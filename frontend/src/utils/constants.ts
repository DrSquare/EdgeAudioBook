/**
 * Constants and configuration
 */

// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';

// Polling intervals (in milliseconds)
export const STATUS_POLL_INTERVAL = 2000; // 2 seconds
export const AUDIO_STATUS_POLL_INTERVAL = 2000; // 2 seconds

// File upload constraints
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/bmp',
  'image/tiff',
  'application/pdf'
];

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.pdf'];

// Voice options
export const VOICE_OPTIONS = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' }
];

// Speed options
export const SPEED_OPTIONS = [
  { label: '0.5x (Slow)', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1.0x (Normal)', value: 1.0 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x (Fast)', value: 1.5 },
  { label: '2.0x (Very Fast)', value: 2.0 }
];

// Audio format options
export const FORMAT_OPTIONS = [
  { label: 'MP3', value: 'mp3' },
  { label: 'WAV', value: 'wav' }
];

// Status colors
export const STATUS_COLORS = {
  pending: '#FFA500',
  processing: '#2196F3',
  generating: '#2196F3',
  completed: '#4CAF50',
  failed: '#F44336'
};

// Status text
export const STATUS_TEXT = {
  pending: 'Pending',
  processing: 'Processing',
  generating: 'Generating',
  completed: 'Completed',
  failed: 'Failed'
};
