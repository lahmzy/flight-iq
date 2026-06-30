import 'dotenv/config';

async function testWikimediaAPI(query: string) {
  // Search Commons for the registration number in the File namespace (namespace 6)
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json`;
  console.log(`Fetching from: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'FlightIQ-Backend-Dev (test script; email@example.com)',
      }
    });
    
    if (!res.ok) {
      console.log(`Failed with status: ${res.status}`);
      return;
    }
    
    const data = await res.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages) as any[];
      if (pages.length > 0) {
        // get the first one
        const page = pages[0];
        if (page.imageinfo && page.imageinfo.length > 0) {
          console.log(`\nFound image URL: ${page.imageinfo[0].url}`);
        }
      }
    } else {
      console.log('No results found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testWikimediaAPI('N315AA');
testWikimediaAPI('Boeing 737');
