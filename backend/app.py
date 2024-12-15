import io
import sys
import os
from PIL import Image
from rembg import remove
from flask import Flask, request, send_file
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [os.environ.get('FRONTEND_URL', 'http://localhost:3000')],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

UPLOAD_FOLDER = '/app/uploads'

def remove_background(filename):
    img = Image.open(filename).convert("RGBA")
    img_array = np.array(img)
    result = remove(img_array)
    return Image.fromarray(result)

@app.route('/')
def index():
    return "Hello World"

@app.route('/upload', methods=['POST'])
def upload():
    filename = request.json['filename']
    result_image = remove_background(UPLOAD_FOLDER + '/' + filename)
    output = io.BytesIO()
    result_image.save(output, format='PNG')
    output.seek(0)
    return send_file(output, mimetype='image/png')

if __name__ == '__main__':
    filename = sys.argv[1]
    result_image = remove_background(filename)
    result_image.save(f'{filename}_result.png')