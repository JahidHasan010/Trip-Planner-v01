export interface TripRequest {
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  interests: string;
  budget?: string;
  travelers?: string;
}

export interface TripResponse {
  status: string;
  message: string;
  itinerary?: string;
  error?: string;
}

const BACKEND_URL = ""; // Empty string for relative path to internal Next.js API
 

export async function sendTripRequest(data: TripRequest): Promise<TripResponse> {
  const response = await fetch(`${BACKEND_URL}/api/v1/plan-trip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Backend Error Response:", errText);
    throw new Error(`Backend error: ${response.status}`);
  }

  return (await response.json()) as TripResponse;
}