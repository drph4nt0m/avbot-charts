const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const airports = fs.readFileSync('airports.csv', { encoding: 'utf8', flag: 'r' });
const parsed = parse(airports, {
  columns: true,
  skip_empty_lines: true
});

module.exports = (icaoCode) => {
  let airport = null;
  parsed.forEach((row) => {
    if (row.ident === icaoCode) {
      airport = row;
    }
  });
  return airport;
};
