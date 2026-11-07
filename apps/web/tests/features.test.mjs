import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { after, before, test } from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const nextCli = require.resolve('next/dist/bin/next');
const port = Number(process.env.FEATURES_TEST_PORT ?? 3149);
const origin = `http://127.0.0.1:${port}`;

let server;
let serverOutput = '';

before(async () => {
  server = spawn(
    process.execPath,
    [nextCli, 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: appDirectory,
      env: {
        ...process.env,
        NEXT_PUBLIC_APP_URL: origin,
        PORT: String(port),
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  server.stdout.setEncoding('utf8').on('data', (chunk) => {
    serverOutput += chunk;
  });
  server.stderr.setEncoding('utf8').on('data', (chunk) => {
    serverOutput += chunk;
  });

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Server exited before starting:\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${origin}/features`);
      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
    }
  }

  throw new Error(`Timed out waiting for production server on ${origin}:\n${serverOutput}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    server.kill();
    await new Promise((resolvePromise) => {
      server.once('exit', resolvePromise);
      setTimeout(resolvePromise, 5_000).unref();
    });
  }
});

async function getFeaturesHtml() {
  const response = await fetch(`${origin}/features`);
  assert.equal(response.status, 200, 'Features route must respond with 200 OK');
  return response.text();
}

test('features page renders required hero eyebrow, heading and CTAs', async () => {
  const html = await getFeaturesHtml();

  // Eyebrow and heading from Phase 3
  assert.match(html, /THE COMPLETE FUTURE DOCTOR ECOSYSTEM/i);
  assert.match(html, /Everything You Need to Become a/i);
  assert.match(html, /Future Doctor/i);
  assert.match(
    html,
    /From your first concept to your final CEE examination, experience a smarter, more personal and more effective way to prepare for medical school\./i,
  );

  // CTAs
  assert.match(html, /Explore the Ecosystem/i);
  assert.match(html, /Start Your Preparation/i);
  assert.ok(html.includes('href="/register"'));
  assert.ok(html.includes('href="#ecosystem"'));
});

test('features page renders ecosystem introduction and orbital modules', async () => {
  const html = await getFeaturesHtml();
  const text = html.replace(/<[^>]+>/g, ' ');

  // Eyebrow and heading from Phase 4
  assert.match(text, /ONE ECOSYSTEM\. EVERY STEP OF YOUR JOURNEY\./i);
  assert.match(text, /Not Just Preparation\.\s*A Complete Future Doctor Ecosystem\./i);
  assert.match(text, /AI PERSONAL[\s\S]*?CEE MENTOR/i);

  // All 6 connected modules
  const modules = [
    'Mistake DNA',
    'Smart Question Bank',
    'CEE Exam Simulator',
    'Adaptive Learning',
    'Smart Revision',
    'Performance Intelligence',
  ];

  for (const mod of modules) {
    assert.ok(html.includes(mod), `Missing ecosystem module: ${mod}`);
  }
});

test('features page renders all 6 AI intelligence ecosystem features', async () => {
  const html = await getFeaturesHtml();

  const aiFeatures = [
    'AI Personal CEE Mentor',
    'Mistake DNA',
    'AI Recovery Plan',
    'Explain Like My Teacher',
    'AI Doubt Scanner',
    'Smart Revision Radar',
  ];

  for (const feature of aiFeatures) {
    assert.ok(html.includes(feature), `Missing AI feature: ${feature}`);
  }

  // Check pedagogical explanation modes
  assert.match(html, /Simple Nepali/i);
  assert.match(html, /Simple English/i);
  assert.match(html, /Step-by-Step/i);
  assert.match(html, /Deep Conceptual/i);
  assert.match(html, /CEE Shortcuts/i);
  assert.match(html, /Comparisons/i);
});

test('features page renders realistic CEE exam experience with verified rules', async () => {
  const html = await getFeaturesHtml();
  const text = html.replace(/<[^>]+>/g, ' ');

  assert.match(text, /Experience the Pressure\.\s*Master the Performance\./i);
  assert.match(text, /200 MCQs/i);
  assert.match(text, /180 Mins/i);
  assert.match(text, /\+1\.0 Mark/i);
  assert.match(text, /-0\.25 Mark/i);
  assert.match(text, /DEMONSTRATION PREVIEW/i);
});

test('features page renders gamification, mission control, community, and doctor pathway', async () => {
  const html = await getFeaturesHtml();
  const text = html.replace(/<[^>]+>/g, ' ');

  // Gamification
  assert.match(text, /Make Preparation More Engaging\.\s*Keep Moving Forward\./i);
  assert.match(text, /CEE Battle Arena/i);
  assert.match(text, /National Leaderboard/i);

  // Mission Control
  assert.match(text, /Your Entire Preparation\.\s*One Intelligent Mission Control\./i);

  // Community
  assert.match(text, /Prepare Together\.\s*Grow Together\./i);
  assert.match(text, /Study Group Rooms/i);

  // Doctor Pathway
  assert.match(text, /Preparation Is\s*Only the Beginning\./i);
  assert.match(text, /75% Free Government Scholarship Allocation/i);
  assert.match(text, /Medical Education Act 2075/i);

  // Final CTA
  assert.match(text, /YOUR FUTURE STARTS WITH ONE DECISION/i);
  assert.match(text, /Your Dream of Becoming a Doctor\s+Deserves a Smarter Journey\./i);
});

test('features page does not contain empty anchor placeholders or invalid links', async () => {
  const html = await getFeaturesHtml();
  assert.ok(!html.includes('href="#"'), 'Must not contain empty href="#" placeholders');
});

test('features page contains valid canonical link and Open Graph metadata', async () => {
  const html = await getFeaturesHtml();
  assert.ok(html.includes('<link rel="canonical" href="'), 'Must have canonical URL');
  assert.ok(html.includes('property="og:title"'), 'Must have Open Graph title');
  assert.ok(html.includes('property="og:description"'), 'Must have Open Graph description');
});
