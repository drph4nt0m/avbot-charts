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

describe('AL', () => {
  test('Found', async () => {
    expect(await getChartWrapper('AL', 'LAKU')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('AL', 'AL-0001')).toMatch('error');
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

describe('BE', () => {
  test('Found', async () => {
    expect(await getChartWrapper('BE', 'EBAW')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('BE', 'BE-0001')).toMatch('error');
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

describe('CR', () => {
  test('Found', async () => {
    expect(await getChartWrapper('CR', 'MROC')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('CR', 'CR-0001')).toMatch('error');
  });
});

describe('EE', () => {
  test('Found', async () => {
    expect(await getChartWrapper('EE', 'EEEI')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('EE', 'ECEL')).toMatch('error');
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

describe('GT', () => {
  test('Found', async () => {
    expect(await getChartWrapper('GT', 'MGGT')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('GT', 'GT-0001')).toMatch('error');
  });
});

describe('HN', () => {
  test('Found', async () => {
    expect(await getChartWrapper('HN', 'MHTG')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('HN', 'MHMI')).toMatch('error');
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

describe('KZ', () => {
  test('Found', async () => {
    expect(await getChartWrapper('KZ', 'UATE')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('KZ', 'KZ-0095')).toMatch('error');
  });
});

describe('LK', () => {
  test('Found', async () => {
    expect(await getChartWrapper('LK', 'VCCA')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('KZ', 'ECEL')).toMatch('error');
  });
});

describe('NI', () => {
  test('Found', async () => {
    expect(await getChartWrapper('NI', 'MNMG')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('NI', 'MNAL')).toMatch('error');
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

describe('SV', () => {
  test('Found', async () => {
    expect(await getChartWrapper('SV', 'MSLP')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('SV', 'MSAC')).toMatch('error');
  });
});

describe('TH', () => {
  test('Found', async () => {
    expect(await getChartWrapper('TH', 'VTBU')).toMatch(uriRegEx);
  });

  test('Not Found', async () => {
    expect(await getChartWrapper('TH', 'TH-0001')).toMatch('error');
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
