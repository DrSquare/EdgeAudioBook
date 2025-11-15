# EdgeAudioBook
**Edge Device Audiobook Generation System**

Convert documents to audiobooks using AI-powered vision, text extraction, and text-to-speech technologies running locally on Windows laptops.

## 📋 Overview

EdgeAudioBook is a privacy-focused desktop application that enables users to generate high-quality audiobooks from images and documents entirely on their local device. The system leverages:

- **Liquid.ai Vision Models** for intelligent image analysis
- **OCR Technology** (Tesseract/EasyOCR) for accurate text extraction  
- **Advanced TTS** (Text-to-Speech) for natural audio generation
- **React Native + TypeScript** for the frontend
- **Flask Python API** for the backend

## 🎯 Key Features

- ✅ Upload images (JPG, PNG, BMP, TIFF) or PDF documents
- ✅ AI-powered text extraction with vision understanding
- ✅ Review and edit extracted text before conversion
- ✅ Customizable voice (male/female), speed (0.5x-2.0x), and format (MP3/WAV)
- ✅ Real-time progress tracking
- ✅ In-app audio preview and download
- ✅ 100% local processing - no data leaves your device
- ✅ REST API architecture for clean separation of concerns

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Product Requirements Document (PRD)](docs/PRD.md)** - Complete product specification
- **[API Specification](docs/API_SPECIFICATION.md)** - REST API endpoints with request/response examples
- **[Architecture Documentation](docs/ARCHITECTURE.md)** - System design and technical architecture

## 🏗️ Project Structure

```
EdgeAudioBook/
├── docs/                    # Documentation
│   ├── PRD.md              # Product Requirements Document
│   ├── API_SPECIFICATION.md # API documentation
│   └── ARCHITECTURE.md      # Technical architecture
├── backend/                 # Flask REST API (Python)
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── models/         # AI model wrappers
│   │   └── utils/          # Utility functions
│   ├── temp/               # Temporary storage
│   ├── models/             # AI model files
│   ├── config.py           # Configuration
│   ├── requirements.txt    # Python dependencies
│   └── run.py             # Application entry point
└── frontend/               # React Native + TypeScript
    ├── src/
    │   ├── components/     # UI components
    │   ├── screens/        # Main screens
    │   ├── services/       # API client
    │   ├── hooks/          # Custom hooks
    │   ├── utils/          # Utilities
    │   └── types/          # TypeScript types
    ├── package.json        # Node dependencies
    └── tsconfig.json       # TypeScript config
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **Tesseract OCR** (optional, for better text extraction)
- **Windows 10/11** (64-bit)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python run.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the React Native application:
```bash
npm run windows
```

## 🔧 Configuration

### Backend Configuration

Modify `backend/config.py` to customize:
- File upload limits
- Supported file formats
- TTS engine selection
- OCR engine selection
- Model paths

### Frontend Configuration

Update `frontend/src/utils/constants.ts` for:
- API base URL
- Polling intervals
- UI preferences

## 📖 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload document |
| GET | `/api/status/{job_id}` | Get extraction status |
| POST | `/api/generate-audio` | Generate audiobook |
| GET | `/api/audio-status/{audio_id}` | Get audio status |
| GET | `/api/download/{audio_id}` | Download audiobook |
| DELETE | `/api/cleanup/{resource_id}` | Cleanup resources |

See [API Specification](docs/API_SPECIFICATION.md) for detailed documentation.

## 🎨 User Flow

1. **Upload** - Select image or PDF document
2. **Extract** - AI processes and extracts text
3. **Review** - Edit extracted text if needed
4. **Configure** - Choose voice, speed, and format
5. **Generate** - Create audiobook
6. **Listen** - Play or download the audiobook

## 🔒 Security & Privacy

- All processing happens locally on your device
- No data sent to external servers
- Temporary files are automatically cleaned up
- No telemetry or tracking

## 🛠️ Technology Stack

### Frontend
- React Native (desktop support)
- TypeScript
- Axios (HTTP client)
- React Hooks

### Backend
- Flask (Python)
- Liquid.ai Vision Models
- Tesseract OCR / EasyOCR
- pyttsx3 / gTTS (Text-to-Speech)
- Pillow (Image processing)
- PyPDF2 (PDF processing)

## 📋 System Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 2GB free space
- **Processor**: Intel i5 8th gen or AMD equivalent

## 🤝 Contributing

This is an MVP implementation. Contributions are welcome for:
- Integration with actual Liquid.ai vision models
- Enhanced TTS quality
- Additional language support
- Performance optimizations
- UI/UX improvements

## 📝 License

[Add your license information here]

## 🐛 Known Limitations

- Mock implementation of Liquid.ai vision model (requires actual SDK integration)
- Basic audio playback (full implementation requires react-native-sound)
- Single language support (English only in MVP)
- Sequential processing (no batch support yet)

## 📞 Support

For issues, questions, or feature requests, please open an issue in the repository.

## 🗺️ Roadmap

- [ ] Integrate actual Liquid.ai vision models
- [ ] Add multi-language support
- [ ] Implement batch processing
- [ ] Add chapter markers
- [ ] Cloud sync option (optional)
- [ ] Custom voice training
- [ ] Mobile platform support

---

**EdgeAudioBook** - Making audiobooks accessible, private, and easy to create.
