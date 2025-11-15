# EdgeAudioBook Setup and Testing Guide

This guide will help you set up and test the complete EdgeAudioBook system.

## Prerequisites

Before starting, ensure you have:

- **Python 3.8 or higher** installed
- **Node.js 16 or higher** installed
- **npm or yarn** package manager
- **Git** for version control
- **Windows 10/11** (64-bit) for full desktop support

Optional but recommended:
- **Tesseract OCR** for better text extraction quality
- **FFmpeg** for audio format conversion

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/DrSquare/EdgeAudioBook.git
cd EdgeAudioBook
```

### 2. Backend Setup

#### Step 2.1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2.2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Step 2.3: Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 2.4: Install Tesseract OCR (Optional)

**Windows:**
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run installer and note installation path
3. Add to system PATH or update code to point to tesseract.exe

**macOS:**
```bash
brew install tesseract
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

#### Step 2.5: Verify Backend Installation
```bash
python run.py
```

You should see:
```
Starting EdgeAudioBook API Server on 0.0.0.0:5000
Debug mode: True
API available at: http://localhost:5000/api
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-15T20:43:55.746Z"
}
```

### 3. Frontend Setup

Open a **new terminal window** (keep backend running).

#### Step 3.1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 3.2: Install Node Dependencies
```bash
npm install
# or
yarn install
```

#### Step 3.3: Install React Native for Windows
```bash
npx react-native-windows-init --overwrite
```

#### Step 3.4: Verify Frontend Configuration

Check that the API URL is correct in `src/utils/constants.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:5000/api';
```

#### Step 3.5: Run the Frontend
```bash
npm run windows
# or
yarn windows
```

For development mode (Metro bundler):
```bash
npm start
# or
yarn start
```

## Testing the System

### Manual Testing Workflow

1. **Start Backend Server**
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   python run.py
   ```

2. **Start Frontend Application**
   ```bash
   cd frontend
   npm run windows
   ```

3. **Test Document Upload**
   - Click "Choose File" button
   - Select an image (JPG, PNG) or PDF document
   - Verify upload progress indicator appears
   - Wait for text extraction to complete

4. **Test Text Editor**
   - Verify extracted text appears in the editor
   - Edit the text if needed
   - Check word count updates correctly

5. **Test Audio Generation**
   - Select voice preference (Male/Female)
   - Choose speed (0.5x - 2.0x)
   - Select format (MP3/WAV)
   - Click "Generate Audiobook"
   - Verify progress indicator shows generation status

6. **Test Audio Download**
   - Once generation completes, verify audio player appears
   - Click "Download" button
   - Verify audio file downloads successfully

### API Testing with curl

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Upload File
```bash
curl -X POST -F "file=@/path/to/test.jpg" http://localhost:5000/api/upload
```

#### Check Status
```bash
curl http://localhost:5000/api/status/{job_id}
```

#### Generate Audio
```bash
curl -X POST http://localhost:5000/api/generate-audio \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a test audiobook generation.",
    "voice": "female",
    "speed": 1.0,
    "format": "mp3"
  }'
```

#### Check Audio Status
```bash
curl http://localhost:5000/api/audio-status/{audio_id}
```

#### Download Audio
```bash
curl -O http://localhost:5000/api/download/{audio_id}
```

### API Testing with Postman

1. Import the following endpoints:
   - `GET http://localhost:5000/api/health`
   - `POST http://localhost:5000/api/upload`
   - `GET http://localhost:5000/api/status/:job_id`
   - `POST http://localhost:5000/api/generate-audio`
   - `GET http://localhost:5000/api/audio-status/:audio_id`
   - `GET http://localhost:5000/api/download/:audio_id`

2. Test each endpoint according to the API specification

## Troubleshooting

### Backend Issues

**Issue: Module not found error**
```
Solution: Ensure virtual environment is activated and all dependencies are installed:
pip install -r requirements.txt
```

**Issue: Port 5000 already in use**
```
Solution: Change port in backend/config.py or stop other services using port 5000
```

**Issue: Tesseract not found**
```
Solution: Install Tesseract OCR or use the mock implementation (works without Tesseract)
```

### Frontend Issues

**Issue: Metro bundler won't start**
```
Solution: 
1. Clear cache: npx react-native start --reset-cache
2. Delete node_modules and reinstall: rm -rf node_modules && npm install
```

**Issue: Cannot connect to backend**
```
Solution: 
1. Verify backend is running on localhost:5000
2. Check API_BASE_URL in src/utils/constants.ts
3. Ensure no firewall blocking connections
```

**Issue: Build errors on Windows**
```
Solution:
1. Ensure React Native for Windows is installed: npx react-native-windows-init
2. Check that Visual Studio 2019+ is installed with C++ tools
```

### Common Issues

**Issue: CORS errors**
```
Solution: Backend has CORS enabled by default. If issues persist, check Flask-CORS configuration in backend/app/__init__.py
```

**Issue: File upload fails**
```
Solution:
1. Check file size (must be < 50MB)
2. Verify file format is supported (JPG, PNG, BMP, TIFF, PDF)
3. Check temp directories exist: backend/temp/uploads, backend/temp/extracted, backend/temp/audio
```

## Development Tips

### Backend Development

1. **Enable debug mode** in `config.py`:
   ```python
   DEBUG = True
   ```

2. **View logs** in terminal where backend is running

3. **Test individual services**:
   ```python
   from app.services.upload_service import UploadService
   service = UploadService()
   # Test methods
   ```

### Frontend Development

1. **Enable React DevTools**:
   ```bash
   npm install -g react-devtools
   react-devtools
   ```

2. **Hot reload** is enabled by default in development mode

3. **Debug with console.log**:
   ```typescript
   console.log('Debug info:', data);
   ```

## Production Deployment

### Backend Production Setup

1. Set environment to production:
   ```bash
   export FLASK_ENV=production
   ```

2. Use production-grade server (Gunicorn):
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 run:app
   ```

3. Configure reverse proxy (nginx) for better performance

### Frontend Production Build

1. Build for production:
   ```bash
   npm run build
   ```

2. Package as desktop application using Electron or similar

3. Create installer for Windows distribution

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test all features manually
3. ✅ Review documentation in `/docs` directory
4. ✅ Customize configuration as needed
5. ✅ Integrate actual Liquid.ai SDK (replace mock implementation)
6. ✅ Deploy to production environment

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review documentation in `/docs` directory
3. Check existing issues on GitHub
4. Open a new issue with detailed description

## Performance Benchmarks

Expected performance on recommended hardware:

- **Text Extraction**: 10-30 seconds per page
- **Audio Generation**: 30-60 seconds per 1000 words
- **File Upload**: <5 seconds for 10MB file
- **API Response**: <1 second for status checks

## Security Checklist

- [ ] Change default secret key in production
- [ ] Enable HTTPS for API communication
- [ ] Implement rate limiting
- [ ] Add authentication if needed
- [ ] Regular security updates for dependencies
- [ ] Validate and sanitize all user inputs
- [ ] Implement proper error handling
- [ ] Set up logging and monitoring

---

**EdgeAudioBook** - Making audiobooks accessible and private.
