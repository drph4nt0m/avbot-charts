const fs = require('fs');
const getAirport = require('../app/getAirport');

test('IN', async () => {
  const icao = 'VABB';
  const airport = getAirport(icao);
  expect(airport).toMatchObject({ ident: 'VABB' });
});

test('TH', async () => {
  const icao = 'VTBU';
  const airport = getAirport(icao);
  expect(airport).toMatchObject({ ident: 'VTBU' });
});

test('US', async () => {
  const icao = 'KJFK';
  const airport = getAirport(icao);
  expect(airport).toMatchObject({ ident: 'KJFK' });
});
