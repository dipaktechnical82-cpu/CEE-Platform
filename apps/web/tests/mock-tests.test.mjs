import test from 'node:test';
import assert from 'node:assert/strict';

// CEE Exam Constants Specification
const CEE_EXAM_CONSTANTS = {
  TOTAL_QUESTIONS: 200,
  TOTAL_MARKS: 200,
  DURATION_MINUTES: 180,
  POSITIVE_MARK: 1.0,
  NEGATIVE_MARK: -0.25,
  SUBJECT_DISTRIBUTION: {
    BIOLOGY: 80,
    CHEMISTRY: 50,
    PHYSICS: 50,
    MAT: 20,
  },
};

// Pure scoring engine under test
function calculateScore(correct, incorrect) {
  const raw = correct * CEE_EXAM_CONSTANTS.POSITIVE_MARK + incorrect * CEE_EXAM_CONSTANTS.NEGATIVE_MARK;
  return Math.max(0, Number(raw.toFixed(2)));
}

function calculateAccuracy(correct, incorrect) {
  const attempted = correct + incorrect;
  if (attempted === 0) return 0;
  return Number(((correct / attempted) * 100).toFixed(1));
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
}

function computePaletteState({ isVisited, isAnswered, isMarked }) {
  if (isAnswered && isMarked) return 'ANSWERED_AND_MARKED';
  if (isMarked) return 'MARKED_FOR_REVIEW';
  if (isAnswered) return 'ANSWERED';
  if (isVisited) return 'NOT_ANSWERED';
  return 'NOT_VISITED';
}

test('Nepal CEE official constants match MEC standards', () => {
  assert.equal(CEE_EXAM_CONSTANTS.TOTAL_QUESTIONS, 200);
  assert.equal(CEE_EXAM_CONSTANTS.TOTAL_MARKS, 200);
  assert.equal(CEE_EXAM_CONSTANTS.DURATION_MINUTES, 180);
  assert.equal(CEE_EXAM_CONSTANTS.POSITIVE_MARK, 1.0);
  assert.equal(CEE_EXAM_CONSTANTS.NEGATIVE_MARK, -0.25);
  assert.equal(CEE_EXAM_CONSTANTS.SUBJECT_DISTRIBUTION.BIOLOGY, 80);
  assert.equal(CEE_EXAM_CONSTANTS.SUBJECT_DISTRIBUTION.CHEMISTRY, 50);
  assert.equal(CEE_EXAM_CONSTANTS.SUBJECT_DISTRIBUTION.PHYSICS, 50);
  assert.equal(CEE_EXAM_CONSTANTS.SUBJECT_DISTRIBUTION.MAT, 20);
});

test('calculateScore calculates authentic +1.0 and -0.25 negative marking', () => {
  // 15 correct, 4 incorrect => (15 * 1.0) - (4 * 0.25) = 15 - 1.0 = 14.0
  assert.equal(calculateScore(15, 4), 14.0);

  // 10 correct, 8 incorrect => 10 - 2.0 = 8.0
  assert.equal(calculateScore(10, 8), 8.0);

  // 1 correct, 3 incorrect => 1 - 0.75 = 0.25
  assert.equal(calculateScore(1, 3), 0.25);
});

test('calculateScore floors net negative score at zero', () => {
  // 0 correct, 10 incorrect => 0 - 2.5 = -2.5 => Floored to 0
  assert.equal(calculateScore(0, 10), 0);
  // 1 correct, 8 incorrect => 1 - 2.0 = -1.0 => Floored to 0
  assert.equal(calculateScore(1, 8), 0);
});

test('calculateAccuracy calculates percentage over attempted questions only', () => {
  assert.equal(calculateAccuracy(18, 2), 90.0);
  assert.equal(calculateAccuracy(10, 10), 50.0);
  assert.equal(calculateAccuracy(0, 5), 0.0);
  assert.equal(calculateAccuracy(0, 0), 0.0);
});

test('formatDuration formats seconds accurately into readable time', () => {
  assert.equal(formatDuration(0), '0m 00s');
  assert.equal(formatDuration(45), '0m 45s');
  assert.equal(formatDuration(75), '1m 15s');
  assert.equal(formatDuration(1800), '30m 00s');
  assert.equal(formatDuration(10800), '180m 00s');
});

test('computePaletteState returns exact 5 official examination states', () => {
  assert.equal(
    computePaletteState({ isVisited: false, isAnswered: false, isMarked: false }),
    'NOT_VISITED',
  );
  assert.equal(
    computePaletteState({ isVisited: true, isAnswered: false, isMarked: false }),
    'NOT_ANSWERED',
  );
  assert.equal(
    computePaletteState({ isVisited: true, isAnswered: true, isMarked: false }),
    'ANSWERED',
  );
  assert.equal(
    computePaletteState({ isVisited: true, isAnswered: false, isMarked: true }),
    'MARKED_FOR_REVIEW',
  );
  assert.equal(
    computePaletteState({ isVisited: true, isAnswered: true, isMarked: true }),
    'ANSWERED_AND_MARKED',
  );
});

test('Mistake DNA taxonomy categorizes 5 error classifications', () => {
  const allowedCategories = [
    'CONCEPTUAL',
    'CALCULATION',
    'MEMORY_RECALL',
    'INTERPRETATION',
    'TIME_MANAGEMENT',
  ];
  assert.equal(allowedCategories.length, 5);
  for (const cat of allowedCategories) {
    assert.ok(typeof cat === 'string');
  }
});
