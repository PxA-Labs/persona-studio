from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
import os
import io

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

@app.get("/")
def read_root():
    return {"message": "Persona Studio Python Backend is running!"}

@app.post("/api/generate")
async def generate_image(req: GenerateRequest):
    try:
        image = hf_client.text_to_image(
            req.prompt,
            model="black-forest-labs/FLUX.1-schnell",
            negative_prompt=req.negative_prompt
        )
        
        # Convert PIL Image to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        return Response(content=img_byte_arr, media_type="image/jpeg")
    except Exception as e:
        print(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
