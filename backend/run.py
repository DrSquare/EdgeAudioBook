"""Main application entry point"""
import os
from app import create_app

# Get configuration from environment or use default
config_name = os.environ.get('FLASK_ENV', 'development')

# Create Flask app
app = create_app(config_name)

if __name__ == '__main__':
    # Run the application
    host = app.config.get('HOST', '0.0.0.0')
    port = app.config.get('PORT', 5000)
    debug = app.config.get('DEBUG', True)
    
    print(f"Starting EdgeAudioBook API Server on {host}:{port}")
    print(f"Debug mode: {debug}")
    print(f"API available at: http://localhost:{port}/api")
    
    app.run(host=host, port=port, debug=debug)
