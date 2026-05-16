import { getDocument } from './node_modules/pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync, readdirSync } from 'fs';

const files = readdirSync('.').filter(f => f.endsWith('.pdf'));

async function extractText(filePath) {
  const data = new Uint8Array(readFileSync(filePath));
  const loadingTask = getDocument({ data, useSystemFonts: true });
  const doc = await loadingTask.promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

for (const file of files) {
  console.log('=== FILE: ' + file + ' ===');
  try {
    const text = await extractText(file);
    console.log(text);
  } catch(e) {
    console.log('Error:', e.message);
  }
}
