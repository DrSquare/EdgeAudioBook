"""Text extraction service using vision and OCR models"""
import os
from flask import current_app
from app.models.vision_model import VisionModel
from app.models.ocr_engine import OCREngine
from app.services.upload_service import UploadService

class TextExtractionService:
    """Service for extracting text from images and PDFs"""
    
    def __init__(self):
        self.vision_model = VisionModel()
        self.ocr_engine = OCREngine()
        self.upload_service = UploadService()
    
    def extract_text(self, job_id):
        """Extract text from uploaded file"""
        # Get file path
        file_path = self.upload_service.get_file_path(job_id)
        
        if not file_path:
            raise Exception(f"File not found for job ID: {job_id}")
        
        # Determine file type
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.pdf':
            # Extract text from PDF
            extracted_text = self._extract_from_pdf(file_path)
        else:
            # Extract text from image using vision model and OCR
            extracted_text = self._extract_from_image(file_path)
        
        # Save extracted text
        self._save_extracted_text(job_id, extracted_text)
        
        # Return text and confidence score
        # For MVP, using a fixed confidence score
        confidence = 0.95 if len(extracted_text) > 0 else 0.0
        
        return extracted_text, confidence
    
    def _extract_from_image(self, image_path):
        """Extract text from image using vision model and OCR"""
        # First, use vision model to analyze image
        vision_result = self.vision_model.analyze_image(image_path)
        
        # Then use OCR to extract text
        ocr_text = self.ocr_engine.extract_text(image_path)
        
        # Combine results (for MVP, just use OCR text)
        # In production, vision model would help with layout understanding
        return ocr_text
    
    def _extract_from_pdf(self, pdf_path):
        """Extract text from PDF"""
        return self.ocr_engine.extract_text_from_pdf(pdf_path)
    
    def _save_extracted_text(self, job_id, text):
        """Save extracted text to file"""
        extracted_folder = current_app.config['EXTRACTED_FOLDER']
        output_path = os.path.join(extracted_folder, f"{job_id}.txt")
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
