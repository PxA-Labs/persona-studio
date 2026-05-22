import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';

export async function POST(request) {
  try {
    const { prompt, negativePrompt } = await request.json();

    const apiKey = process.env.HUGGING_FACE_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { error: 'Hugging Face API Key is missing in Vercel Environment Variables.' },
        { status: 500 }
      );
    }

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
      const errorData = await response.text();
      return NextResponse.json({ error: 'Failed to generate image from Hugging Face', details: errorData }, { status: response.status });
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    return NextResponse.json({ imageUrl: base64Image });
    
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
