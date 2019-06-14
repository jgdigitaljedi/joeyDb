(function () {
  const fs = require('fs');
  const path = require('path');
  const apicalypse = require('apicalypse').default;
  const xboxToXboxThreeSixty = require('../src/static/xboxToXboxThreeSixty.json');
  const xbox360ToXboxOne = require('../src/static/xbox360ToXboxOne.json');
  const xboxToXboxOne = require('../src/static/xboxToXboxOne.json');

  const igdbLookup = async function (name, platformId) {
    const requestOptions = {
      method: 'POST',
      baseURL: 'https://api-v3.igdb.com',
      headers: {
        'Accept': 'application/json',
        'user-key': process.env.IGDBV3KEY
      },
    };
    return await apicalypse(requestOptions)
      .fields(`name`)
      .search(name)
      .where(`platforms = [${platformId}]`)
      .request('/games')
      .then(result => result.data);
  }

  /** For testing purposes right now */
  const halo = igdbLookup('Halo: Combat Evolved', 11).then(result => {
    console.log('result', result);
    return result;
  });
  console.log('halo', halo);

  const xtxts = xboxToXboxThreeSixty.map(g => {
    g.igdbId = null;
    return g;
  });
  fs.writeFileSync(path.join(__dirname, '../src/static/xboxToXboxThreeSixty.json'), JSON.stringify(xtxts, null, 4));

  const xtstxbo = xbox360ToXboxOne.map(g => {
    g.igdbId = null;
    return g;
  });
  fs.writeFileSync(path.join(__dirname, '../src/static/xbox360ToXboxOne.json'), JSON.stringify(xtstxbo, null, 4));

  const xtxbo = xboxToXboxOne.map(g => {
    g.igdbId = null;
    return g;
  });
  fs.writeFileSync(path.join(__dirname, '../src/static/xboxToXboxOne.json'), JSON.stringify(xtxbo, null, 4));
})();