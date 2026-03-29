import axios from 'axios';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

/**
 * Researcher Agent: Performs interest-driven real-time searches.
 */
export async function performResearch(origin: string, destination: string, interests: string, dates: string, budget: string) {
  // We split the interests to create hyper-targeted searches
  const interestList = interests.split(',').map(i => i.trim()).slice(0, 3);
  
  const queries = [
    `Current best ${interests} activities in ${destination} for ${dates} 2026`,
    ...interestList.map(interest => `Top hidden gems for ${interest} in ${destination} 2025 2026`),
    `Flight prices from ${origin} to ${destination} ${dates}`,
    `Highly rated ${budget} hotels in ${destination} for ${dates}`
  ];
  
  try {
    const searchResults = await Promise.all(
      queries.map(q => 
        axios.post('https://google.serper.dev/search', 
          { q, num: 4 },
          { headers: { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' } }
        )
      )
    );

    const allOrganicResults: SearchResult[] = searchResults.flatMap(res => res.data.organic || []);
    
    // Scrape the top 2 most relevant deep-dive guides
    const scrapedData = await Promise.all(
      allOrganicResults.slice(0, 2).map(async (res) => {
        try {
          const jinaUrl = `https://r.jina.ai/${res.link}`;
          const scrapeRes = await axios.get(jinaUrl, { timeout: 8000 });
          return `Source: ${res.link}\nContent: ${scrapeRes.data.substring(0, 3500)}`;
        } catch (e) {
          return "";
        }
      })
    );

    return {
      snippets: allOrganicResults.map(r => `${r.title}: ${r.snippet}`).join('\n\n'),
      fullContent: scrapedData.join('\n---\n')
    };
  } catch (err) {
    console.error('❌ Research Error:', err);
    return { snippets: 'No real-time data found.', fullContent: '' };
  }
}
