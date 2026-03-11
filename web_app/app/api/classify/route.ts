import { NextRequest, NextResponse } from 'next/server';

// Hugging Face Spaces BERT Document Classifier API
// FIXED: Removed /api/ from the path - your HF Space uses /predict directly
const HF_API_URL = 'https://murtazamajid-bert-document-classifier.hf.space/predict';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "text" field' },
        { status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text must be at least 10 characters long' },
        { status: 400 }
      );
    }

    console.log('[API] Calling HF API with text:', text.substring(0, 50) + '...');

    // Call the Hugging Face BERT classifier
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] HF API error:', response.status, response.statusText, errorText);
      return NextResponse.json(
        { error: 'Classification service temporarily unavailable' },
        { status: 503 }
      );
    }

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error('[API] Failed to parse HF API response:', parseError);
      return NextResponse.json(
        { error: 'Invalid response from classification service' },
        { status: 502 }
      );
    }

    console.log('[API] HF API Response:', result);

    // Your HF API returns: { text: "...", predicted_category: "...", success: true }
    // Transform to your frontend's expected format
    if (result.success && result.predicted_category) {
      return NextResponse.json({
        primary_category: result.predicted_category,
        primary_score: 0.95, // HF API doesn't return confidence scores
        predictions: [
          {
            category: result.predicted_category,
            score: 0.95,
            index: 0,
          }
        ],
        original_text: result.text,
      }, { status: 200 });
    } else {
      console.error('[API] Unexpected response format:', result);
      return NextResponse.json(
        { error: 'Unexpected response format from classification service' },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error('[API] Error:', error instanceof Error ? error.message : String(error));
    console.error('[API] Full error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Test with a simple health check
    const healthResponse = await fetch(
      'https://murtazamajid-bert-document-classifier.hf.space/health',
      { method: 'GET' }
    );

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      return NextResponse.json({ 
        status: 'healthy', 
        service: 'HuggingFace Spaces',
        hf_status: healthData 
      });
    }
    
    return NextResponse.json({ 
      status: 'unhealthy',
      message: 'HF API returned non-OK status'
    }, { status: 503 });
    
  } catch (error) {
    console.error('[API] Health check error:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Cannot reach HuggingFace API',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 503 }
    );
  }
}