const fs = require('fs');

module.exports = (countryCodes) => {
  const link = fs.readFileSync(`${process.cwd()}/completed.txt`, { encoding: 'utf8', flag: 'r' });
  const countries = link?.split('#')[1]?.split(',') || [];
  countries.push(...countryCodes);
  const uniqueCountries = [...new Set(countries)].sort();
  fs.writeFileSync(`${process.cwd()}/completed.txt`, `https://www.amcharts.com/visited_countries/#${uniqueCountries.join(',')}`, {
    encoding: 'utf8',
    flag: 'w'
  });
};
