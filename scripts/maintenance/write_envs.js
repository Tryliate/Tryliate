const fs = require('fs');
const path = require('path');

const content = `NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
LOGO_DEV_SECRET_KEY=YOUR_SECRET_KEY
GROQ_API_KEY=YOUR_GROQ_API_KEY
`;

fs.writeFileSync(path.join(__dirname, '.env.local'), content);
fs.writeFileSync(path.join(__dirname, '../../.env'), content);
console.log('Files written successfully');
