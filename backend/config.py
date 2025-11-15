import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# Flask configuration
class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Server configuration
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = False
    
    # File upload configuration
    UPLOAD_FOLDER = BASE_DIR / 'temp' / 'uploads'
    EXTRACTED_FOLDER = BASE_DIR / 'temp' / 'extracted'
    AUDIO_FOLDER = BASE_DIR / 'temp' / 'audio'
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'pdf'}
    
    # Model configuration
    MODELS_DIR = BASE_DIR / 'models'
    VISION_MODEL_PATH = MODELS_DIR / 'vision'
    TTS_MODEL_PATH = MODELS_DIR / 'tts'
    
    # Processing configuration
    MAX_CONCURRENT_JOBS = 2
    JOB_TIMEOUT = 300  # 5 minutes
    CLEANUP_INTERVAL = 3600  # 1 hour
    
    # TTS configuration
    TTS_ENGINE = 'pyttsx3'  # or 'gtts'
    TTS_VOICE = 'female'
    TTS_RATE = 150
    TTS_VOLUME = 1.0
    
    # OCR configuration
    OCR_ENGINE = 'tesseract'  # or 'easyocr'
    OCR_LANGUAGE = 'eng'
    
    # Audio configuration
    AUDIO_FORMAT = 'mp3'
    AUDIO_BITRATE = '128k'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
