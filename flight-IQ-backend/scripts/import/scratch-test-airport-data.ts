import 'dotenv/config';

async function testAirportDataAPI(registration: string) {
  const url = `https://airport-data.com/api/ac_thumb.json?m=${registration}`;
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
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAirportDataAPI('N315AA');
