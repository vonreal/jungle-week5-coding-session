import assert from "node:assert/strict";
import { evaluateQuizResult } from "../../src/app/domain/quiz-logic.js";

const axes = [{ id: "CT" }, { id: "TL" }, { id: "PL" }, { id: "AI" }];

const questions = [
  { id: 1, axis: "CT" },
  { id: 2, axis: "TL" },
  { id: 3, axis: "PL" },
  { id: 4, axis: "AI" },
];

const answers = [
  { questionId: 1, score: 2 },
  { questionId: 2, score: -1 },
  { questionId: 3, score: 1 },
  { questionId: 4, score: -2 },
];

const results = [
  {
    id: "case-a",
    condition: { CT: "positive", TL: "negative", PL: "positive", AI: "negative" },
  },
  {
    id: "case-b",
    condition: { CT: "negative", TL: "negative", PL: "positive", AI: "negative" },
  },
];

const evaluated = evaluateQuizResult({
  questions,
  answers,
  axes,
  results,
});

assert.deepEqual(evaluated.scores, {
  CT: 2,
  TL: -1,
  PL: 1,
  AI: -2,
});

assert.deepEqual(evaluated.directions, {
  CT: "positive",
  TL: "negative",
  PL: "positive",
  AI: "negative",
});

assert.equal(evaluated.result?.id, "case-a");

console.log("quiz-logic.test.mjs passed");
