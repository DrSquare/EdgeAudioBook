"""Audio generation and download routes"""
from flask import Blueprint, request, jsonify, send_file, current_app
import os
from app.services.audio_generation_service import AudioGenerationService
from app.services.job_manager import JobManager

audio_bp = Blueprint('audio', __name__)
audio_service = AudioGenerationService()
job_manager = JobManager()

@audio_bp.route('/generate-audio', methods=['POST'])
def generate_audio():
    """Generate audio from text"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'text' not in data:
            return jsonify({
                'error': 'Invalid parameters',
                'message': 'Text field is required and cannot be empty'
            }), 400
        
        text = data['text']
        voice = data.get('voice', 'female')
        speed = data.get('speed', 1.0)
        audio_format = data.get('format', 'mp3')
        
        # Validate parameters
        if not text.strip():
            return jsonify({
                'error': 'Invalid parameters',
                'message': 'Text cannot be empty'
            }), 400
        
        if voice not in ['male', 'female']:
            return jsonify({
                'error': 'Invalid parameters',
                'message': 'Voice must be either "male" or "female"'
            }), 400
        
        if not (0.5 <= speed <= 2.0):
            return jsonify({
                'error': 'Invalid parameters',
                'message': 'Speed must be between 0.5 and 2.0'
            }), 400
        
        if audio_format not in ['mp3', 'wav']:
            return jsonify({
                'error': 'Invalid parameters',
                'message': 'Format must be either "mp3" or "wav"'
            }), 400
        
        # Create audio generation job
        audio_id = audio_service.create_audio_job(text, voice, speed, audio_format)
        
        # Start audio generation
        job_manager.start_audio_job(audio_id, text, voice, speed, audio_format)
        
        # Estimate time (rough estimate: 60 seconds per 1000 words)
        word_count = len(text.split())
        estimated_time = max(10, int((word_count / 1000) * 60))
        
        return jsonify({
            'audio_id': audio_id,
            'status': 'generating',
            'estimated_time': estimated_time,
            'message': 'Audio generation started'
        }), 202
        
    except Exception as e:
        return jsonify({
            'error': 'Audio generation failed',
            'message': str(e)
        }), 500

@audio_bp.route('/audio-status/<audio_id>', methods=['GET'])
def get_audio_status(audio_id):
    """Get the status of audio generation"""
    try:
        job = job_manager.get_audio_job(audio_id)
        
        if not job:
            return jsonify({
                'error': 'Audio job not found',
                'message': f'No audio job found with ID: {audio_id}'
            }), 404
        
        response = {
            'audio_id': audio_id,
            'status': job['status'],
            'progress': job['progress']
        }
        
        if job['status'] == 'completed':
            response['file_url'] = f'/api/download/{audio_id}'
            response['file_size'] = job.get('file_size', 0)
            response['duration'] = job.get('duration', 0)
            response['format'] = job.get('format', 'mp3')
        elif job['status'] == 'failed':
            response['error'] = job.get('error', 'Unknown error')
        elif job['status'] == 'generating':
            response['message'] = 'Generating audio...'
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get audio status',
            'message': str(e)
        }), 500

@audio_bp.route('/download/<audio_id>', methods=['GET'])
def download_audio(audio_id):
    """Download the generated audio file"""
    try:
        audio_path = audio_service.get_audio_path(audio_id)
        
        if not audio_path or not os.path.exists(audio_path):
            return jsonify({
                'error': 'Audio file not found',
                'message': 'The requested audio file does not exist or has expired'
            }), 404
        
        # Get file format
        file_ext = os.path.splitext(audio_path)[1][1:]
        mimetype = 'audio/mpeg' if file_ext == 'mp3' else 'audio/wav'
        
        return send_file(
            audio_path,
            mimetype=mimetype,
            as_attachment=True,
            download_name=f'audiobook_{audio_id[:8]}.{file_ext}'
        )
        
    except Exception as e:
        return jsonify({
            'error': 'Download failed',
            'message': str(e)
        }), 500
