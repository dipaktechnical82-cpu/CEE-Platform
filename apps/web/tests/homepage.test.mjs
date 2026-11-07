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
const port = Number(process.env.HOMEPAGE_TEST_PORT ?? 3137);
const mockApiPort = Number(process.env.CURRICULUM_MOCK_API_PORT ?? 8137);
const origin = `http://127.0.0.1:${port}`;

let server;
let mockApi;
let serverOutput = '';
let curriculumApiResponse = {
  status: 200,
  delayMs: 0,
  body: {
    success: true,
    data: [],
    meta: {
      pagination: {
        page: 1,
        pageSize: 100,
        totalCount: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    },
  },
};

before(async () => {
  mockApi = createServer((request, response) => {
    if (request.url?.startsWith('/api/v1/curriculum/versions/')) {
      const current = curriculumApiResponse;
      setTimeout(() => {
        response.writeHead(current.status, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(current.body));
      }, current.delayMs);
      return;
    }
    response.writeHead(404);
    response.end();
  });
  await new Promise((resolvePromise, reject) => {
    mockApi.once('error', reject);
    mockApi.listen(mockApiPort, '127.0.0.1', resolvePromise);
  });

  server = spawn(
    process.execPath,
    [nextCli, 'dev', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: appDirectory,
      env: {
        ...process.env,
        NEXT_PUBLIC_APP_URL: origin,
        NEXT_PUBLIC_API_URL: `http://127.0.0.1:${mockApiPort}/api/v1`,
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

  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Homepage server exited before starting:\n${serverOutput}`);
    }

    try {
      const response = await fetch(origin);
      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
    }
  }

  throw new Error(`Timed out waiting for the homepage server:\n${serverOutput}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    server.kill();
    await new Promise((resolvePromise) => {
      server.once('exit', resolvePromise);
      setTimeout(resolvePromise, 5_000).unref();
    });
  }
  if (mockApi?.listening) {
    await new Promise((resolvePromise, reject) =>
      mockApi.close((error) => (error ? reject(error) : resolvePromise())),
    );
  }
});

async function homepage() {
  let response;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    response = await fetch(origin);
    if (response.ok) {
      return response.text();
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
  }

  const body = await response?.text();
  assert.equal(response?.status, 200, `Homepage request failed:\n${body}\n${serverOutput}`);
  return '';
}

async function syllabus() {
  return fetch(`${origin}/syllabus`);
}

async function studentDashboard() {
  return fetch(`${origin}/student/dashboard`);
}

function getLinks(html) {
  return [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map(
    ([, href, content]) => ({
      href: href.replaceAll('&amp;', '&'),
      text: content
        .replace(/<[^>]*>/g, ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&#x27;', "'")
        .replace(/\s+/g, ' ')
        .trim(),
    }),
  );
}

test('homepage renders one primary heading and the approved sections', async () => {
  const html = await homepage();
  assert.equal([...html.matchAll(/<h1(?:\s|>)/gi)].length, 1);
  assert.match(html, /Your Journey to Medical School Starts Here\./);
  for (const section of [
    'journey-begins',
    'intelligence-hub',
    'future-dashboard',
    'exam-arena',
    'progress-observatory',
  ]) {
    assert.match(html, new RegExp(`id="${section}"`));
  }
});

test('primary navigation and preparation links point to existing destinations', async () => {
  const html = await homepage();
  const links = getLinks(html);
  const requiredLinks = [
    ['Home', ['/']],
    ['Features', ['/features', '/#intelligence-hub']],
    ['Mock Tests', ['/mock-tests', '/#exam-arena']],
    ['Start Preparing', ['/register']],
    ['Explore Platform', ['/about', '/syllabus', '/#journey-begins', '/#intelligence-hub']],
  ];

  for (const [label, validHrefs] of requiredLinks) {
    assert.ok(
      links.some((link) => link.text.includes(label) && validHrefs.includes(link.href)),
      `Expected a "${label}" link to one of [${validHrefs.join(', ')}]`,
    );
  }
});

test('mobile navigation trigger exposes its collapsed menu and accessible control state', async () => {
  const html = await homepage();
  const trigger = html.match(/<button\b[^>]*aria-controls="mobile-primary-navigation"[^>]*>/i)?.[0];

  assert.ok(trigger, 'Expected a mobile navigation trigger');
  assert.match(trigger, /aria-expanded="false"/);
  assert.match(trigger, /aria-label="Open navigation menu"/);
  assert.match(trigger, /type="button"/);
  assert.match(html, /focus-visible:ring-2/);

  const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0];
  assert.ok(header, 'Expected the public header');
  const links = getLinks(header);
  const expectedLinkOptions = [
    ['/'],
    ['/features', '/#intelligence-hub'],
    ['/mock-tests', '/#exam-arena'],
    ['/about', '/#journey-begins'],
    ['/login'],
    ['/register'],
  ];
  for (const options of expectedLinkOptions) {
    assert.ok(
      links.some((link) => options.includes(link.href)),
      `Expected a header link to one of [${options.join(', ')}]`,
    );
  }
});

test('footer links resolve to available routes or homepage sections', async () => {
  const html = await homepage();
  const footerNavigation = html.match(
    /<nav\b[^>]*aria-label="Footer navigation"[^>]*>([\s\S]*?)<\/nav>/i,
  )?.[1];
  assert.ok(footerNavigation, 'Expected footer navigation landmark');
  const sectionIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
  const links = getLinks(footerNavigation);
  const checkedRoutes = new Set();

  assert.ok(links.length > 0, 'Expected footer links');
  for (const { href } of links) {
    const url = new URL(href, origin);
    assert.equal(url.origin, origin, `Footer link must stay on the site: ${href}`);
    if (url.hash) {
      assert.ok(sectionIds.has(decodeURIComponent(url.hash.slice(1))), `Missing target: ${href}`);
    }
    if (!checkedRoutes.has(url.pathname)) {
      const response = await fetch(new URL(url.pathname, origin));
      assert.equal(response.status, 200, `Footer route must respond: ${href}`);
      checkedRoutes.add(url.pathname);
    }
  }
});

test('homepage advertises one correctly sized absolute Open Graph image', async () => {
  const html = await homepage();
  const expectedImage = `${origin}/images/og-default.png`;
  const metadataValues = (property) => [
    ...html.matchAll(
      new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]+)"\\s*\\/?>`, 'gi'),
    ),
  ].map(([, content]) => content);
  const namedMetadataValues = (name) => [
    ...html.matchAll(
      new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]+)"\\s*\\/?>`, 'gi'),
    ),
  ].map(([, content]) => content);

  assert.deepEqual(metadataValues('og:image'), [expectedImage]);
  assert.deepEqual(metadataValues('og:image:width'), ['1200']);
  assert.deepEqual(metadataValues('og:image:height'), ['630']);
  assert.deepEqual(
    metadataValues('og:image:alt'),
    [
      'CEE Medical Prep for Nepal medical entrance preparation, with a luminous aqua anatomical heart.',
    ],
  );
  assert.deepEqual(metadataValues('og:url'), [origin]);
  assert.deepEqual(namedMetadataValues('twitter:card'), ['summary_large_image']);
  assert.deepEqual(namedMetadataValues('twitter:image'), [expectedImage]);
  assert.ok(html.includes(`<link rel="canonical" href="${origin}"`));

  const imageResponse = await fetch(expectedImage);
  assert.equal(imageResponse.status, 200);
  assert.match(imageResponse.headers.get('content-type') ?? '', /^image\/png/);
  const image = Buffer.from(await imageResponse.arrayBuffer());
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
});

test('robots and sitemap use the configured public application origin', async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    fetch(`${origin}/robots.txt`),
    fetch(`${origin}/sitemap.xml`),
  ]);
  assert.equal(robotsResponse.status, 200);
  assert.equal(sitemapResponse.status, 200);

  const robots = await robotsResponse.text();
  const sitemap = await sitemapResponse.text();
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.ok(sitemap.includes(`<loc>${origin}</loc>`));
  assert.ok(sitemap.includes(`<loc>${origin}/syllabus</loc>`));
});

test('syllabus shows an explicit state when no verified source has been published', async () => {
  curriculumApiResponse = {
    status: 200,
    delayMs: 0,
    body: {
      success: true,
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 100,
          totalCount: 0,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      },
    },
  };
  const response = await syllabus();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /No verified curriculum has been published yet/);
  assert.match(html, /Unverified or inferred syllabus facts are intentionally withheld/);
  assert.doesNotMatch(html, /Human biology and human diseases|40% Weightage|Negative Marking:/);
});

test('syllabus renders API curriculum hierarchy, cycle, version, and verified source', async () => {
  curriculumApiResponse = {
    status: 200,
    delayMs: 0,
    body: {
      success: true,
      data: [
        {
          id: 'version-fixture-1',
          version_identifier: 'fixture-only',
          exam_cycle: 'TEST-CYCLE',
          effective_date: null,
          published_at: '2026-01-02T03:04:05Z',
          source: {
            title: 'Test fixture source (not official)',
            url: 'https://example.test/curriculum.pdf',
            publisher: 'Test-only publisher',
            publication_date: null,
            exam_cycle: 'TEST-CYCLE',
            source_version: 'fixture-only',
            verification_status: 'VERIFIED',
            verified_at: '2026-01-01T00:00:00Z',
          },
          subjects: [
            {
              id: 'subject-fixture-1',
              name: 'Fixture subject',
              slug: 'fixture-subject',
              display_order: 1,
              topics: [
                {
                  id: 'topic-fixture-parent',
                  name: 'Fixture parent topic',
                  slug: 'fixture-parent',
                  display_order: 1,
                  parent_id: null,
                  source_reference: 'Test locator',
                },
                {
                  id: 'topic-fixture-child',
                  name: 'Fixture child topic',
                  slug: 'fixture-child',
                  display_order: 1,
                  parent_id: 'topic-fixture-parent',
                  source_reference: '',
                },
              ],
            },
          ],
        },
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 100,
          totalCount: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      },
    },
  };
  const response = await syllabus();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.ok(html.indexOf('Fixture subject') < html.indexOf('Fixture parent topic'));
  assert.ok(html.indexOf('Fixture parent topic') < html.indexOf('Fixture child topic'));
  assert.match(html, /TEST-CYCLE/);
  assert.match(html, /fixture-only/);
  assert.match(html, /Test fixture source \(not official\)/);
  assert.match(html, /Source review verified\s*(?:<!-- -->\s*)?2026-01-01/);
  assert.match(html, /https:\/\/example\.test\/curriculum\.pdf/);
  assert.doesNotMatch(html, /verified_by|verification_notes/);
});

test('syllabus shows an explicit error state when the curriculum API fails', async () => {
  curriculumApiResponse = {
    status: 503,
    delayMs: 0,
    body: {
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Test API outage',
        details: null,
        timestamp: '2026-01-01T00:00:00Z',
      },
    },
  };
  const response = await syllabus();
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Curriculum service unavailable/);
  assert.match(html, /Published curriculum could not be loaded/);
});

test('syllabus exposes a loading state while the curriculum API is pending', async () => {
  curriculumApiResponse = {
    status: 200,
    delayMs: 1500,
    body: {
      success: true,
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 100,
          totalCount: 0,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      },
    },
  };
  const response = await syllabus();
  const reader = response.body.getReader();
  const { value } = await reader.read();
  const firstChunk = new TextDecoder().decode(value);
  await reader.cancel();

  assert.match(firstChunk, /Loading published curriculum|Loading/);
});

test('student dashboard has a distinct authenticated route from the admin dashboard', async () => {
  const [studentResponse, adminResponse] = await Promise.all([
    studentDashboard(),
    fetch(`${origin}/dashboard`),
  ]);
  const studentHtml = await studentResponse.text();
  const adminHtml = await adminResponse.text();

  assert.equal(studentResponse.status, 200);
  assert.equal(adminResponse.status, 200);
  assert.match(studentHtml, /Verifying your account/);
  assert.doesNotMatch(studentHtml, /Super Admin|Platform Overview/);
  assert.doesNotMatch(adminHtml, /Build your path to a future in medicine/);
});
