import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import fs from 'node:fs';

const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../apps/web');
const webRequire = createRequire(resolve(appDirectory, 'package.json'));
const nextCli = webRequire.resolve('next/dist/bin/next');
const port = 3149;
const cdpPort = 9333;
const origin = `http://127.0.0.1:${port}`;
const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../docs/screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('1. Starting Next.js server...');
  const nextServer = spawn(
    process.execPath,
    [nextCli, 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: appDirectory,
      env: { ...process.env, PORT: String(port), NODE_ENV: 'production' },
      stdio: 'pipe',
    },
  );

  // Wait for Next.js to be ready
  const readyTimeout = Date.now() + 25000;
  let ready = false;
  while (Date.now() < readyTimeout) {
    try {
      const res = await fetch(`${origin}/question-bank`);
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await sleep(500);
  }
  if (!ready) throw new Error('Next.js failed to start');
  console.log('Next.js ready at ' + origin);

  console.log('2. Starting Chrome in headless mode with CDP...');
  const chromeProcess = spawn(
    chromeExe,
    [
      `--remote-debugging-port=${cdpPort}`,
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + resolve(appDirectory, '../../.tmp-chrome-profile'),
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  await sleep(1500);

  // Discover CDP WebSocket
  const versionRes = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  const versionData = await versionRes.json();
  const wsUrl = versionData.webSocketDebuggerUrl;
  console.log('CDP connected:', wsUrl);

  // Simple CDP WebSocket client
  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let idCounter = 1;
  const pendingRequests = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve: res, reject: rej } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) rej(msg.error);
      else res(msg.result);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Create new target/tab
  const { targetId } = await sendCommand('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await sendCommand('Target.attachToTarget', { targetId, flatten: true });

  function sendSession(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('DOM.enable');
  await sendSession('Runtime.enable');

  async function setViewport(width, height, isMobile = false) {
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile,
    });
  }

  async function takeScreenshot(fileName, clip = null) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const { data } = await sendSession('Page.captureScreenshot', params);
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(resolve(outDir, fileName), buffer);
    console.log(`Saved screenshot: ${fileName} (${buffer.length} bytes)`);
  }

  async function evalJs(expr) {
    const res = await sendSession('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  // --- 1. Desktop Full Page (1440 x 900) ---
  console.log('Capturing Desktop Full Page...');
  await setViewport(1440, 900);
  await sendSession('Page.navigate', { url: `${origin}/question-bank` });
  await sleep(2500);

  // Capture full page
  const pageHeight = await evalJs('document.documentElement.scrollHeight');
  await sendSession('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: pageHeight,
    deviceScaleFactor: 1.5,
    mobile: false,
  });
  await sleep(800);
  await takeScreenshot('desktop-full.png');

  // --- 2. Hero Section ---
  console.log('Capturing Hero Section...');
  await setViewport(1440, 900);
  await sendSession('Page.navigate', { url: `${origin}/question-bank` });
  await sleep(1500);
  await takeScreenshot('desktop-hero.png', { x: 0, y: 70, width: 1440, height: 750, scale: 1.5 });

  // --- 3. Subject Discovery Section ---
  console.log('Capturing Subject Discovery...');
  await evalJs(`
    const el = document.getElementById('explore-subjects');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await sleep(800);
  await takeScreenshot('subject-discovery.png');

  // --- 4. Interactive Question Before Answering ---
  console.log('Capturing Interactive Question Before Answering...');
  await evalJs(`
    const el = document.getElementById('interactive-demo');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await sleep(800);
  await takeScreenshot('interactive-question-before.png');

  // --- 5. Interactive Question After Answering ---
  console.log('Selecting Option B and Submitting Answer...');
  await evalJs(`
    // Click Option B (Mitochondrion)
    const options = document.querySelectorAll('[role="radio"]');
    for (const opt of options) {
      if (opt.textContent.includes('Mitochondrion')) {
        opt.click();
        break;
      }
    }
  `);
  await sleep(500);
  await evalJs(`
    // Click Submit Answer button
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit Answer'));
    if (submitBtn) submitBtn.click();
  `);
  await sleep(800);
  await evalJs(`
    const el = document.getElementById('interactive-demo');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  `);
  await sleep(500);
  await takeScreenshot('interactive-question-after.png');

  // --- 6. Dark Theme View ---
  console.log('Capturing Dark Theme View...');
  await evalJs(`
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    window.scrollTo(0, 0);
  `);
  await sleep(800);
  await takeScreenshot('dark-theme.png', { x: 0, y: 70, width: 1440, height: 850, scale: 1.5 });

  // --- 7. Light Theme View ---
  console.log('Capturing Light Theme View...');
  await evalJs(`
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    window.scrollTo(0, 0);
  `);
  await sleep(800);
  await takeScreenshot('light-theme.png', { x: 0, y: 70, width: 1440, height: 850, scale: 1.5 });

  // --- 8. Mobile Viewport (390 x 844) ---
  console.log('Capturing Mobile Viewport...');
  await setViewport(390, 844, true);
  await sendSession('Page.navigate', { url: `${origin}/question-bank` });
  await sleep(1500);
  await takeScreenshot('mobile-page.png');

  console.log('All screenshots captured successfully!');

  // Cleanup
  ws.close();
  chromeProcess.kill();
  nextServer.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
