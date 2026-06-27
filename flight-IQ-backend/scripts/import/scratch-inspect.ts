import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@fast-csv/parse';

const csvPath = path.resolve(__dirname, '../../data/ntsb/events.csv');
const stream = fs.createReadStream(csvPath);

const uniqueVals = new Set<string>();
let count = 0;

const parser = parse({ headers: false })
  .on('data', (row: string[]) => {
    count++;
    if (row[52]) uniqueVals.add(row[52]);
    if (count >= 10000) {
      console.log('Unique values at index 52:', Array.from(uniqueVals));
      parser.destroy();
      process.exit(0);
    }
  })
  .on('error', (err) => {
    console.error(err);
  });

stream.pipe(parser);
