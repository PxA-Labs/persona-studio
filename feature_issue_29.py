# app.py
from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load the image generation model
model = load_model('image_generation_model.h5')

def generate_image(hair_color, skin_tone, clothing_style):
    # Use the model to generate an image based on the input parameters
    image = model.predict(np.array([hair_color, skin_tone, clothing_style]))
    return Image.fromarray((image * 255).astype(np.uint8))

# Define a route for the virtual influencer generator
@app.route('/generate_influencer', methods=['POST'])
def generate_influencer():
    data = request.json
    hair_color = data['hair_color']
    skin_tone = data['skin_tone']
    clothing_style = data['clothing_style']
    
    # Generate the image
    image = generate_image(hair_color, skin_tone, clothing_style)
    
    # Save the image to a file
    image.save('generated_influencer.png')
    
    # Return a success response
    return jsonify({'message': 'Influencer generated successfully'})

if __name__ == '__main__':
    app.run(debug=True)