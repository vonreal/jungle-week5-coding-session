import { StartPage, NicknamePage, QuestionPage, ResultPage } from "./components/pages.js";
import { quizConfig, questions, results } from "./data/jungle-quiz-data.js";
import { evaluateQuizResult } from "./domain/quiz-logic.js";
import { createRenderer, h } from "./runtime/vdom.js";

const appState = {
  screen: "start",
  nickname: "",
  currentIndex: 0,
  answers: [],
};

const resultMemo = {
  key: "",
  value: {
    scores: {},
    directions: {},
    result: null,
  },
};

function resetState() {
  appState.screen = "start";
  appState.nickname = "";
  appState.currentIndex = 0;
  appState.answers = [];
}

function getMemoizedResult() {
  const key = JSON.stringify(appState.answers);

  if (key === resultMemo.key) {
    return resultMemo.value;
  }

  const nextValue = evaluateQuizResult({
    questions,
    answers: appState.answers,
    axes: quizConfig.axes,
    results,
  });

  resultMemo.key = key;
  resultMemo.value = nextValue;

  return nextValue;
}

function App({ state, handlers }) {
  if (state.screen === "start") {
    return h(StartPage, {
      config: quizConfig,
      onStart: handlers.handleStart,
    });
  }

  if (state.screen === "nickname") {
    return h(NicknamePage, {
      nickname: state.nickname,
      onInputNickname: handlers.handleNicknameInput,
      onSubmitNickname: handlers.handleNicknameSubmit,
    });
  }

  if (state.screen === "quiz") {
    return h(QuestionPage, {
      question: questions[state.currentIndex],
      questionIndex: state.currentIndex,
      totalQuestions: questions.length,
      onSelectChoice: handlers.handleChoiceSelect,
    });
  }

  const calculated = getMemoizedResult();

  return h(ResultPage, {
    nickname: state.nickname,
    result: calculated.result,
    directions: calculated.directions,
    onRestart: handlers.handleRestart,
  });
}

export function mountApp() {
  const root = document.querySelector("#app");
  const renderer = createRenderer(root);

  const render = () => {
    renderer.render(
      h("div", { className: "app-root" }, h(App, { state: appState, handlers }))
    );
  };

  const handlers = {
    handleStart() {
      appState.screen = "nickname";
      render();
    },
    handleNicknameInput(event) {
      appState.nickname = event.target.value;
      render();
    },
    handleNicknameSubmit() {
      if (!appState.nickname.trim()) return;
      appState.screen = "quiz";
      render();
    },
    handleChoiceSelect(choice) {
      const question = questions[appState.currentIndex];
      appState.answers = [
        ...appState.answers,
        {
          questionId: question.id,
          axis: question.axis,
          choiceId: choice.id,
          score: choice.score,
        },
      ];

      if (appState.currentIndex >= questions.length - 1) {
        appState.screen = "result";
      } else {
        appState.currentIndex += 1;
      }

      render();
    },
    handleRestart() {
      resetState();
      render();
    },
  };

  render();
}
