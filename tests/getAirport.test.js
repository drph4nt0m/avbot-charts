const fs = require('fs');
const getAirport = require('../app/getAirport');

test('AL', async () => {
  const icao = 'LAKU';
  const airport = getAirport(icao);
  expect(airport).toMatchObject({ ident: 'LAKU' });
});

test('IN', async () => {
  const icao = 'VABB';
  const airport = getAirport(icao);
  expect(airport).toMatchObject({ ident: 'VABB' });
});

test('US', async () => {
  const icao = 'KJFK';
  const airport = getAirport(icao);
  expect(airport).toMatchObject({ ident: 'KJFK' });
});
