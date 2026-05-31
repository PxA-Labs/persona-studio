import gradio as gr
from transformers import pipeline

# Initialize pipeline for text generation
generator = pipeline('text-generation')

def evolve_influencer(personality, interests, aesthetics):
    # Generate text based on user input
    text = generator(f"Generate an influencer persona with {personality} personality, {interests} interests, and {aesthetics} aesthetics.", max_length=200)
    
    # Return the generated text
    return text[0]['generated_text']

# Create Gradio interface
interface = gr.Interface(
    fn=evolve_influencer,
    inputs=[
        gr.Textbox(label="Personality"),
        gr.Textbox(label="Interests"),
        gr.Textbox(label="Visual Aesthetics")
    ],
    outputs="text"
)

# Launch the interface
interface.launch()