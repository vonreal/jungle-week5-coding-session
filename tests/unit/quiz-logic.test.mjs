import assert from "node:assert/strict";

import { quizConfig, quizQuestions, quizResults } from "../../src/app/data/index.js";
import { evaluateQuizResult } from "../../src/app/domain/quiz-logic.js";

const AXIS_IDS = quizConfig.axes.map((axis) => axis.id);
const EXPECTED_COMBINATION_COUNT = 2 ** AXIS_IDS.length;

function buildCombinationKey(directions) {
  return AXIS_IDS.map((axisId) => `${axisId}:${directions[axisId]}`).join("|");
}

function buildDirectionsFromBits(mask) {
  return AXIS_IDS.reduce((acc, axisId, index) => {
    acc[axisId] = (mask & (1 << index)) !== 0 ? "positive" : "negative";
    return acc;
  }, {});
}

function buildAnswersForDirections(directions) {
  return quizQuestions.map((question) => {
    const wantedDirection = directions[question.axis];
    const choice = question.choices.find((item) =>
      wantedDirection === "positive" ? item.score > 0 : item.score < 0
    );

    assert.ok(choice, `No choice found for axis ${question.axis} with direction ${wantedDirection}`);

    return {
      questionId: question.id,
      choiceId: choice.id,
      score: choice.score,
    };
  });
}

assert.equal(
  quizResults.length,
  EXPECTED_COMBINATION_COUNT,
  `Expected ${EXPECTED_COMBINATION_COUNT} result types`
);

const uniqueResultConditions = new Set(quizResults.map((result) => buildCombinationKey(result.condition)));
assert.equal(
  uniqueResultConditions.size,
  EXPECTED_COMBINATION_COUNT,
  "Each result should map to a unique 4-axis combination"
);

const seenResultIds = new Set();
const reports = [];

for (let mask = 0; mask < EXPECTED_COMBINATION_COUNT; mask += 1) {
  const directions = buildDirectionsFromBits(mask);
  const answers = buildAnswersForDirections(directions);

  const evaluated = evaluateQuizResult({
    questions: quizQuestions,
    answers,
    axes: quizConfig.axes,
    results: quizResults,
  });

  assert.deepEqual(
    evaluated.directions,
    directions,
    `Directions mismatch for ${buildCombinationKey(directions)}`
  );

  assert.ok(evaluated.result, `No result matched for ${buildCombinationKey(directions)}`);
  assert.deepEqual(
    evaluated.result.condition,
    directions,
    `Result condition mismatch for ${buildCombinationKey(directions)}`
  );

  seenResultIds.add(evaluated.result.id);
  reports.push({
    key: buildCombinationKey(directions),
    resultId: evaluated.result.id,
    animal: evaluated.result.animal,
    title: evaluated.result.title,
  });
}

assert.equal(seenResultIds.size, EXPECTED_COMBINATION_COUNT, "All 16 result types should be reachable");

reports.sort((a, b) => a.key.localeCompare(b.key));

for (const report of reports) {
  console.log(`${report.key} -> ${report.resultId} | ${report.animal} | ${report.title}`);
}

console.log("quiz-logic.test.mjs passed");
