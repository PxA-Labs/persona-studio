import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    let reqBody;
    try {
      reqBody = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'JSON Parse Error', details: e.message }, { status: 400 });
    }

    const { prompt, negativePrompt } = reqBody;

    const rawKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || process.env.HUGGING_FACE_API_KEY || '';
    const apiKey = rawKey.replace(/[^a-zA-Z0-9_-]/g, '');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key Missing' }, { status: 500 });
    }

    let hfResponse;
    try {
      hfResponse = await axios.post(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
          inputs: prompt || 'beautiful 8k portrait',
          parameters: { negative_prompt: negativePrompt || 'ugly' },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          responseType: 'arraybuffer',
        }
      );
    } catch (e) {
      if (e.response) {
        // Hugging Face rejected it (e.g., loading, invalid token, etc.)
        const errorString = e.response.data ? e.response.data.toString() : e.message;
        return NextResponse.json({ error: 'Hugging Face API Rejected Request', details: errorString }, { status: e.response.status });
      }
      return NextResponse.json({ error: 'Axios Network Error', details: e.message }, { status: 500 });
    }

    return new NextResponse(hfResponse.data, {
      status: 200,
      headers: { 'Content-Type': 'image/jpeg' },
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'CRITICAL_CRASH', details: error.message || String(error) }, { status: 500 });
  }
}
