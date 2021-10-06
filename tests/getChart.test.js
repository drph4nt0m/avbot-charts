const fs = require('fs');
const getChart = require('../app/getChart');
const airports = require('./airports.json');
const playbooks_dir = `${process.cwd()}/playbooks`;
const uriRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

jest.setTimeout(300000);

async function getChartWrapper(country, icao) {
  const _playbook = fs.readFileSync(`${playbooks_dir}/${country}.json`, 'utf8');
  const playbook = JSON.parse(_playbook);
  return await getChart(playbook, icao);
}

describe.each(airports)('$iso', ({ iso, chartIdent }) => {
  test('Found', async () => {
    expect(await getChartWrapper(iso, chartIdent.valid)).toMatch(uriRegEx);
  });

  chartIdent.invalid &&
    test('Not Found', async () => {
      expect(await getChartWrapper(iso, chartIdent.invalid)).toMatch('error');
    });
});
