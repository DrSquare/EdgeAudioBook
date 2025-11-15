# EdgeAudioBook Backend API

Flask-based REST API for EdgeAudioBook system providing text extraction and audio generation services.

## Features

- **Image Upload & Processing**: Upload images or PDFs for text extraction
- **Vision-based Text Extraction**: Uses Liquid.ai vision models and OCR
- **Text-to-Speech**: Convert extracted text to high-quality audio
- **REST API**: Clean REST API for frontend communication
- **Job Tracking**: Asynchronous processing with status tracking

## Requirements

- Python 3.8 or higher
- Tesseract OCR (optional, for better OCR quality)
- FFmpeg (optional, for audio format conversion)

## Installation

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Install Tesseract OCR:
- Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
- macOS: `brew install tesseract`
- Linux: `sudo apt-get install tesseract-ocr`

## Running the Server

```bash
python run.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Upload Document
```
POST /api/upload
Content-Type: multipart/form-data

file: <image or PDF file>
```

### Check Extraction Status
```
GET /api/status/{job_id}
```

### Generate Audio
```
POST /api/generate-audio
Content-Type: application/json

{
  "text": "Text to convert to audio",
  "voice": "female",
  "speed": 1.0,
  "format": "mp3"
}
```

### Check Audio Status
```
GET /api/audio-status/{audio_id}
```

### Download Audio
```
GET /api/download/{audio_id}
```

### Cleanup Resources
```
DELETE /api/cleanup/{resource_id}
```

## Configuration

Configuration can be modified in `config.py`:

- `MAX_CONTENT_LENGTH`: Maximum file upload size (default: 50MB)
- `ALLOWED_EXTENSIONS`: Supported file formats
- `TTS_ENGINE`: Text-to-speech engine ('pyttsx3' or 'gtts')
- `OCR_ENGINE`: OCR engine ('tesseract' or 'easyocr')

## Directory Structure

```
backend/
├── app/
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic
│   ├── models/          # AI model wrappers
│   └── utils/           # Utility functions
├── temp/                # Temporary file storage
│   ├── uploads/         # Uploaded files
│   ├── extracted/       # Extracted text
│   └── audio/           # Generated audio
├── models/              # AI model files
├── config.py            # Configuration
└── run.py              # Application entry point
```

## Development

For development with auto-reload:
```bash
export FLASK_ENV=development
python run.py
```

## Notes

- This is an MVP implementation with mock Liquid.ai vision model integration
- In production, replace mock implementations with actual Liquid.ai SDK
- Temporary files are stored locally and should be cleaned up periodically
- For better TTS quality, consider using Coqui TTS or other advanced models
