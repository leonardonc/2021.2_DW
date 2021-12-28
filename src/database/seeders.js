import fs from 'fs';
import path from 'path';

import Host from '../models/Host.js';
import User from '../models/User.js';

async function up() {
  const seedersPath = path.join('src', 'database', 'seeders.json');

  const seedersContent = fs.readFileSync(seedersPath);

  const seeders = JSON.parse(seedersContent);

  for (const user of seeders.users) {
    await User.load(user);
  }

  for (const host of seeders.hosts) {
    await Host.load(host);
  }
}

export default { up };