import io
import os
import re
from PIL import Image
from rembg import remove
from flask import Flask, request, send_file
from flask_cors import CORS
import numpy as np
import secrets

UPLOAD_FOLDER = '/app/uploads'

def create_app(*args, **kwargs):
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_urlsafe(32))
    CORS(app, resources={
        r"/*": {
            "origins": [os.environ.get('FRONTEND_URL', 'http://localhost:3000')],
            "methods": ["GET", "POST"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    def remove_background(filename):
        print("### Removing background from: ", filename)
        img = Image.open(filename).convert("RGBA")
        img_array = np.array(img)
        result = remove(img_array)
        return Image.fromarray(result)

    @app.route('/')
    def index():
        return "Hello World"

    @app.route('/upload', methods=['POST'])
    def upload():
        auth_token = request.json['key']
        if not auth_token:
            return "Unauthorized", 401
        if auth_token != app.config['SECRET_KEY']:
            return "Unauthorized", 401
        filename = request.json['filename']
        filename = re.sub(r'[^a-zA-Z0-9_]', '_', filename)
        result_image = remove_background(UPLOAD_FOLDER + '/' + filename)
        output = io.BytesIO()
        result_image.save(output, format='PNG')
        output.seek(0)
        
        response = send_file(
            output,
            mimetype='image/png',
            as_attachment=False,
            download_name='processed.png'
        )
        response.headers['Cache-Control'] = 'no-cache'
        os.remove(UPLOAD_FOLDER + '/' + filename)
        return response
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)