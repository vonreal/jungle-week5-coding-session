export function createEmptyScores(axes) {
  return axes.reduce((acc, axis) => {
    acc[axis.id] = 0;
    return acc;
  }, {});
}

export function accumulateScores(questions, answers, axes) {
  const scores = createEmptyScores(axes);
  const questionMap = new Map(questions.map((question) => [question.id, question]));

  answers.forEach((answer) => {
    const question = questionMap.get(answer.questionId);
    if (!question) return;
    scores[question.axis] += answer.score;
  });

  return scores;
}

export function resolveDirections(scores) {
  return Object.keys(scores).reduce((acc, axisId) => {
    acc[axisId] = scores[axisId] > 0 ? "positive" : "negative";
    return acc;
  }, {});
}

export function findMatchingResult(results, directions) {
  return (
    results.find((result) => {
      return Object.keys(directions).every((axisId) => result.condition[axisId] === directions[axisId]);
    }) || null
  );
}

export function evaluateQuizResult({ questions, answers, axes, results }) {
  const scores = accumulateScores(questions, answers, axes);
  const directions = resolveDirections(scores);
  const result = findMatchingResult(results, directions);

  return {
    scores,
    directions,
    result,
  };
}
