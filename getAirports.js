const fs = require("fs");
const parse = require("csv-parse/lib/sync");

const airports = fs.readFileSync('airports.csv', { encoding: 'utf8', flag: 'r' });
const parsed = parse(airports, {
  columns: true,
  skip_empty_lines: true
})

module.exports = (countryCode) => {
  const res = [];
  parsed.forEach(row => {
    if (row.iso_country === countryCode) {
      res.push(row.ident)
    }
  });
  return res;
}