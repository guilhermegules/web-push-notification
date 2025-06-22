import { killPort } from '@nx/node/utils';
import path from 'path';
import fs from 'fs';

module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  const port = process.env.PORT ? Number(process.env.PORT) : 3333;
  await killPort(port);
  console.log(globalThis.__TEARDOWN_MESSAGE__);
  const containersPath = path.join(__dirname, '.tmp/containers.json');
  if (!fs.existsSync(containersPath)) return;
  globalThis.__CONTAINERS__?.redis.stop();
};
