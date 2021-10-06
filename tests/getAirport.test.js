const fs = require('fs');
const getAirport = require('../app/getAirport');
const airports = require('./airports.json');

describe.each(airports)('$iso', ({ chartIdent }) => {
  test(chartIdent.valid, async () => {
    const airport = getAirport(chartIdent.valid);
    expect(airport).toMatchObject({ ident: chartIdent.valid });
  });
});
