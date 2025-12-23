import * as fs from 'fs';

const csv = fs.readFileSync('docs/auto part workflow/Clean Data for import/SUPABASE_ALL_PARTS.csv', 'utf-8');
const lines = csv.split('\n').slice(1).filter(l => l.trim());

interface Part {
  id: string;
  name: string;
  partNumber: string;
  brand: string;
}

// Parse CSV properly handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const parts: Part[] = lines.map(line => {
  const cols = parseCSVLine(line);
  return {
    id: cols[0] || '',
    name: cols[1] || '',
    partNumber: cols[2] || '',
    brand: cols[3] || ''
  };
});

// Check duplicate by part number
const byPartNumber: Record<string, Part[]> = {};
parts.forEach(p => {
  if (p.partNumber && p.partNumber !== 'N/A' && p.partNumber !== '') {
    if (!byPartNumber[p.partNumber]) byPartNumber[p.partNumber] = [];
    byPartNumber[p.partNumber].push(p);
  }
});

const dupByPartNum = Object.entries(byPartNumber).filter(([k, v]) => v.length > 1);

// Check duplicate by name
const byName: Record<string, Part[]> = {};
parts.forEach(p => {
  const name = p.name?.toLowerCase().trim();
  if (name && name.length > 0) {
    if (!byName[name]) byName[name] = [];
    byName[name].push(p);
  }
});

const dupByName = Object.entries(byName).filter(([k, v]) => v.length > 1);

console.log('=== DUPLICATE ANALYSIS ===');
console.log('Total parts:', parts.length);
console.log('');
console.log('Duplicates by Part Number:', dupByPartNum.length, 'groups');
dupByPartNum.slice(0, 10).forEach(([pn, items]) => {
  console.log('  Part#', pn, '->', items.length, 'items:', items.map(i => i.id).join(', '));
});
if (dupByPartNum.length > 10) console.log('  ... and', dupByPartNum.length - 10, 'more groups');

console.log('');
console.log('Duplicates by Name:', dupByName.length, 'groups');
dupByName.slice(0, 10).forEach(([name, items]) => {
  const shortName = name.length > 60 ? name.substring(0, 60) + '...' : name;
  console.log('  "' + shortName + '" ->', items.length, 'items');
});
if (dupByName.length > 10) console.log('  ... and', dupByName.length - 10, 'more groups');

// Count total duplicate records
const totalDupByPartNum = dupByPartNum.reduce((sum, [k, v]) => sum + v.length - 1, 0);
const totalDupByName = dupByName.reduce((sum, [k, v]) => sum + v.length - 1, 0);

console.log('');
console.log('=== SUMMARY ===');
console.log('Unique IDs:', parts.length);
console.log('Duplicate Part Numbers:', totalDupByPartNum, 'extra records in', dupByPartNum.length, 'groups');
console.log('Duplicate Names:', totalDupByName, 'extra records in', dupByName.length, 'groups');
