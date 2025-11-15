"""Job manager for tracking processing jobs"""
import threading
import time
from datetime import datetime
from flask import current_app
from app.services.text_extraction_service import TextExtractionService
from app.services.audio_generation_service import AudioGenerationService

class JobManager:
    """Manager for tracking and executing jobs"""
    
    def __init__(self):
        self.jobs = {}
        self.audio_jobs = {}
        self.text_extraction_service = TextExtractionService()
    
    def get_job(self, job_id):
        """Get job details by ID"""
        return self.jobs.get(job_id)
    
    def get_audio_job(self, audio_id):
        """Get audio job details by ID"""
        return self.audio_jobs.get(audio_id)
    
    def remove_job(self, job_id):
        """Remove a job from tracking"""
        if job_id in self.jobs:
            del self.jobs[job_id]
    
    def start_extraction_job(self, job_id, filename):
        """Start a text extraction job in background"""
        # Initialize job status
        self.jobs[job_id] = {
            'job_id': job_id,
            'filename': filename,
            'status': 'processing',
            'progress': 0,
            'extracted_text': '',
            'error': None,
            'created_at': datetime.utcnow().isoformat() + 'Z',
            'updated_at': datetime.utcnow().isoformat() + 'Z'
        }
        
        # Start extraction in background thread
        thread = threading.Thread(
            target=self._run_extraction,
            args=(job_id, filename)
        )
        thread.daemon = True
        thread.start()
    
    def _run_extraction(self, job_id, filename):
        """Run text extraction in background"""
        try:
            # Update progress
            self.jobs[job_id]['progress'] = 25
            
            # Perform text extraction
            extracted_text, confidence = self.text_extraction_service.extract_text(job_id)
            
            # Update job with results
            self.jobs[job_id].update({
                'status': 'completed',
                'progress': 100,
                'extracted_text': extracted_text,
                'confidence_score': confidence,
                'updated_at': datetime.utcnow().isoformat() + 'Z'
            })
            
        except Exception as e:
            # Update job with error
            self.jobs[job_id].update({
                'status': 'failed',
                'progress': 0,
                'error': str(e),
                'updated_at': datetime.utcnow().isoformat() + 'Z'
            })
    
    def start_audio_job(self, audio_id, text, voice, speed, audio_format):
        """Start an audio generation job in background"""
        # Initialize audio job status
        self.audio_jobs[audio_id] = {
            'audio_id': audio_id,
            'status': 'generating',
            'progress': 0,
            'text': text,
            'voice': voice,
            'speed': speed,
            'format': audio_format,
            'file_path': None,
            'file_size': 0,
            'duration': 0,
            'error': None,
            'created_at': datetime.utcnow().isoformat() + 'Z',
            'updated_at': datetime.utcnow().isoformat() + 'Z'
        }
        
        # Start audio generation in background thread
        thread = threading.Thread(
            target=self._run_audio_generation,
            args=(audio_id, text, voice, speed, audio_format)
        )
        thread.daemon = True
        thread.start()
    
    def _run_audio_generation(self, audio_id, text, voice, speed, audio_format):
        """Run audio generation in background"""
        try:
            # Update progress
            self.audio_jobs[audio_id]['progress'] = 25
            
            # Generate audio
            audio_service = AudioGenerationService()
            file_path, file_size, duration = audio_service.generate_audio(
                audio_id, text, voice, speed, audio_format
            )
            
            # Update job with results
            self.audio_jobs[audio_id].update({
                'status': 'completed',
                'progress': 100,
                'file_path': file_path,
                'file_size': file_size,
                'duration': duration,
                'updated_at': datetime.utcnow().isoformat() + 'Z'
            })
            
        except Exception as e:
            # Update job with error
            self.audio_jobs[audio_id].update({
                'status': 'failed',
                'progress': 0,
                'error': str(e),
                'updated_at': datetime.utcnow().isoformat() + 'Z'
            })
