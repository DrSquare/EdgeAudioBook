"""Upload service for handling file uploads"""
import os
import uuid
from pathlib import Path
from flask import current_app
from werkzeug.utils import secure_filename

class UploadService:
    """Service for handling file uploads and storage"""
    
    def save_file(self, file, filename):
        """Save uploaded file and return job ID"""
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Create secure filename with job ID
        file_ext = os.path.splitext(filename)[1]
        secure_name = f"{job_id}{file_ext}"
        
        # Save file to upload folder
        upload_folder = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_folder, secure_name)
        file.save(file_path)
        
        return job_id
    
    def get_file_path(self, job_id):
        """Get the file path for a given job ID"""
        upload_folder = current_app.config['UPLOAD_FOLDER']
        
        # Find file with job_id prefix
        for filename in os.listdir(upload_folder):
            if filename.startswith(job_id):
                return os.path.join(upload_folder, filename)
        
        return None
    
    def cleanup(self, job_id):
        """Remove uploaded file and extracted text"""
        # Remove uploaded file
        file_path = self.get_file_path(job_id)
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        
        # Remove extracted text file
        extracted_folder = current_app.config['EXTRACTED_FOLDER']
        extracted_file = os.path.join(extracted_folder, f"{job_id}.txt")
        if os.path.exists(extracted_file):
            os.remove(extracted_file)
