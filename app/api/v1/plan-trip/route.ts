import { NextRequest, NextResponse } from 'next/server';
import { performResearch } from '@/lib/agents/researcher';
import { constructItinerary } from '@/lib/agents/architect';
import { getCachedItinerary, setCachedItinerary, generateCacheKey } from '@/lib/redis';

/**
 * Main API Route for Celestia Journey Trip Planner
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, budget, travelers, interests } = body;

    // 1. Validation
    if (!destination) {
      return NextResponse.json({ status: 'error', message: 'Destination is required.' }, { status: 400 });
    }

    // 2. Check Cache (Upstash Redis)
    const cacheKey = generateCacheKey(body);
    const cachedData = await getCachedItinerary(cacheKey);
    
    if (cachedData) {
      console.log('✅ Serving from Cache:', cacheKey);
      return NextResponse.json({
        status: 'success',
        message: 'Itinerary retrieved from cache.',
        itinerary: cachedData
      });
    }

    console.log('🔍 Cache Miss. Starting Real-Time Research for:', destination);

    // 3. Step 1: Researcher Agent (Serper + Jina)
    const dates = `${body.start_date} to ${body.end_date}`;
    const researchResults = await performResearch(body.origin, body.destination, body.interests, dates, body.budget);

    // 4. Step 2: Architect Agent (OpenAI GPT-4o)
    const finalItinerary = await constructItinerary(body, researchResults);

    console.log('--- GENERATED ITINERARY START ---');
    console.log(finalItinerary);
    console.log('--- GENERATED ITINERARY END ---');

    // 5. Save to Cache
    if (finalItinerary) {
      await setCachedItinerary(cacheKey, finalItinerary);
    }

    return NextResponse.json({
      status: 'success',
      message: 'Itinerary generated successfully.',
      itinerary: finalItinerary
    });

  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message || 'An unexpected error occurred.',
    }, { status: 500 });
  }
}
