# Custom DL Model (LoRA) Training Strategy

This document outlines the roadmap and best practices for training a custom Deep Learning model (LoRA) for our AI Influencer. 

Our current architecture relies on standard Text-to-Image models (like FLUX.1) and Zero-Shot Face Swapping (InstantID). While powerful, the ultimate goal for perfect character consistency and extreme photorealism is to train a custom Low-Rank Adaptation (LoRA) model on a curated dataset of our influencer.

## Phase 1: Dataset Generation
We will use premium AI generation platforms (such as Tensor.art) to manually generate the training dataset. 

**Dataset Golden Rules:**
1. **Volume:** Generate exactly **20 to 30** high-quality, ultra-realistic images of the influencer.
2. **Identity Consistency:** Use FaceID, FaceSwap, or strict Seed Locking during generation so her facial structure remains 100% identical across all photos.
3. **Variety is Crucial:** 
   - 10 Close-up portrait shots
   - 10 Half-body shots (waist up)
   - 10 Full-body shots
4. **Environment & Clothing Diversity:** The AI will overfit to backgrounds and clothes if they repeat. Ensure every single photo has a different outfit and a different setting (e.g., gym, coffee shop, beach, studio, street style).
5. **Clean Subject:** Ensure the influencer is the *only* person in the photo. Do not include hands blocking the face, sunglasses, or hats (unless you want those items permanently baked into her identity).
6. **Resolution:** All images must be at least 1024x1024 pixels.

## Phase 2: Model Training
Once the dataset is compiled, we will train a FLUX or SDXL LoRA.

1. **Captioning:** Each image in the dataset must be captioned. Use a simple trigger word (e.g., `ohwx woman`) and describe the outfit and background. Do *not* describe her facial features in the captions, so the AI learns to associate the trigger word exclusively with her face.
2. **Compute:** Rent a cloud GPU (e.g., A100 or H100 via RunPod, Fal.ai, or Replicate) to run the training script. Training a LoRA typically takes 1 to 2 hours.
3. **Testing:** Generate test images using the new `.safetensors` LoRA file to ensure her face resembles the dataset without looking distorted.

## Phase 3: Integration
Once the LoRA is successfully trained:
1. Host the custom LoRA on a high-speed inference API (like Fal.ai, Replicate, or Tensor.art).
2. Rewrite the backend API routes in `app.py` to target our custom model endpoint instead of the standard Hugging Face serverless tier.
3. The Vercel frontend will immediately begin generating perfect, photorealistic images of the influencer simply by invoking her trigger word.
