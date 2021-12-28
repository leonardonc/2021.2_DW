import bcrypt from 'bcrypt';

import Database from '../database/index.js';

async function load(data) {
  const db = await Database.connect();

  const {id, name, email, password} = data;

  const sql = `
    INSERT INTO
      users
    VALUES
      (?, ?, ?, ?)
  `;

  await db.run(sql, [id, name, email, password]);

  db.close();
}

async function create(data) {
  const db = await Database.connect();

  const {name, email, password} = data;

  const sql = `
    INSERT INTO
      users (name, email, password)
    VALUES
      (?, ?, ?)
  `;

  const hash = await bcrypt.hash(password, 10);

  const { lastID } = await db.run(sql, [name, email, hash]);

  const newUser = await readById(lastID);

  db.close();

  return newUser;
}

async function readAll() {
  const db = await Database.connect();

  const sql = `SELECT * FROM users`;

  const users = await db.all(sql);

  db.close();

  return users;
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM users WHERE id = ?`;

  const users = await db.get(sql, [id]);

  db.close();

  return users;
}

async function readByEmail(email) {
  const db = await Database.connect();

  const sql = `SELECT * FROM users WHERE email = ?`;

  const users = await db.get(sql, [email]);

  db.close();

  return users;
}

export default { load, create, readAll, readById, readByEmail };