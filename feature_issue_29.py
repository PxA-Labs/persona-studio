# app.py
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
import logging
import uuid
import os

app = Flask(__name__)
app.config['MODEL_PATH'] = 'image_generation_model.h5'

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the image generation model
try:
    model = load_model(app.config['MODEL_PATH'])
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    raise

def generate_image(hair_color, skin_tone, clothing_style):
    """
    Use the model to generate an image based on the input parameters.

    Args:
    hair_color (float): Hair color value
    skin_tone (float): Skin tone value
    clothing_style (float): Clothing style value

    Returns:
    Image: Generated image
    """
    try:
        # Validate input values
        if not (0 <= hair_color <= 1) or not (0 <= skin_tone <= 1) or not (0 <= clothing_style <= 1):
            raise ValueError("Input values must be between 0 and 1")

        # Use the model to generate an image
        image = model.predict(np.array([hair_color, skin_tone, clothing_style]))
        return Image.fromarray((image * 255).astype(np.uint8))
    except Exception as e:
        logger.error(f"Failed to generate image: {e}")
        raise

# Define a route for the virtual influencer generator
@app.route('/generate_influencer', methods=['POST'])
def generate_influencer():
    # Check if the request is JSON
    if not request.is_json:
        return jsonify({'error': 'Invalid request, JSON expected'}), 400

    data = request.json
    required_keys = ['hair_color', 'skin_tone', 'clothing_style']

    # Validate input data
    if not all(key in data for key in required_keys):
        return jsonify({'error': 'Missing required keys'}), 400

    hair_color = data['hair_color']
    skin_tone = data['skin_tone']
    clothing_style = data['clothing_style']

    try:
        # Generate the image
        image = generate_image(hair_color, skin_tone, clothing_style)

        # Save the image to a file with a unique filename
        filename = f"generated_influencer_{uuid.uuid4()}.png"
        image.save(filename)

        # Return a success response
        return jsonify({'message': 'Influencer generated successfully', 'filename': filename})
    except Exception as e:
        logger.error(f"Failed to process request: {e}")
        return jsonify({'error': 'Failed to generate influencer'}), 500

if __name__ == '__main__':
    app.run(debug=True)