# Technical Architecture
## EdgeAudioBook System Architecture

### 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           WINDOWS LAPTOP (EDGE DEVICE)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                    PRESENTATION LAYER                          │   │
│  │                 (React Native + TypeScript)                    │   │
│  ├───────────────────────────────────────────────────────────────┤   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │   File   │  │   Text   │  │  Audio   │  │ Settings │     │   │
│  │  │  Upload  │  │  Editor  │  │  Player  │  │   UI     │     │   │
│  │  │    UI    │  │    UI    │  │    UI    │  │          │     │   │
│  │  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘     │   │
│  │        │             │              │             │           │   │
│  │  ┌─────┴─────────────┴──────────────┴─────────────┴──────┐  │   │
│  │  │            REST API Client Service                     │  │   │
│  │  │          (Axios / Fetch API wrapper)                   │  │   │
│  │  └────────────────────────┬───────────────────────────────┘  │   │
│  └───────────────────────────┼──────────────────────────────────┘   │
│                              │                                       │
│                              │ HTTP REST API                         │
│                              │ (localhost:5000)                      │
│                              │                                       │
│  ┌───────────────────────────┼──────────────────────────────────┐   │
│  │                    APPLICATION LAYER                         │   │
│  │                    (Flask REST API)                          │   │
│  ├───────────────────────────┼──────────────────────────────────┤   │
│  │  ┌────────────────────────▼───────────────────────────────┐ │   │
│  │  │              Flask Application Server                  │ │   │
│  │  │                 (Python 3.8+)                          │ │   │
│  │  └────────────────────┬───────────────────────────────────┘ │   │
│  │                       │                                     │   │
│  │  ┌────────────────────┼───────────────────────────────────┐ │   │
│  │  │              API Route Handlers                        │ │   │
│  │  ├────────────────────┼───────────────────────────────────┤ │   │
│  │  │ /upload            │ /generate-audio  │ /download      │ │   │
│  │  │ /status/{job_id}   │ /audio-status    │ /cleanup       │ │   │
│  │  └────────┬───────────┴──────────┬───────────────┬────────┘ │   │
│  │           │                      │               │          │   │
│  └───────────┼──────────────────────┼───────────────┼──────────┘   │
│              │                      │               │              │
│  ┌───────────┼──────────────────────┼───────────────┼──────────┐   │
│  │                    BUSINESS LOGIC LAYER                     │   │
│  │                  (Python Services)                          │   │
│  ├───────────┼──────────────────────┼───────────────┼──────────┤   │
│  │  ┌────────▼────────┐   ┌─────────▼────────┐   ┌─▼────────┐│   │
│  │  │  Upload         │   │   Audio          │   │  File    ││   │
│  │  │  Service        │   │   Generator      │   │  Manager ││   │
│  │  │  - Validate     │   │   Service        │   │  Service ││   │
│  │  │  - Store file   │   │   - TTS convert  │   │          ││   │
│  │  └────────┬────────┘   └──────────────────┘   └──────────┘│   │
│  │           │                                                 │   │
│  │  ┌────────▼────────┐   ┌───────────────────┐              │   │
│  │  │  Text           │   │   Job             │              │   │
│  │  │  Extraction     │   │   Queue           │              │   │
│  │  │  Service        │   │   Manager         │              │   │
│  │  │  - Vision model │   │   - Track jobs    │              │   │
│  │  │  - OCR engine   │   │   - Status update │              │   │
│  │  └────────┬────────┘   └───────────────────┘              │   │
│  │           │                                                 │   │
│  └───────────┼─────────────────────────────────────────────────┘   │
│              │                                                     │
│  ┌───────────┼─────────────────────────────────────────────────┐   │
│  │                    AI MODEL LAYER                           │   │
│  │                                                             │   │
│  ├───────────┼─────────────────────────────────────────────────┤   │
│  │  ┌────────▼────────┐   ┌──────────────┐   ┌────────────┐  │   │
│  │  │  Liquid.ai      │   │  OCR Engine  │   │    TTS     │  │   │
│  │  │  Vision Model   │   │  (Tesseract/ │   │   Engine   │  │   │
│  │  │  - Image        │   │   EasyOCR)   │   │ (pyttsx3/  │  │   │
│  │  │    analysis     │   │  - Text      │   │  gTTS/     │  │   │
│  │  │  - Layout       │   │    extraction│   │  Coqui TTS)│  │   │
│  │  │    detection    │   │              │   │            │  │   │
│  │  └─────────────────┘   └──────────────┘   └────────────┘  │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    DATA LAYER                               │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │   │
│  │  │   Uploads    │   │  Extracted   │   │  Generated   │   │   │
│  │  │   Storage    │   │    Text      │   │    Audio     │   │   │
│  │  │  (temp/)     │   │   Storage    │   │   Storage    │   │   │
│  │  │              │   │  (temp/)     │   │  (temp/)     │   │   │
│  │  └──────────────┘   └──────────────┘   └──────────────┘   │   │
│  │                                                             │   │
│  │  ┌──────────────┐   ┌──────────────┐                      │   │
│  │  │  Job Status  │   │   Model      │                      │   │
│  │  │  (In-memory  │   │   Cache      │                      │   │
│  │  │   or SQLite) │   │  (In-memory) │                      │   │
│  │  └──────────────┘   └──────────────┘                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 2. Component Architecture

#### 2.1 Frontend (React Native + TypeScript)

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── FileUploader.tsx
│   │   ├── TextEditor.tsx
│   │   ├── AudioPlayer.tsx
│   │   └── ProgressIndicator.tsx
│   ├── screens/             # Main application screens
│   │   ├── HomeScreen.tsx
│   │   ├── UploadScreen.tsx
│   │   ├── EditorScreen.tsx
│   │   └── AudioScreen.tsx
│   ├── services/            # API communication layer
│   │   ├── api.ts           # API client wrapper
│   │   ├── uploadService.ts
│   │   ├── audioService.ts
│   │   └── types.ts         # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   │   ├── useUpload.ts
│   │   ├── usePolling.ts
│   │   └── useAudio.ts
│   ├── utils/               # Utility functions
│   │   ├── fileValidator.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   ├── store/               # State management (if using Redux/Context)
│   │   ├── actions/
│   │   ├── reducers/
│   │   └── store.ts
│   └── App.tsx              # Root component
├── package.json
├── tsconfig.json
└── metro.config.js
```

**Key Technologies:**
- React Native for Windows
- TypeScript
- Axios for HTTP requests
- React Navigation for routing
- React Context/Redux for state management

---

#### 2.2 Backend (Flask + Python)

```
backend/
├── app/
│   ├── __init__.py              # Flask app initialization
│   ├── routes/                  # API route handlers
│   │   ├── __init__.py
│   │   ├── upload_routes.py
│   │   ├── audio_routes.py
│   │   └── health_routes.py
│   ├── services/                # Business logic services
│   │   ├── __init__.py
│   │   ├── upload_service.py
│   │   ├── text_extraction_service.py
│   │   ├── audio_generation_service.py
│   │   ├── job_manager.py
│   │   └── file_manager.py
│   ├── models/                  # AI model wrappers
│   │   ├── __init__.py
│   │   ├── vision_model.py      # Liquid.ai integration
│   │   ├── ocr_engine.py        # Tesseract/EasyOCR wrapper
│   │   └── tts_engine.py        # TTS model wrapper
│   ├── utils/                   # Utility functions
│   │   ├── __init__.py
│   │   ├── file_utils.py
│   │   ├── validators.py
│   │   └── config.py
│   └── schemas/                 # Data validation schemas
│       ├── __init__.py
│       ├── upload_schema.py
│       └── audio_schema.py
├── temp/                        # Temporary file storage
│   ├── uploads/
│   ├── extracted/
│   └── audio/
├── models/                      # AI model files
│   ├── vision/
│   └── tts/
├── requirements.txt
├── config.py
└── run.py                       # Application entry point
```

**Key Technologies:**
- Flask (REST API framework)
- Liquid.ai SDK (for vision model)
- Tesseract OCR or EasyOCR
- pyttsx3 or Coqui TTS (for text-to-speech)
- Pillow (image processing)
- PyPDF2 (PDF processing)
- Flask-CORS (CORS support)

---

### 3. Data Flow Diagram

#### 3.1 Text Extraction Flow

```
User Action                    Frontend                 Backend                  AI Models
    │                             │                        │                         │
    │  Select File                │                        │                         │
    │────────────────────────────►│                        │                         │
    │                             │                        │                         │
    │  Click Upload               │                        │                         │
    │────────────────────────────►│                        │                         │
    │                             │                        │                         │
    │                             │  POST /api/upload      │                         │
    │                             │───────────────────────►│                         │
    │                             │                        │                         │
    │                             │                        │  Validate File          │
    │                             │                        │─────────┐               │
    │                             │                        │         │               │
    │                             │                        │◄────────┘               │
    │                             │                        │                         │
    │                             │                        │  Process with Vision    │
    │                             │                        │────────────────────────►│
    │                             │                        │                         │
    │                             │                        │  Image Analysis         │
    │                             │                        │                         │
    │                             │                        │◄────────────────────────│
    │                             │                        │                         │
    │                             │                        │  Extract Text (OCR)     │
    │                             │                        │────────────────────────►│
    │                             │                        │                         │
    │                             │                        │  Extracted Text         │
    │                             │                        │◄────────────────────────│
    │                             │                        │                         │
    │                             │  202 (job_id)          │                         │
    │                             │◄───────────────────────│                         │
    │                             │                        │                         │
    │  Show Processing            │                        │                         │
    │◄────────────────────────────│                        │                         │
    │                             │                        │                         │
    │                             │  GET /api/status       │                         │
    │                             │───────────────────────►│                         │
    │                             │  (polling)             │                         │
    │                             │                        │                         │
    │                             │  200 (status, text)    │                         │
    │                             │◄───────────────────────│                         │
    │                             │                        │                         │
    │  Show Extracted Text        │                        │                         │
    │◄────────────────────────────│                        │                         │
```

#### 3.2 Audio Generation Flow

```
User Action                    Frontend                 Backend                  AI Models
    │                             │                        │                         │
    │  Edit Text (optional)       │                        │                         │
    │────────────────────────────►│                        │                         │
    │                             │                        │                         │
    │  Select Voice/Speed         │                        │                         │
    │────────────────────────────►│                        │                         │
    │                             │                        │                         │
    │  Click Generate Audio       │                        │                         │
    │────────────────────────────►│                        │                         │
    │                             │                        │                         │
    │                             │  POST /generate-audio  │                         │
    │                             │───────────────────────►│                         │
    │                             │  (text, voice, speed)  │                         │
    │                             │                        │                         │
    │                             │                        │  Process TTS            │
    │                             │                        │────────────────────────►│
    │                             │                        │                         │
    │                             │                        │  Generate Audio         │
    │                             │                        │                         │
    │                             │                        │◄────────────────────────│
    │                             │                        │                         │
    │                             │  202 (audio_id)        │                         │
    │                             │◄───────────────────────│                         │
    │                             │                        │                         │
    │  Show Generating            │                        │                         │
    │◄────────────────────────────│                        │                         │
    │                             │                        │                         │
    │                             │  GET /audio-status     │                         │
    │                             │───────────────────────►│                         │
    │                             │  (polling)             │                         │
    │                             │                        │                         │
    │                             │  200 (completed)       │                         │
    │                             │◄───────────────────────│                         │
    │                             │                        │                         │
    │  Show Audio Player          │                        │                         │
    │◄────────────────────────────│                        │                         │
    │                             │                        │                         │
    │  Play Audio                 │                        │                         │
    │────────────────────────────►│                        │                         │
    │                             │                        │                         │
    │  Download Audio             │  GET /download         │                         │
    │────────────────────────────►│───────────────────────►│                         │
    │                             │                        │                         │
    │                             │  200 (audio binary)    │                         │
    │                             │◄───────────────────────│                         │
    │                             │                        │                         │
    │  Save to Disk               │                        │                         │
    │◄────────────────────────────│                        │                         │
```

---

### 4. Technology Stack

#### 4.1 Frontend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | React Native | Cross-platform desktop app |
| Language | TypeScript | Type-safe development |
| HTTP Client | Axios | REST API communication |
| State Management | React Context/Redux | Application state |
| Navigation | React Navigation | Screen routing |
| UI Components | React Native Paper | Material Design components |
| Audio Playback | react-native-sound | Audio player functionality |
| File Handling | react-native-fs | File system operations |

#### 4.2 Backend Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Flask | REST API server |
| Language | Python 3.8+ | Backend logic |
| Vision Model | Liquid.ai SDK | Image understanding |
| OCR Engine | Tesseract/EasyOCR | Text extraction |
| TTS Engine | pyttsx3/Coqui TTS | Audio generation |
| Image Processing | Pillow (PIL) | Image manipulation |
| PDF Processing | PyPDF2/pdfplumber | PDF text extraction |
| CORS | Flask-CORS | Cross-origin requests |
| Validation | marshmallow | Request validation |
| Job Queue | threading/concurrent.futures | Async task processing |

#### 4.3 Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version control |
| ESLint | JavaScript/TypeScript linting |
| Prettier | Code formatting |
| pylint/flake8 | Python linting |
| pytest | Python testing |
| Jest | JavaScript testing |

---

### 5. Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│            Windows Laptop Installation              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  EdgeAudioBook Application                  │  │
│  │  (Electron/React Native Windows wrapper)    │  │
│  └─────────────┬───────────────────────────────┘  │
│                │ Launches at startup              │
│                ▼                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  Flask Backend (Python)                     │  │
│  │  Running on localhost:5000                  │  │
│  │  - Auto-starts with app                     │  │
│  │  - Background process                       │  │
│  └─────────────────────────────────────────────┘  │
│                │                                   │
│                ▼                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  AI Models (Local Storage)                  │  │
│  │  - Vision model (Liquid.ai)                 │  │
│  │  - OCR model (Tesseract)                    │  │
│  │  - TTS model                                │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  Temp Storage                               │  │
│  │  - Uploaded files                           │  │
│  │  - Extracted text                           │  │
│  │  - Generated audio                          │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Installation Package Includes:**
1. React Native Windows executable
2. Python runtime and dependencies
3. Pre-trained AI models
4. Configuration files
5. Startup scripts

---

### 6. Security Architecture

#### 6.1 Security Layers

1. **Input Validation**
   - File type validation
   - File size limits
   - Malicious file detection
   - Input sanitization

2. **Process Isolation**
   - Sandboxed model execution
   - Separate process for file operations
   - Resource limits per job

3. **Data Privacy**
   - All processing local to device
   - Temporary file encryption (optional)
   - Automatic cleanup of sensitive data
   - No telemetry or external communication

4. **File System Security**
   - Restricted file access permissions
   - Temporary directory isolation
   - Secure file deletion

#### 6.2 Data Flow Security

```
User File → Validation → Temp Storage (Isolated) → Processing → Cleanup
                ↓              ↓                         ↓           ↓
          [Virus Scan]   [Encryption]            [Sandboxed]  [Secure Delete]
```

---

### 7. Scalability Considerations

#### 7.1 Current Architecture (MVP)
- Single-threaded processing
- Sequential job execution
- In-memory job queue

#### 7.2 Future Enhancements
- Multi-threaded job processing
- Job priority queue
- Distributed model loading
- Batch processing support

---

### 8. Performance Optimization

1. **Model Optimization**
   - Use quantized models for faster inference
   - Model caching in memory
   - Lazy loading of models

2. **File Processing**
   - Streaming for large files
   - Chunked processing
   - Progressive results delivery

3. **Frontend Optimization**
   - Lazy loading of components
   - Code splitting
   - Asset optimization

4. **Backend Optimization**
   - Connection pooling
   - Response compression
   - Caching of intermediate results

---

### 9. Error Handling Architecture

```
┌─────────────┐
│   Error     │
│  Occurs     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Error Logger   │
│  - Log to file  │
│  - Timestamp    │
│  - Context      │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│  Error Handler          │
│  - Categorize error     │
│  - Determine severity   │
│  - Choose response      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  User Notification      │
│  - User-friendly msg    │
│  - Recovery actions     │
│  - Error code           │
└─────────────────────────┘
```

---

### 10. Monitoring & Logging

#### 10.1 Application Logs
- Location: `%APPDATA%/EdgeAudioBook/logs/`
- Rotation: Daily, keep 7 days
- Level: INFO, WARNING, ERROR

#### 10.2 Metrics Tracked
- Job processing times
- Success/failure rates
- Resource utilization (CPU, Memory)
- Model inference times
- API response times

#### 10.3 Health Checks
- API endpoint: `/api/health`
- Model availability check
- Disk space check
- Memory usage check

---

### 11. Configuration Management

```yaml
# config.yaml
app:
  name: EdgeAudioBook
  version: 1.0.0
  port: 5000

storage:
  temp_dir: ./temp
  max_upload_size: 52428800  # 50MB
  cleanup_interval: 3600  # 1 hour

models:
  vision:
    type: liquid_ai
    path: ./models/vision/
    cache: true
  
  ocr:
    engine: tesseract
    language: eng
    
  tts:
    engine: pyttsx3
    voice: female
    rate: 150

processing:
  max_concurrent_jobs: 2
  job_timeout: 300  # 5 minutes
  
logging:
  level: INFO
  file: ./logs/app.log
```
