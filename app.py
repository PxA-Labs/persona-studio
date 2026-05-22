from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
from gradio_client import Client, handle_file
import os
import io
import base64
import tempfile

app = FastAPI()

# Allow CORS so Vercel frontend can call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

hf_token = os.environ.get("HUGGING_FACE_API_KEY")
if hf_token:
    hf_token = hf_token.strip()
else:
    print("WARNING: HUGGING_FACE_API_KEY environment variable is not set!")
    
hf_client = InferenceClient(token=hf_token)

class GenerateRequest(BaseModel):
    prompt: str
    negative_prompt: str = ""
    seed: int = None
    face_image_base64: str = None

@app.get("/")
def read_root():
    return {"message": "Persona Studio Python Backend is running!"}

@app.post("/api/generate")
async def generate_image(req: GenerateRequest):
    try:
        # Branch 1: Face Swap using InstantID (Gradio API Hack)
        if req.face_image_base64:
            base64_data = req.face_image_base64
            if "," in base64_data:
                base64_data = base64_data.split(",")[1]
                
            img_data = base64.b64decode(base64_data)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                tmp.write(img_data)
                tmp_path = tmp.name
                
            gradio_client = Client("InstantX/InstantID")
            result = gradio_client.predict(
                face_image_path=handle_file(tmp_path),
                pose_image_path=None,
                prompt=req.prompt,
                negative_prompt=req.negative_prompt,
                style_name="(No style)",
                num_steps=30,
                identitynet_strength_ratio=0.8,
                adapter_strength_ratio=0.8,
                canny_strength=0.4,
                depth_strength=0.4,
                controlnet_selection=["depth"],
                guidance_scale=5.0,
                seed=req.seed if req.seed is not None else 42,
                scheduler="EulerDiscreteScheduler",
                enable_LCM=False,
                enhance_face_region=True,
                api_name="/generate_image"
            )
            
            # Extract image path from Gradio tuple response
            image_list = result[0] if isinstance(result, tuple) else result
            if isinstance(image_list, list) and len(image_list) > 0:
                final_img_path = image_list[0].get("path")
            else:
                final_img_path = image_list
                
            with open(final_img_path, "rb") as f:
                img_byte_arr = f.read()
                
            os.remove(tmp_path)
            return Response(content=img_byte_arr, media_type="image/jpeg")

        # Branch 2: Blazing Fast Text-to-Image (FLUX.1-schnell)
        parameters = {}
        if req.negative_prompt:
            parameters["negative_prompt"] = req.negative_prompt
        if req.seed is not None:
            parameters["seed"] = req.seed
            
        image = hf_client.text_to_image(
            req.prompt,
            model="black-forest-labs/FLUX.1-schnell",
            parameters=parameters
        )
        
        # Convert PIL Image to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        return Response(content=img_byte_arr, media_type="image/jpeg")
    except Exception as e:
        print(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
