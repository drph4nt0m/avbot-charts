const fs = require('fs');
const getChart = require('../app/getChart');

const playbooks_dir = `${process.cwd()}/playbooks`;
const uriRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

jest.setTimeout(300000);

async function getChartWrapper(country, icao) {
  const _playbook = fs.readFileSync(`${playbooks_dir}/${country}.json`, 'utf8');
  const playbook = JSON.parse(_playbook);
  return await getChart(playbook, icao);
}

describe('AE', () => {
  test('Found', async () => {
    expect(await getChartWrapper('AE', 'OMDB')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('AE', 'OMAM')).toMatch('error');
  });
});

describe('AU', () => {
  test('Found', async () => {
    expect(await getChartWrapper('AU', 'YSSY')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('AU', 'YYBK')).toMatch('error');
  });
});

describe('BZ', () => {
  test('Found', async () => {
    expect(await getChartWrapper('BZ', 'MZBZ')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('BZ', 'BZ-0001')).toMatch('error');
  });
});

describe('FR', () => {
  test('Found', async () => {
    expect(await getChartWrapper('FR', 'LFPG')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('FR', 'LFSJ')).toMatch('error');
  });
});

describe('GB', () => {
  test('Found', async () => {
    expect(await getChartWrapper('GB', 'EGLL')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('GB', 'EHHA')).toMatch('error');
  });
});

describe('IN', () => {
  test('Found', async () => {
    expect(await getChartWrapper('IN', 'VABB')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('IN', 'IN-0030')).toMatch('error');
  });
});

describe('NL', () => {
  test('Found', async () => {
    expect(await getChartWrapper('NL', 'EHAM')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('NL', 'EHHA')).toMatch('error');
  });
});

describe('US', () => {
  test('Found', async () => {
    expect(await getChartWrapper('US', 'KJFK')).toMatch(uriRegEx);
  });

  // test('Not Found', async () => {
  //   expect(await getChartWrapper('US', 'KISZ')).toMatch('error');
  // });
});
