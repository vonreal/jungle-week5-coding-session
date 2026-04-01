import { quizConfig as baseConfig } from "./config.js";
import { quizDataFullUpdated } from "./quiz_data_full_updated.js";

export const quizQuestions = quizDataFullUpdated.questions;
export const quizResults = quizDataFullUpdated.results;

export const quizConfig = {
  ...baseConfig,
  totalQuestions: quizDataFullUpdated.questions.length,
};
