# API Specification and Input/Output Diagrams
## EdgeAudioBook REST API

### Base URL
```
http://localhost:5000/api
```

### Authentication
Currently no authentication required for local edge device deployment.

---

## API Endpoints

### 1. Health Check

**Endpoint**: `GET /api/health`

**Description**: Check if the API server is running.

**Request**:
```http
GET /api/health HTTP/1.1
Host: localhost:5000
```

**Response**: `200 OK`
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-15T20:43:55.746Z"
}
```

**Diagram**:
```
┌──────────┐                    ┌──────────┐
│  Client  │───GET /health────► │   API    │
│          │◄──200 OK──────────│  Server  │
└──────────┘                    └──────────┘
```

---

### 2. Upload and Process Document

**Endpoint**: `POST /api/upload`

**Description**: Upload an image or PDF document for text extraction.

**Request**:
```http
POST /api/upload HTTP/1.1
Host: localhost:5000
Content-Type: multipart/form-data

file: [binary file data]
```

**Request Parameters**:
- `file` (required): Image file (JPG, PNG, BMP, TIFF) or PDF document
- Maximum file size: 50MB

**Response**: `202 Accepted`
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "message": "Document uploaded successfully and processing started",
  "created_at": "2025-11-15T20:43:55.746Z"
}
```

**Error Response**: `400 Bad Request`
```json
{
  "error": "Invalid file format",
  "message": "Only JPG, PNG, BMP, TIFF, and PDF files are supported",
  "supported_formats": ["jpg", "jpeg", "png", "bmp", "tiff", "pdf"]
}
```

**Diagram**:
```
┌──────────┐                              ┌──────────┐
│  Client  │                              │   API    │
│          │──POST /upload (file)───────► │  Server  │
│          │                              │          │
│          │                              ├─────────┐│
│          │                              │ Process │││
│          │                              │  Image  │││
│          │                              │ Extract │││
│          │                              │  Text   │││
│          │                              ├─────────┘│
│          │◄──202 (job_id, status)──────│          │
└──────────┘                              └──────────┘
```

---

### 3. Get Processing Status

**Endpoint**: `GET /api/status/{job_id}`

**Description**: Check the status of text extraction job.

**Request**:
```http
GET /api/status/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:5000
```

**Response (Processing)**: `200 OK`
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": 45,
  "message": "Extracting text from document..."
}
```

**Response (Completed)**: `200 OK`
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "progress": 100,
  "extracted_text": "This is the extracted text from the document...",
  "word_count": 1250,
  "page_count": 5,
  "confidence_score": 0.95
}
```

**Response (Failed)**: `200 OK`
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "failed",
  "progress": 0,
  "error": "Failed to extract text from image",
  "message": "Image quality too low for text extraction"
}
```

**Diagram**:
```
┌──────────┐                              ┌──────────┐
│  Client  │                              │   API    │
│          │──GET /status/{job_id}──────► │  Server  │
│          │                              │          │
│          │                              ├─────────┐│
│          │                              │  Check  │││
│          │                              │  Job    │││
│          │                              │ Status  │││
│          │                              ├─────────┘│
│          │◄──200 (status, text)────────│          │
└──────────┘                              └──────────┘
```

---

### 4. Generate Audio

**Endpoint**: `POST /api/generate-audio`

**Description**: Convert extracted text to audio (audiobook).

**Request**:
```http
POST /api/generate-audio HTTP/1.1
Host: localhost:5000
Content-Type: application/json

{
  "text": "This is the text to convert to audio...",
  "voice": "female",
  "speed": 1.0,
  "format": "mp3"
}
```

**Request Body**:
```json
{
  "text": "string (required) - Text to convert to audio",
  "voice": "string (optional) - Voice type: 'male' or 'female' (default: 'female')",
  "speed": "number (optional) - Speech rate: 0.5 to 2.0 (default: 1.0)",
  "format": "string (optional) - Audio format: 'mp3' or 'wav' (default: 'mp3')"
}
```

**Response**: `202 Accepted`
```json
{
  "audio_id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "generating",
  "estimated_time": 45,
  "message": "Audio generation started"
}
```

**Error Response**: `400 Bad Request`
```json
{
  "error": "Invalid parameters",
  "message": "Text field is required and cannot be empty"
}
```

**Diagram**:
```
┌──────────┐                              ┌──────────┐
│  Client  │                              │   API    │
│          │──POST /generate-audio──────► │  Server  │
│          │   (text, voice, speed)       │          │
│          │                              ├─────────┐│
│          │                              │  Text   │││
│          │                              │   to    │││
│          │                              │ Speech  │││
│          │                              │ Convert │││
│          │                              ├─────────┘│
│          │◄──202 (audio_id)────────────│          │
└──────────┘                              └──────────┘
```

---

### 5. Get Audio Generation Status

**Endpoint**: `GET /api/audio-status/{audio_id}`

**Description**: Check the status of audio generation.

**Request**:
```http
GET /api/audio-status/660e8400-e29b-41d4-a716-446655440001 HTTP/1.1
Host: localhost:5000
```

**Response (Processing)**: `200 OK`
```json
{
  "audio_id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "generating",
  "progress": 60,
  "message": "Generating audio..."
}
```

**Response (Completed)**: `200 OK`
```json
{
  "audio_id": "660e8400-e29b-41d4-a716-446655440001",
  "status": "completed",
  "progress": 100,
  "file_url": "/api/download/660e8400-e29b-41d4-a716-446655440001",
  "file_size": 2456789,
  "duration": 185,
  "format": "mp3"
}
```

---

### 6. Download Audio File

**Endpoint**: `GET /api/download/{audio_id}`

**Description**: Download the generated audiobook file.

**Request**:
```http
GET /api/download/660e8400-e29b-41d4-a716-446655440001 HTTP/1.1
Host: localhost:5000
```

**Response**: `200 OK`
```http
Content-Type: audio/mpeg
Content-Disposition: attachment; filename="audiobook_660e8400.mp3"
Content-Length: 2456789

[binary audio data]
```

**Error Response**: `404 Not Found`
```json
{
  "error": "Audio file not found",
  "message": "The requested audio file does not exist or has expired"
}
```

**Diagram**:
```
┌──────────┐                              ┌──────────┐
│  Client  │                              │   API    │
│          │──GET /download/{audio_id}──► │  Server  │
│          │                              │          │
│          │                              ├─────────┐│
│          │                              │ Retrieve│││
│          │                              │  Audio  │││
│          │                              │  File   │││
│          │                              ├─────────┘│
│          │◄──200 (audio binary)────────│          │
└──────────┘                              └──────────┘
```

---

### 7. Delete Job/Audio

**Endpoint**: `DELETE /api/cleanup/{resource_id}`

**Description**: Delete uploaded files, extracted text, or generated audio to free up space.

**Request**:
```http
DELETE /api/cleanup/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:5000
```

**Response**: `200 OK`
```json
{
  "message": "Resource deleted successfully",
  "resource_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATION                       │
│                      (React Native + TypeScript)                │
└───────────────┬─────────────────────────────────────────────────┘
                │
                │ 1. POST /api/upload (image/PDF)
                ▼
┌───────────────────────────────────────────────────────────────────┐
│                         FLASK API SERVER                          │
├───────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Upload    │  │   Vision     │  │     OCR      │            │
│  │  Handler    │─►│   Model      │─►│   Engine     │            │
│  └─────────────┘  │ (Liquid.ai)  │  │ (Tesseract)  │            │
│                   └──────────────┘  └──────────────┘            │
│                          │                   │                    │
│                          ▼                   ▼                    │
│                   ┌──────────────────────────┐                   │
│                   │   Text Extraction        │                   │
│                   │   Job Manager            │                   │
│                   └──────────────────────────┘                   │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             │ 2. GET /api/status/{job_id}
                             │    (polling for completion)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATION                       │
│                   Display extracted text for review             │
│                   User can edit text if needed                  │
└───────────────┬─────────────────────────────────────────────────┘
                │
                │ 3. POST /api/generate-audio
                │    (text, voice, speed preferences)
                ▼
┌───────────────────────────────────────────────────────────────────┐
│                         FLASK API SERVER                          │
├───────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Audio     │  │     TTS      │  │    Audio     │            │
│  │  Generator  │─►│   Engine     │─►│   Encoder    │            │
│  └─────────────┘  │  (pyttsx3)   │  │   (MP3/WAV)  │            │
│                   └──────────────┘  └──────────────┘            │
│                          │                   │                    │
│                          ▼                   ▼                    │
│                   ┌──────────────────────────┐                   │
│                   │   Audio Generation       │                   │
│                   │   Job Manager            │                   │
│                   └──────────────────────────┘                   │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             │ 4. GET /api/audio-status/{audio_id}
                             │    (polling for completion)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATION                       │
│                   ┌─────────────────────────┐                   │
│                   │  Audio Player           │                   │
│                   │  [Play] [Pause] [Stop]  │                   │
│                   └─────────────────────────┘                   │
│                   ┌─────────────────────────┐                   │
│                   │  [Download Audiobook]   │                   │
│                   └─────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ 5. GET /api/download/{audio_id}
                             ▼
┌───────────────────────────────────────────────────────────────────┐
│                         FLASK API SERVER                          │
│                   Return audio file binary                        │
└───────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Job (Text Extraction)
```json
{
  "job_id": "uuid",
  "status": "pending|processing|completed|failed",
  "filename": "string",
  "file_path": "string",
  "extracted_text": "string",
  "progress": 0-100,
  "error": "string|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Audio Generation
```json
{
  "audio_id": "uuid",
  "status": "pending|generating|completed|failed",
  "text": "string",
  "voice": "male|female",
  "speed": 0.5-2.0,
  "format": "mp3|wav",
  "file_path": "string",
  "file_size": "integer",
  "duration": "integer",
  "progress": 0-100,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## Error Codes

| Status Code | Meaning | Common Causes |
|------------|---------|---------------|
| 400 | Bad Request | Invalid input parameters, unsupported file format |
| 404 | Not Found | Job ID or Audio ID not found |
| 413 | Payload Too Large | File size exceeds 50MB limit |
| 415 | Unsupported Media Type | Invalid content type |
| 500 | Internal Server Error | Server-side processing error |
| 503 | Service Unavailable | Server overloaded or models not loaded |

---

## Rate Limiting

Currently no rate limiting for local deployment. May be added in future for cloud deployment.

---

## CORS Configuration

For local development, CORS is enabled for all origins. In production, should be restricted to specific origins.
