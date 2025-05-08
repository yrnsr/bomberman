const r = require('rethinkdb');

let connection = null;

async function connectToDatabase() {
  if (connection) return connection;

  connection = await r.connect({ host: 'localhost', port: 28015 });
  // Veritabanı ve tabloyu oluştur (yoksa)
  try {
    await r.dbCreate('bomberman').run(connection);
  } catch (e) {}
  try {
    await r.db('bomberman').tableCreate('users').run(connection);
  } catch (e) {}

  return connection;
}

module.exports = { r, connectToDatabase };
