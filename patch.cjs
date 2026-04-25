const fs = require('fs');

function patchFile(filePath, wrapper) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('try {') && content.includes('export default async function handler')) {
    content = content.replace(
      /(export default async function handler\(req: VercelRequest, res: VercelResponse\) \{)/,
      `$1\n  try {`
    );
    // Find the last brace
    const lastBraceIndex = content.lastIndexOf('}');
    content = content.substring(0, lastBraceIndex) + `  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message || String(error),
      stack: error.stack
    });
  }\n}`
    fs.writeFileSync(filePath, content);
    console.log('Patched', filePath);
  }
}

patchFile('./api/auth/login.ts');
patchFile('./api/journey/index.ts');
