import { spawn } from 'child_process';
import http from 'http';

const PORT = 3005;
const HOST = '127.0.0.1';

console.log(`Starting Next.js production server on http://${HOST}:${PORT}...`);
const server = spawn('npx', ['next', 'start', '-p', String(PORT), '-H', HOST], {
  cwd: process.cwd(),
  shell: true,
  stdio: 'inherit',
});

function waitReady(retries = 30) {
  return new Promise((resolve, reject) => {
    function attempt(n) {
      if (n <= 0) return reject(new Error('Server did not start in time'));
      const req = http.get(`http://${HOST}:${PORT}/`, (res) => {
        resolve();
      });
      req.on('error', () => {
        setTimeout(() => attempt(n - 1), 1000);
      });
    }
    attempt(retries);
  });
}

try {
  await waitReady();
  console.log('Server is ready! Running URL parity test...\n');

  const parity = spawn('node', ['scripts/url-parity.mjs'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(PORT), HOST },
  });

  await new Promise((resolve, reject) => {
    parity.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`URL parity exited with code ${code}`));
    });
  });

  console.log('\nURL Parity check finished successfully!');
} catch (err) {
  console.error('Test error:', err.message);
  process.exitCode = 1;
} finally {
  console.log('Stopping Next.js server...');
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(server.pid), '/f', '/t'], { shell: true });
  } else {
    server.kill();
  }
}
