const express = require('express');
const router = express.Router();
const r = require('rethinkdb');

let connection = null;

// RethinkDB bağlantısı
r.connect({ host: 'localhost', port: 28015 }, function (err, conn) {
  if (err) throw err;
  connection = conn;
});

// Kayıt olma endpointi
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await r.db('bomberman').table('users').insert({ username, email, password }).run(connection);
    res.status(200).json({ message: 'Kayıt başarılı', result });
  } catch (error) {
    res.status(500).json({ message: 'Kayıt başarısız', error });
  }
});

// Giriş yapma endpointi
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const cursor = await r.db('bomberman').table('users').filter({ email, password }).run(connection);
    const result = await cursor.toArray();
    if (result.length > 0) {
      res.status(200).json({ message: 'Giriş başarılı' });
    } else {
      res.status(401).json({ message: 'Geçersiz bilgiler' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Giriş başarısız', error });
  }
});

module.exports = router;
