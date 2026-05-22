import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let reqBody;
    try {
      reqBody = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'JSON Parse Error', details: e.message }, { status: 400 });
    }

    const { prompt, negativePrompt } = reqBody;

    // Aggressively strip ALL invisible characters, newlines, and zero-width spaces that users accidentally copy/paste
    const rawKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || process.env.HUGGING_FACE_API_KEY || '';
    const apiKey = rawKey.replace(/[^a-zA-Z0-9_-]/g, '');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key Missing' }, { status: 500 });
    }

    let hfResponse;
    try {
      hfResponse = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: prompt || 'beautiful 8k portrait',
            parameters: { negative_prompt: negativePrompt || 'ugly' },
          }),
        }
      );
    } catch (e) {
      return NextResponse.json({ error: 'Hugging Face Network Error', details: e.message }, { status: 500 });
    }

    if (!hfResponse.ok) {
      const errorData = await hfResponse.text();
      return NextResponse.json({ error: 'Hugging Face API Rejected Request', details: errorData }, { status: hfResponse.status });
    }

    let imageBuffer;
    try {
      const imageBlob = await hfResponse.blob();
      imageBuffer = await imageBlob.arrayBuffer();
    } catch (e) {
      return NextResponse.json({ error: 'Blob Processing Error', details: e.message }, { status: 500 });
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: { 'Content-Type': 'image/jpeg' },
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'CRITICAL_CRASH', details: error.message || String(error) }, { status: 500 });
  }
}
