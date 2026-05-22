import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

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

    const hf = new HfInference(apiKey);

    let imageBlob;
    try {
      imageBlob = await hf.textToImage({
        model: 'black-forest-labs/FLUX.1-schnell',
        inputs: prompt || 'beautiful 8k portrait',
        parameters: { negative_prompt: negativePrompt || 'ugly' }
      });
    } catch (e) {
      return NextResponse.json({ error: 'Hugging Face API Rejected Request', details: String(e) }, { status: 500 });
    }

    const imageBuffer = await imageBlob.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: { 'Content-Type': 'image/jpeg' },
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'CRITICAL_CRASH', details: error.message || String(error) }, { status: 500 });
  }
}
