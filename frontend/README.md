# EdgeAudioBook Frontend

React Native + TypeScript frontend for EdgeAudioBook desktop application.

## Features

- **Document Upload**: Drag-and-drop or file picker for images and PDFs
- **Text Review**: Edit extracted text before audio generation
- **Audio Settings**: Customize voice, speed, and format
- **Real-time Progress**: Live status updates for processing
- **Audio Playback**: In-app audio player (placeholder)
- **Download**: Download generated audiobook files

## Requirements

- Node.js 16 or higher
- npm or yarn
- React Native CLI
- React Native for Windows (for Windows desktop)

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Install React Native for Windows (Windows only):
```bash
npx react-native-windows-init --overwrite
```

## Running the Application

### Windows Desktop
```bash
npm run windows
# or
yarn windows
```

### Development Mode
```bash
npm start
# or
yarn start
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── FileUploader.tsx
│   │   ├── TextEditor.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── AudioPlayer.tsx
│   ├── screens/         # Main screens
│   │   └── HomeScreen.tsx
│   ├── services/        # API communication
│   │   └── api.ts
│   ├── hooks/           # Custom React hooks
│   │   └── usePolling.ts
│   ├── utils/           # Utilities and constants
│   │   └── constants.ts
│   ├── types/           # TypeScript definitions
│   │   └── index.ts
│   └── App.tsx          # Root component
├── package.json
├── tsconfig.json
└── README.md
```

## Configuration

The API base URL can be configured in `src/utils/constants.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:5000/api';
```

## Components

### FileUploader
Handles document upload with validation and progress indication.

### TextEditor
Displays and allows editing of extracted text with word count.

### ProgressIndicator
Shows real-time progress for text extraction and audio generation.

### AudioPlayer
Provides audio playback controls and download functionality.

## State Management

The application uses React hooks and context for state management:
- `useState` for component-level state
- `useEffect` for side effects
- `usePolling` custom hook for status polling

## API Integration

All API calls are centralized in `src/services/api.ts` using Axios.

### Available API Methods:
- `checkHealth()` - Health check
- `uploadFile()` - Upload document
- `getJobStatus()` - Get extraction status
- `generateAudio()` - Generate audiobook
- `getAudioStatus()` - Get audio generation status
- `getDownloadUrl()` - Get download URL
- `cleanupResource()` - Cleanup resources

## Development

### Type Checking
```bash
npm run tsc
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## Notes

- This is a React Native application configured for Windows desktop
- Audio playback functionality is a placeholder and requires additional implementation
- Ensure the backend API is running on `localhost:5000` before starting the frontend
- The application requires proper CORS configuration on the backend

## Future Enhancements

- Implement actual audio playback using react-native-sound
- Add support for additional platforms (macOS, Linux)
- Implement batch processing
- Add history of generated audiobooks
- Offline support with local caching
