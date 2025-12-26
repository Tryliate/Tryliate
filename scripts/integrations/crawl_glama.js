const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

function extractCount(html, label) {
  // Pattern: Label followed immediately by number (like in the text view) or separated by optional tags/spaces
  // Text view showed "Remote5,312"
  const regex = new RegExp(`${label}\\s*([0-9,]+)`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '0';
}

async function run() {
  console.log('--- Trymate Crawler Report ---');

  // 1. SERVERS
  try {
    const html = await fetchUrl('https://glama.ai/mcp/servers');

    // Based on previous observation: "Remote5,312", "Official757"
    // The "Remote" category is usually the largest subclass of servers.
    // There is no single "All Servers" number visible in the snippets, but "Remote" + "Local" might overlap or sum up.
    // Let's grab the key indicators observed.

    const remote = extractCount(html, 'Remote');
    const official = extractCount(html, 'Official');
    const python = extractCount(html, 'Python');
    const ts = extractCount(html, 'TypeScript');

    // Heuristic: If there is a "Showing X results"
    const showingMatch = html.match(/([0-9,]+)\s+results/i);
    const total = showingMatch ? showingMatch[1] : remote; // Fallback to Remote count if no grand total

    console.log(`Servers: ~${total} (Remote: ${remote}, Official: ${official})`);

  } catch (e) {
    console.error('Servers Check Failed:', e.message);
  }

  // 2. TOOLS
  try {
    const html = await fetchUrl('https://glama.ai/mcp/tools');
    // Tools page doesn't have the same sidebar in the snippet, but let's check for result counts
    // The previous text snippet didn't show a sidebar.

    const showingMatch = html.match(/([0-9,]+)\s+results/i) || html.match(/([0-9,]+)\s+tools/i);
    if (showingMatch) {
      console.log(`Tools: ${showingMatch[1]}`);
    } else {
      // Estimate based on list length if small, but likely huge.
      // Let's try to count 'Star Icon' occurrences / 5 to estimate items on page? No.
      console.log('Tools: Count not explicitly found in HTML text. (Needs deeper scan)');
    }
  } catch (e) { console.error(e); }

  // 3. CLIENTS
  try {
    const html = await fetchUrl('https://glama.ai/mcp/clients');
    // Clients page showed a list: "5ire", "AIaW", etc.
    // We can count the number of <h3> or specific unique links? 
    // In the snippet, it's a list.
    // Let's count occurrences of specific known classes or link patterns if possible.
    // Or just look for "Clients ([0-9]+)"

    const countMatch = html.match(/Clients\s*\(([0-9]+)\)/i);
    const items = (html.match(/href="\/mcp\/clients\//g) || []).length;

    console.log(`Clients: ${countMatch ? countMatch[1] : items} (Estimated from links)`);
  } catch (e) { console.error(e); }

}

run();
