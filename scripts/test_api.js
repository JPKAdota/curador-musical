
async function testApi() {
    try {
        const response = await fetch('http://localhost:3000/api/tracks');
        const data = await response.json();
        console.log(`Tracks returned: ${data.tracks.length}`);
        if (data.tracks.length > 0) {
            console.log('First track:', data.tracks[0].title);
            console.log('Last track:', data.tracks[data.tracks.length - 1].title);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testApi();
