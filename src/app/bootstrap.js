import { mountRoot } from "../engine/core/mountRoot.js";
import { useMemo } from "../engine/hooks/useMemo.js";
import { useState } from "../engine/hooks/useState.js";
import { NicknamePage, QuestionPage, ResultPage, StartPage } from "./components/pages.js";
import { quizConfig, quizQuestions, quizResults } from "./data/index.js";
import { evaluateQuizResult } from "./domain/quiz-logic.js";

function getSavedAnswer(answers, questionId) {
  return answers.find((answer) => answer.questionId === questionId) || null;
}

function upsertAnswer(answers, nextAnswer) {
  const index = answers.findIndex((answer) => answer.questionId === nextAnswer.questionId);
  if (index === -1) return [...answers, nextAnswer];

  const copied = [...answers];
  copied[index] = nextAnswer;
  return copied;
}

function App() {
  const [appState, setAppState] = useState({
    screen: "start",
    nickname: "",
    currentIndex: 0,
    answers: [],
  });

  const calculated = useMemo(() => {
    return evaluateQuizResult({
      questions: quizQuestions,
      answers: appState.answers,
      axes: quizConfig.axes,
      results: quizResults,
    });
  }, [appState.answers]);

  const startConfig = {
    ...quizConfig,
    subtitle: quizConfig.subtitle || "정글 성향 테스트",
    ctaLabel: quizConfig.ctaLabel || "나는 어떤 정글 동물일까?",
  };

  const handleStart = () => {
    setAppState((prev) => ({
      ...prev,
      screen: "nickname",
    }));
  };

  const handleNicknameInput = (event) => {
    const nextNickname = event?.target?.value ?? "";
    setAppState((prev) => ({
      ...prev,
      nickname: nextNickname,
    }));
  };

  const handleNicknameSubmit = () => {
    setAppState((prev) => {
      if (!prev.nickname.trim()) return prev;
      return {
        ...prev,
        screen: "quiz",
      };
    });
  };

  const handleChoiceSelect = (choice) => {
    setAppState((prev) => {
      const question = quizQuestions[prev.currentIndex];
      const nextAnswers = upsertAnswer(prev.answers, {
        questionId: question.id,
        axis: question.axis,
        choiceId: choice.id,
        score: choice.score,
      });

      return {
        ...prev,
        answers: nextAnswers,
      };
    });
  };

  const handlePrevQuestion = () => {
    setAppState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  };

  const handleNextQuestion = () => {
    setAppState((prev) => ({
      ...prev,
      currentIndex: Math.min(quizQuestions.length - 1, prev.currentIndex + 1),
    }));
  };

  const handleFinishQuiz = () => {
    setAppState((prev) => {
      if (prev.answers.length !== quizQuestions.length) return prev;
      return {
        ...prev,
        screen: "result",
      };
    });
  };

  const handleRestart = () => {
    setAppState({
      screen: "start",
      nickname: "",
      currentIndex: 0,
      answers: [],
    });
  };

  if (appState.screen === "start") {
    return StartPage({
      config: startConfig,
      onStart: handleStart,
    });
  }

  if (appState.screen === "nickname") {
    return NicknamePage({
      nickname: appState.nickname,
      onInputNickname: handleNicknameInput,
      onSubmitNickname: handleNicknameSubmit,
    });
  }

  if (appState.screen === "quiz") {
    const currentQuestion = quizQuestions[appState.currentIndex];
    const savedAnswer = getSavedAnswer(appState.answers, currentQuestion.id);
    const isLastQuestion = appState.currentIndex === quizQuestions.length - 1;

    return QuestionPage({
      question: currentQuestion,
      questionIndex: appState.currentIndex,
      totalQuestions: quizQuestions.length,
      selectedChoiceId: savedAnswer?.choiceId || null,
      answeredCount: appState.answers.length,
      canGoPrev: appState.currentIndex > 0,
      canGoNext: appState.currentIndex < quizQuestions.length - 1,
      canFinish: appState.answers.length === quizQuestions.length,
      isLastQuestion,
      onSelectChoice: handleChoiceSelect,
      onPrevQuestion: handlePrevQuestion,
      onNextQuestion: handleNextQuestion,
      onFinishQuiz: handleFinishQuiz,
    });
  }

  return ResultPage({
    nickname: appState.nickname,
    result: calculated.result,
    directions: calculated.directions,
    onRestart: handleRestart,
  });
}

export function mountApp() {
  const root = document.querySelector("#app");
  mountRoot(App, root);
}
