import 'dotenv/config';

async function testPlanespottersAPI(registration: string) {
  const url = `https://api.planespotters.net/pub/photos/reg/${registration}`;
  console.log(`Fetching from: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'FlightIQ-Backend-Dev (test script)',
      }
    });
    
    if (!res.ok) {
      console.log(`Failed with status: ${res.status}`);
      return;
    }
    
    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      console.log('Success! Found photo:');
      console.log(data.photos[0].thumbnail_large.src);
    } else {
      console.log('No photos found for this registration.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testPlanespottersAPI('N315AA'); // Random American Airlines registration
