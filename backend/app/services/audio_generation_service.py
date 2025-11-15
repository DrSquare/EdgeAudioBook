"""Audio generation service"""
import os
import uuid
from flask import current_app
from app.models.tts_engine import TTSEngine

class AudioGenerationService:
    """Service for generating audio from text"""
    
    def __init__(self):
        self.tts_engine = TTSEngine()
        self.audio_paths = {}
    
    def create_audio_job(self, text, voice, speed, audio_format):
        """Create a new audio generation job"""
        audio_id = str(uuid.uuid4())
        return audio_id
    
    def generate_audio(self, audio_id, text, voice, speed, audio_format):
        """Generate audio file from text"""
        # Generate audio using TTS engine
        audio_folder = current_app.config['AUDIO_FOLDER']
        output_path = os.path.join(audio_folder, f"{audio_id}.{audio_format}")
        
        # Generate audio
        self.tts_engine.text_to_speech(
            text=text,
            output_path=output_path,
            voice=voice,
            speed=speed,
            audio_format=audio_format
        )
        
        # Get file size and duration
        file_size = os.path.getsize(output_path)
        duration = self._estimate_duration(text, speed)
        
        # Store audio path
        self.audio_paths[audio_id] = output_path
        
        return output_path, file_size, duration
    
    def get_audio_path(self, audio_id):
        """Get the file path for generated audio"""
        return self.audio_paths.get(audio_id)
    
    def _estimate_duration(self, text, speed):
        """Estimate audio duration in seconds"""
        # Average speaking rate: 150 words per minute
        # Adjusted by speed multiplier
        word_count = len(text.split())
        base_duration = (word_count / 150) * 60  # in seconds
        adjusted_duration = base_duration / speed
        return int(adjusted_duration)
