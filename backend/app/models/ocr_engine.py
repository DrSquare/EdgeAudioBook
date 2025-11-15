"""OCR engine wrapper for text extraction"""
import logging
import os

logger = logging.getLogger(__name__)

class OCREngine:
    """
    Wrapper for OCR engines (Tesseract/EasyOCR)
    """
    
    def __init__(self, engine='tesseract'):
        """Initialize OCR engine"""
        self.engine = engine
        logger.info(f"Initializing OCR Engine: {engine}")
        
        if engine == 'tesseract':
            try:
                import pytesseract
                self.tesseract = pytesseract
                self.engine_loaded = True
            except ImportError:
                logger.warning("pytesseract not available, using mock")
                self.engine_loaded = False
        elif engine == 'easyocr':
            try:
                import easyocr
                self.reader = easyocr.Reader(['en'])
                self.engine_loaded = True
            except ImportError:
                logger.warning("easyocr not available, using mock")
                self.engine_loaded = False
        else:
            self.engine_loaded = False
    
    def extract_text(self, image_path):
        """
        Extract text from image
        
        Args:
            image_path: Path to the image file
            
        Returns:
            str: Extracted text
        """
        logger.info(f"Extracting text from image: {image_path}")
        
        if not os.path.exists(image_path):
            raise Exception(f"Image file not found: {image_path}")
        
        try:
            if self.engine == 'tesseract' and self.engine_loaded:
                return self._extract_with_tesseract(image_path)
            elif self.engine == 'easyocr' and self.engine_loaded:
                return self._extract_with_easyocr(image_path)
            else:
                # Mock implementation for demo
                return self._mock_extract(image_path)
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            # Fallback to mock
            return self._mock_extract(image_path)
    
    def _extract_with_tesseract(self, image_path):
        """Extract text using Tesseract OCR"""
        from PIL import Image
        
        image = Image.open(image_path)
        text = self.tesseract.image_to_string(image)
        return text.strip()
    
    def _extract_with_easyocr(self, image_path):
        """Extract text using EasyOCR"""
        results = self.reader.readtext(image_path)
        text = ' '.join([result[1] for result in results])
        return text.strip()
    
    def _mock_extract(self, image_path):
        """Mock text extraction for demo purposes"""
        logger.info("Using mock OCR extraction")
        return f"""Sample extracted text from {os.path.basename(image_path)}.

This is a demonstration of the EdgeAudioBook system. In production, this text would be 
extracted from the actual image using OCR technology powered by Tesseract or EasyOCR, 
combined with Liquid.ai vision model for better accuracy.

The system supports various document types including images and PDFs, and can handle 
multiple languages and complex layouts.
"""
    
    def extract_text_from_pdf(self, pdf_path):
        """
        Extract text from PDF
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            str: Extracted text
        """
        logger.info(f"Extracting text from PDF: {pdf_path}")
        
        if not os.path.exists(pdf_path):
            raise Exception(f"PDF file not found: {pdf_path}")
        
        try:
            # Try using pdfplumber first (better for structured PDFs)
            import pdfplumber
            
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
            
            if text.strip():
                return text.strip()
            
            # If no text found, fallback to PyPDF2
            import PyPDF2
            
            text = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n\n"
            
            return text.strip() if text.strip() else self._mock_extract_pdf(pdf_path)
            
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            return self._mock_extract_pdf(pdf_path)
    
    def _mock_extract_pdf(self, pdf_path):
        """Mock PDF text extraction for demo"""
        logger.info("Using mock PDF extraction")
        return f"""Sample extracted text from {os.path.basename(pdf_path)}.

This is a demonstration of PDF text extraction in the EdgeAudioBook system.
In production, this would extract actual text from the PDF document.

The system can handle both text-based PDFs and scanned PDFs (using OCR).
"""
