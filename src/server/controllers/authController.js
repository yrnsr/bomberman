const { r, connectToDatabase } = require('../db');

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  const conn = await connectToDatabase();

  const userExists = await r.db('bomberman').table('users').filter({ email }).run(conn);
  const users = await userExists.toArray();

  if (users.length > 0) {
    return res.status(400).json({ error: 'Bu email zaten kullanılıyor.' });
  }

  await r.db('bomberman').table('users').insert({ username, email, password }).run(conn);
  res.status(200).json({ message: 'Kayıt başarılı.' });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const conn = await connectToDatabase();

  const cursor = await r.db('bomberman').table('users').filter({ email, password }).run(conn);
  const users = await cursor.toArray();

  if (users.length === 0) {
    return res.status(401).json({ error: 'Geçersiz email veya şifre.' });
  }

  res.status(200).json({ message: 'Giriş başarılı.' });
}

module.exports = { registerUser, loginUser };
