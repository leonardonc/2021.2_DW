import Database from '../database/index.js';

async function load(data) {
  const db = await Database.connect();

  const {id, name, address} = data;

  const sql = `
    INSERT INTO
      hosts
    VALUES
      (?, ?, ?)
  `;

  await db.run(sql, [id, name, address]);

  db.close();
}

async function create(data) {
  const db = await Database.connect();

  const {name, address} = data;

  const sql = `
    INSERT INTO
      hosts (name, address)
    VALUES
      (?, ?)
  `;

  const {lastID} = await db.run(sql, [name, address]);

  const host = await readById(lastID)

  db.close();

  return host;
}

async function readAll() {
  const db = await Database.connect();

  const sql = `SELECT * FROM hosts`;

  const hosts = await db.all(sql);

  db.close();

  return hosts;
}

async function readById(id) {
  const db = await Database.connect();

  const sql = `SELECT * FROM hosts WHERE id = ?`;

  const host = await db.get(sql, [id]);

  db.close();

  return host;
}

async function destroy(id) {
  const db = await Database.connect();

  const sql = `DELETE FROM hosts WHERE id = ?`;

  const { changes } = await db.run(sql, [id]);

  db.close();

  return changes === 1;
}

export default { load, create, readAll, readById, destroy };