const fs = require('fs');
const getAirport = require('../app/getAirport');

describe('India', () => {
  test('valid', async () => {
    const icao = "VABB";
    const airport = getAirport(icao);
    const expecting = {
      id: '26434',
      ident: 'VABB',
      type: 'large_airport',
      name: 'Chhatrapati Shivaji International Airport',
      latitude_deg: '19.0886993408',
      longitude_deg: '72.8678970337',
      elevation_ft: '39',
      continent: 'AS',
      iso_country: 'IN',
      iso_region: 'IN-MM',
      municipality: 'Mumbai',
      scheduled_service: 'yes',
      gps_code: 'VABB',
      iata_code: 'BOM',
      local_code: '',
      home_link: 'http://www.csia.in/',
      wikipedia_link: 'https://en.wikipedia.org/wiki/Chhatrapati_Shivaji_International_Airport',
      keywords: 'Bombay, Sahar International Airport'
    }
    expect(airport).toMatchObject(expecting);
  });
});