const fs = require('fs');
const getChart = require('../app/getChart');
const airports = require('./airports.json');
const playbooks_dir = `${process.cwd()}/playbooks`;
const uriRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

jest.setTimeout(300000);

describe.each(airports)('$iso', ({ iso, chartIdent }) => {
  const _playbook = fs.readFileSync(`${playbooks_dir}/${iso}.json`, 'utf8');
  const playbook = JSON.parse(_playbook);
  if (playbook.enabled === true) {
    test('Found', async () => {
      expect(await getChart(playbook, chartIdent.valid)).toMatch(uriRegEx);
    });

    if (chartIdent.invalid) {
      test('Not Found', async () => {
        expect(await getChart(playbook, chartIdent.invalid)).toMatch('error');
      });
    }
  } else {
    test('Disabled', async () => {
      expect('disabled').toMatch('disabled');
    });
  }
});
