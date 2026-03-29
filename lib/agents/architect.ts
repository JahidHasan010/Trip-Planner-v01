import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Architect Agent: Constructs a dossier strictly tailored to the user's interests and DATE RANGE.
 */
export async function constructItinerary(userData: any, researchData: any) {
  const { origin, destination, start_date, end_date, interests, budget, travelers } = userData;

  const start = new Date(start_date);
  const end = new Date(end_date);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Create a list of day headers to force the model to see them
  const dayList = Array.from({ length: totalDays }, (_, i) => `Day ${i + 1}`).join(', ');

  const systemPrompt = `
You are an Elite AI Travel Consultant. 

### THE ABSOLUTE MANDATE:
The user has booked a ${totalDays}-DAY TRIP.
You MUST provide a detailed, unique itinerary for EACH of these ${totalDays} days.
The days you must generate are: ${dayList}.

DO NOT STOP after one day. 
DO NOT combine days.
If you do not generate all ${totalDays} days, the user will be stranded.

### MANDATORY OUTPUT STRUCTURE:

# 🌸 ${destination} Travel Guide

**Travel Soul:** ${interests}  
**Route:** ${origin} → ${destination}  
**Trip Length:** ${totalDays} Days
**Travel Window:** ${start_date} – ${end_date}

---

# ✈️ Flight & Arrival Information
[Include Airport and Flight tables]

---

# 🏨 Recommended Accommodation
[Hotel table tailored to "${budget}" budget]

---

# 📅 Day-by-Day Itinerary

[REPEAT THE FOLLOWING BLOCK FOR DAY 1 ALL THE WAY TO DAY ${totalDays}]

## Day X — [Theme]
### 🌅 Morning
- **Description:** [How it matches interests]
- **Top 3 Attractions:** [1, 2, 3]
### ☀️ Afternoon
[Top 3 Attractions]
### 🌙 Evening
[Top 3 Highlights]
### 🍽 Food Recommendations
[Table]
### 🍲 Must-Try Dish
[Emoji + Name + Description]
### ⏱ Travel & Tips
[Timing info]

---

# 🎟 Free vs Paid Activities
[Table]

---

# 💰 Estimated Trip Budget
[Realistic Table]
**Estimated Total:** Bold calculation

---

# 🧭 Best Areas to Stay
[Table]

---

# 🛍 Local Foods & Shopping
[List]

---

# 🎒 What to Pack
[Checklist]

---

# 💡 Pro Travel Tips
✔ Custom tips for "${interests}" in ${destination}.

### STRICT CONSTRAINTS:
1. NO INTRO OR OUTRO CHATTER.
2. GENERATE ALL ${totalDays} DAYS INDIVIDUALLY AND IN FULL DETAIL.
3. USE LOCAL CURRENCY.
  `;

  const userPrompt = `
    CLIENT DATA:
    - Origin: ${origin}
    - Destination: ${destination}
    - Total Days to Generate: ${totalDays} (${dayList})
    - Interests: ${interests}
    - Budget: ${budget}

    RESEARCH DATA:
    ${researchData.snippets}
    ${researchData.fullContent}

    TASK: Generate the COMPLETE Professional Travel Dossier for all ${totalDays} days now.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error('❌ OpenAI Error:', err);
    throw new Error('Failed to architect the itinerary.');
  }
}
