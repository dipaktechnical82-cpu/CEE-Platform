import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { after, before, test } from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const nextCli = require.resolve('next/dist/bin/next');
const devPort = 3000;
let origin = `http://127.0.0.1:${devPort}`;
let server;

before(async () => {
  // Check if existing dev server on port 3000 is ready
  try {
    const res = await fetch(`${origin}/question-bank`);
    if (res.status === 200) {
      return;
    }
  } catch {}

  origin = `http://127.0.0.1:3149`;
  server = spawn(
    process.execPath,
    [nextCli, 'dev', '--hostname', '127.0.0.1', '--port', '3149'],
    {
      cwd: appDirectory,
      env: {
        ...process.env,
        PORT: '3149',
      },
      stdio: 'pipe',
    },
  );

  const timeoutAt = Date.now() + 30000;
  while (Date.now() < timeoutAt) {
    try {
      const res = await fetch(`${origin}/question-bank`);
      if (res.status === 200) {
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Next.js server failed to start within 30 seconds.');
});

after(() => {
  server?.kill();
});

test('GET /question-bank returns HTTP 200 and valid semantic HTML', async () => {
  const res = await fetch(`${origin}/question-bank`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes('<!DOCTYPE html>'));
  assert.ok(html.includes('THE CEE QUESTION BANK'));
  assert.ok(html.includes('Practice Smarter.'));
  assert.ok(html.includes('Think Like a Future Doctor.'));
});

test('renders official metadata and SEO properties', async () => {
  const res = await fetch(`${origin}/question-bank`);
  const html = await res.text();
  assert.ok(html.includes('CEE Question Bank'));
  assert.ok(html.includes('canonical'));
  assert.ok(html.includes('/question-bank'));
  assert.ok(html.includes('LearningResource'));
});

test('renders hero with required eyebrow, heading and CTAs', async () => {
  const res = await fetch(`${origin}/question-bank`);
  const html = await res.text();
  assert.ok(html.includes('THE CEE QUESTION BANK'));
  assert.ok(html.includes('Start Practicing'));
  assert.ok(html.includes('href="/register"'));
  assert.ok(html.includes('Explore Subjects'));
  assert.ok(html.includes('href="#explore-subjects"'));
});

test('renders subject discovery with 4 exploratory disciplines', async () => {
  const res = await fetch(`${origin}/question-bank`);
  const html = await res.text();
  assert.ok(html.includes('Botany'));
  assert.ok(html.includes('Zoology'));
  assert.ok(html.includes('Chemistry'));
  assert.ok(html.includes('Physics'));
  assert.ok(html.includes('Exploratory Curriculum Preview') || html.includes('EXPLORATORY CURRICULUM PREVIEW'));
});

test('renders interactive demo with sample question and options', async () => {
  const res = await fetch(`${origin}/question-bank`);
  const html = await res.text();
  assert.ok(html.includes('INTERACTIVE DEMO — SAMPLE QUESTION'));
  assert.ok(html.includes('Which cellular organelle is primarily responsible for ATP production'));
  assert.ok(html.includes('Golgi apparatus'));
  assert.ok(html.includes('Mitochondrion'));
  assert.ok(html.includes('Lysosome'));
  assert.ok(html.includes('Ribosome'));
});

test('renders study modes with honest status indicators', async () => {
  const res = await fetch(`${origin}/question-bank`);
  const html = await res.text();
  assert.ok(html.includes('Practice Mode'));
  assert.ok(html.includes('Timed Mode'));
  assert.ok(html.includes('Topic-wise Mode'));
  assert.ok(html.includes('Adaptive Practice'));
  assert.ok(html.includes('Mistake Review'));
  assert.ok(html.includes('Coming Soon') || html.includes('In Active Engineering'));
});

test('renders intelligent features ecosystem', async () => {
  const res = await fetch(`${origin}/question-bank`);
  const html = await res.text();
  assert.ok(html.includes('MISTAKE DNA'));
  assert.ok(html.includes('DIFFICULTY LADDER'));
  assert.ok(html.includes('Smart Revision Radar'));
  assert.ok(html.includes('AI Personal CEE Mentor'));
  assert.ok(html.includes('Adaptive Learning'));
  assert.ok(html.includes('AI Doubt Scanner'));
});

test('renders quality governance workflow and how it works steps', async () => {
  const res = await fetch(`${origin}/question-bank`);
  const html = await res.text();
  assert.ok(html.includes('Question Draft'));
  assert.ok(html.includes('Academic Review'));
  assert.ok(html.includes('Faculty Verification'));
  assert.ok(html.includes('Versioned Publication'));
  assert.ok(html.includes('Choose Your Subject'));
  assert.ok(html.includes('Answer and Understand'));
  assert.ok(html.includes('Improve Your Preparation'));
});

test('renders premium conversion CTA section', async () => {
  const res = await fetch(`${origin}/question-bank`);
  const html = await res.text();
  assert.ok(html.includes('YOUR NEXT STEP STARTS HERE'));
  assert.ok(html.includes('Every Question Is an Opportunity to Improve.'));
  assert.ok(html.includes('Start Your Preparation'));
});
