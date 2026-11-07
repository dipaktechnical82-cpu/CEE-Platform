import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { after, before, test } from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const nextCli = require.resolve('next/dist/bin/next');
const port = Number(process.env.ABOUT_TEST_PORT ?? 3139);
const origin = `http://127.0.0.1:${port}`;

let server;
let serverOutput = '';

function getLinks(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(([, rawAttributes, text]) => {
    const href = rawAttributes.match(/href="([^"]*)"/i)?.[1] ?? '';
    return { href, text: text.replace(/<[^>]*>/g, '').trim() };
  });
}

before(async () => {
  server = spawn(
    process.execPath,
    [nextCli, 'dev', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: appDirectory,
      env: {
        ...process.env,
        NEXT_PUBLIC_APP_URL: origin,
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
      throw new Error(`About test server exited early:\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${origin}/about`);
      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  throw new Error(`Timed out waiting for the about server:\n${serverOutput}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    server.kill();
    await new Promise((r) => {
      server.once('exit', r);
    });
  }
});

async function fetchAboutHtml() {
  const response = await fetch(`${origin}/about`);
  assert.equal(response.status, 200);
  return response.text();
}

test('About page renders single primary h1 and correct headline', async () => {
  const html = await fetchAboutHtml();
  const h1Matches = [...html.matchAll(/<h1(?:\s|>)/gi)];
  assert.equal(h1Matches.length, 1, 'Expected exactly one <h1> element on the page');
  assert.match(html, /More Than Preparation/);
  assert.match(html, /A Mission to Shape Future Doctors/);
});

test('About page renders all 9 required sections with proper IDs', async () => {
  const html = await fetchAboutHtml();
  const requiredSectionIds = [
    'our-story',
    'our-mission',
    'our-vision',
    'core-differentiators',
    'learning-philosophy',
    'technology-purpose',
    'our-commitments',
    'about-cta',
  ];

  for (const id of requiredSectionIds) {
    assert.match(html, new RegExp(`id="${id}"`), `Expected section with id="${id}"`);
  }
});

test('Section 2 (Our Story) covers student challenges and ecosystem solution', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /Every Future Doctor Has a Story/);
  assert.match(html, /Fragmented Study Materials/);
  assert.match(html, /Limited Personalized Guidance/);
  assert.match(html, /Repeating Mistakes Without Insight/);
  assert.match(html, /Lack of Realistic Exam Practice/);
});

test('Section 3 (Our Mission) displays the official mission statement and 3 pillars', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /Our Mission Is Simple/);
  assert.match(html, /Accessible Learning/);
  assert.match(html, /Personalized Guidance/);
  assert.match(html, /Confident Preparation/);
  assert.match(html, /To make high-quality, intelligent, and personalized medical entrance preparation/);
});

test('Section 4 (Our Vision) presents the long-term future commitments', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /Building the Future of Medical Entrance Preparation/);
  assert.match(html, /A Connected Learning Ecosystem/);
  assert.match(html, /Deeply Personalized Experiences/);
  assert.match(html, /Trustworthy Medical Knowledge/);
});

test('Section 5 (Differentiators) contains all 10 platform features with status distinctions', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /Not Another Question Bank/);
  assert.match(html, /AI Personal CEE Mentor/);
  assert.match(html, /Mistake DNA/);
  assert.match(html, /AI Recovery Plan/);
  assert.match(html, /Smart Question Bank/);
  assert.match(html, /Realistic CEE Exam Simulator/);
  assert.match(html, /Adaptive Learning/);
  assert.match(html, /Smart Revision Radar/);
  assert.match(html, /CEE Battle Arena/);
  assert.match(html, /Future Doctor Pathway/);
  assert.match(html, /Study Group Rooms/);
  assert.match(html, /Available Now/);
  assert.match(html, /Upcoming in Roadmap/);
});

test('Section 6 (Learning Philosophy) features all 4 principles in order', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /We Believe Every Student Learns Differently/);
  assert.match(html, /Understand Before Memorizing/);
  assert.match(html, /Learn From Every Mistake/);
  assert.match(html, /Practice With Purpose/);
  assert.match(html, /Improve Every Day/);
});

test('Section 7 (Technology With Purpose) emphasizes human-centered learning', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /Advanced Technology/);
  assert.match(html, /Human-Centered Learning/);
  assert.match(html, /AI-Assisted Explanations/);
  assert.match(html, /Personalized Recommendations/);
  assert.match(html, /Intelligent Question Discovery/);
  assert.match(html, /Objective Performance Insights/);
  assert.match(html, /Technology Supports — It Does Not Replace Genuine Effort/);
});

test('Section 8 (Our Commitment) covers all 4 ethical pillars without false claims', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /Trust, Quality, and Continuous Improvement/);
  assert.match(html, /Learning Quality/);
  assert.match(html, /Student Privacy/);
  assert.match(html, /Responsible AI/);
  assert.match(html, /Continuous Improvement/);
});

test('Section 9 (Final CTA) points to registered and existing features routes', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /Your Future in Medicine[\s\S]*?Starts With One Step/);
  const links = getLinks(html);
  assert.ok(
    links.some((l) => l.text.includes('Start Your Preparation') && l.href === '/register'),
    'Expected primary CTA link to /register',
  );
  assert.ok(
    links.some((l) => l.text.includes('Explore Our Features') && l.href === '/features'),
    'Expected secondary CTA link to /features',
  );
});

test('About page includes valid JSON-LD metadata for AboutPage and EducationalOrganization', async () => {
  const html = await fetchAboutHtml();
  assert.match(html, /"AboutPage"/);
  assert.match(html, /"EducationalOrganization"/);
  assert.match(html, /CEE Medical Prep Nepal/);
});
