import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, negativePrompt } = await request.json();

    const apiKey = process.env.HUGGING_FACE_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'Hugging Face API Key is missing. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    // We are using Stable Diffusion XL Base 1.0 which is excellent for photorealism
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
          }
        }),
      }
    );

    if (!response.ok) {
      // Hugging face sometimes returns a 503 if the model is loading. We pass this to the frontend.
      const errorData = await response.text();
      return NextResponse.json({ error: 'Failed to generate image', details: errorData }, { status: response.status });
    }

    // The API returns the image as a raw binary blob
    const imageBlob = await response.blob();
    
    // Convert blob to base64 so we can easily display it in the browser
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    return NextResponse.json({ imageUrl: base64Image });
    
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
