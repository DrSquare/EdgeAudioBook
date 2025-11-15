"""Flask application factory"""
from flask import Flask
from flask_cors import CORS
from config import config
import os

def create_app(config_name='default'):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Enable CORS for all routes
    CORS(app)
    
    # Ensure required directories exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['EXTRACTED_FOLDER'], exist_ok=True)
    os.makedirs(app.config['AUDIO_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from app.routes.health_routes import health_bp
    from app.routes.upload_routes import upload_bp
    from app.routes.audio_routes import audio_bp
    
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(audio_bp, url_prefix='/api')
    
    return app
