const fs = require('fs');
const getAirports = require('../app/getAirports');
const airportsList = require('./airports.json');

describe.each(airportsList)('$iso', ({ chartIdent }) => {
  test(chartIdent.valid, async () => {
    const airport = getAirports([chartIdent.valid]);
    expect(airport[0]).toMatchObject({ ident: chartIdent.valid });
  });
});

describe('Multiple iso codes', () => {
  const identsList = airportsList.map((airport) => airport.chartIdent.valid);
  test(identsList.join(', '), () => {
    const airoports = getAirports(identsList);
    expect(airoports.map((airport) => airport.ident)).toEqual(expect.arrayContaining(airportsList.map((airport) => airport.chartIdent.valid)));
  });
});
