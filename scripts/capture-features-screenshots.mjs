import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '../apps/web');
const screenshotsDir = resolve(__dirname, '../docs/screenshots/features');
const port = 3155;
const baseUrl = `http://127.0.0.1:${port}/features`;
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function capture() {
  console.log('Starting production Next.js server on port', port);
  const nextCli = resolve(appDir, 'node_modules/next/dist/bin/next');

  const server = spawn(process.execPath, [nextCli, 'start', '--port', String(port), '--hostname', '127.0.0.1'], {
    cwd: appDir,
    env: { ...process.env, NODE_ENV: 'production', PORT: String(port) },
    stdio: 'ignore',
  });

  try {
    // Wait for server to be ready
    let ready = false;
    for (let i = 0; i < 40; i++) {
      try {
        const res = await fetch(baseUrl);
        if (res.ok) {
          ready = true;
          break;
        }
      } catch {}
      await wait(500);
    }

    if (!ready) {
      throw new Error('Server failed to start');
    }
    console.log('Server is ready. Capturing screenshots...');

    const targets = [
      {
        name: 'desktop-dark-1440x900.png',
        width: 1440,
        height: 900,
        colorScheme: 'dark',
      },
      {
        name: 'desktop-light-1440x900.png',
        width: 1440,
        height: 900,
        colorScheme: 'light',
      },
      {
        name: 'tablet-dark-1024x768.png',
        width: 1024,
        height: 768,
        colorScheme: 'dark',
      },
      {
        name: 'mobile-dark-390x844.png',
        width: 390,
        height: 844,
        colorScheme: 'dark',
      },
      {
        name: 'mobile-light-390x844.png',
        width: 390,
        height: 844,
        colorScheme: 'light',
      },
    ];

    for (const target of targets) {
      const outPath = resolve(screenshotsDir, target.name);
      console.log(`Capturing ${target.name} (${target.width}x${target.height})...`);

      const args = [
        '--headless=new',
        '--hide-scrollbars',
        `--window-size=${target.width},${target.height}`,
        `--force-color-profile=srgb`,
        target.colorScheme === 'light' ? '--force-prefers-color-scheme=light' : '--force-prefers-color-scheme=dark',
        `--screenshot=${outPath}`,
        baseUrl,
      ];

      const proc = spawn(chromePath, args, { stdio: 'inherit' });
      await new Promise((resolve) => proc.on('exit', resolve));
      console.log(`Saved ${outPath}`);
    }

    console.log('All screenshots captured successfully!');
  } finally {
    server.kill();
  }
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
