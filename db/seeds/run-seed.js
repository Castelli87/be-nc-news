const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  console.log(`database ${process.env.PGDATABASE || process.env.DATABASE_URL} seeded`)
  return seed(devData).then(() => db.end());
};

runSeed();
