const fs = require('fs');
const getAirport = require('../app/getAirport');
const airports = require('./airports.json');

describe.each(airports)('$iso', ({ ident }) => {
  test(ident, async () => {
    const airport = getAirport(ident);
    expect(airport).toMatchObject({ ident });
  });
});
