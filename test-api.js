
import https from 'https';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function test() {
  const url = 'https://cms.aurahomeoffice.com/wp-json/wp/v2/posts?slug=portable-power-station';
  try {
    const data = await get(url);
    if (data.length > 0) {
      const p = data[0];
      const { content, excerpt, ...rest } = p;
      console.log('Post structure:', JSON.stringify(rest, null, 2));
    } else {
      console.log('No post found');
    }
  } catch (e) {
    console.error(e);
  }
}
test();
