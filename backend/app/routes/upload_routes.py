"""Upload and text extraction routes"""
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from app.services.upload_service import UploadService
from app.services.job_manager import JobManager

upload_bp = Blueprint('upload', __name__)
upload_service = UploadService()
job_manager = JobManager()

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    """Upload and process document for text extraction"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                'error': 'No file part',
                'message': 'No file was uploaded'
            }), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                'error': 'No selected file',
                'message': 'Please select a file to upload'
            }), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({
                'error': 'Invalid file format',
                'message': 'Only JPG, PNG, BMP, TIFF, and PDF files are supported',
                'supported_formats': list(current_app.config['ALLOWED_EXTENSIONS'])
            }), 400
        
        # Save file and create job
        filename = secure_filename(file.filename)
        job_id = upload_service.save_file(file, filename)
        
        # Start text extraction job
        job_manager.start_extraction_job(job_id, filename)
        
        return jsonify({
            'job_id': job_id,
            'status': 'processing',
            'message': 'Document uploaded successfully and processing started',
            'created_at': job_manager.get_job(job_id)['created_at']
        }), 202
        
    except Exception as e:
        return jsonify({
            'error': 'Upload failed',
            'message': str(e)
        }), 500

@upload_bp.route('/status/<job_id>', methods=['GET'])
def get_job_status(job_id):
    """Get the status of a text extraction job"""
    try:
        job = job_manager.get_job(job_id)
        
        if not job:
            return jsonify({
                'error': 'Job not found',
                'message': f'No job found with ID: {job_id}'
            }), 404
        
        response = {
            'job_id': job_id,
            'status': job['status'],
            'progress': job['progress']
        }
        
        if job['status'] == 'completed':
            response['extracted_text'] = job['extracted_text']
            response['word_count'] = len(job['extracted_text'].split())
            response['confidence_score'] = job.get('confidence_score', 0.0)
        elif job['status'] == 'failed':
            response['error'] = job.get('error', 'Unknown error')
        elif job['status'] == 'processing':
            response['message'] = 'Extracting text from document...'
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get status',
            'message': str(e)
        }), 500

@upload_bp.route('/cleanup/<resource_id>', methods=['DELETE'])
def cleanup_resource(resource_id):
    """Delete uploaded files and extracted text"""
    try:
        upload_service.cleanup(resource_id)
        job_manager.remove_job(resource_id)
        
        return jsonify({
            'message': 'Resource deleted successfully',
            'resource_id': resource_id
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Cleanup failed',
            'message': str(e)
        }), 500
