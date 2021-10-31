const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const airportsRawData = fs.readFileSync('airports.csv', { encoding: 'utf8', flag: 'r' });
const parsed = parse(airportsRawData, {
  columns: true,
  skip_empty_lines: true
});

module.exports = (icaoCodes) => {
  const airports = [];

  parsed.forEach((row) => {
    if (icaoCodes.includes(row.ident)) {
      if (row.type !== 'heliport' && row.type !== 'closed') {
        airports.push(row);
      }
    }
  });

  return airports;
};
