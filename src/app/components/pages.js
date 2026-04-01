import { h } from "../../engine/vdom/h.js";

function AppShell({ children }) {
  return h("main", { className: "app-shell" }, h("section", { className: "screen" }, children));
}

function HeaderLogo() {
  return h("div", { className: "logo" }, "JUNGLE TEST");
}

function PrimaryButton({ label, onClick, disabled, block = false }) {
  return h(
    "button",
    {
      className: `primary-button${block ? " block" : ""}`,
      onClick,
      disabled,
      type: "button",
    },
    label
  );
}

export function StartPage({ config, onStart }) {
  return AppShell({
    children: [
      HeaderLogo(),
      h("h1", { className: "page-title" }, config.subtitle),
      h("p", { className: "start-headline" }, config.title),
      h("p", { className: "page-description" }, config.description),
      PrimaryButton({
        label: config.ctaLabel,
        onClick: onStart,
        block: true,
      }),
    ],
  });
}

export function NicknamePage({ nickname, onInputNickname, onSubmitNickname }) {
  const isValid = nickname.trim().length > 0;

  return AppShell({
    children: [
      h("h2", { className: "question-title" }, "이름(닉네임)이 무엇인가요?"),
      h("label", { className: "field-wrap" },
        h("input", {
          className: "nickname-input",
          type: "text",
          placeholder: "닉네임 입력",
          value: nickname,
          maxLength: 16,
          onInput: onInputNickname,
          onChange: onInputNickname,
          onKeydown: (event) => {
            if (event.key === "Enter") onSubmitNickname();
          },
        })
      ),
      PrimaryButton({
        label: "다음으로",
        onClick: onSubmitNickname,
        disabled: !isValid,
      }),
    ],
  });
}

function ProgressBar({ current, total }) {
  const progress = total > 0 ? Math.floor((current / total) * 100) : 0;

  return h(
    "div",
    { className: "progress-wrap" },
    h("span", { className: "progress-label" }, `${current}/${total}`),
    h("div", { className: "progress-track" },
      h("div", {
        className: "progress-fill",
        style: `width: ${progress}%;`,
      })
    )
  );
}

function ChoiceButton({ choice, onSelect }) {
  return h(
    "button",
    {
      className: "choice-button",
      onClick: () => onSelect(choice),
      type: "button",
    },
    choice.text
  );
}

export function QuestionPage({ question, questionIndex, totalQuestions, onSelectChoice }) {
  return AppShell({
    children: [
      ProgressBar({
        current: questionIndex + 1,
        total: totalQuestions,
      }),
      h("h2", { className: "question-title" }, question.text),
      h(
        "div",
        { className: "choice-list" },
        question.choices.map((choice) => ChoiceButton({ choice, onSelect: onSelectChoice }))
      ),
    ],
  });
}

export function ResultPage({ nickname, result, directions, onRestart }) {
  return AppShell({
    children: [
      HeaderLogo(),
      h("h1", { className: "page-title" }, "정글 성향 테스트 결과"),
      h(
        "article",
        { className: "result-card" },
        h("p", { className: "result-animal" }, result?.animal || "결과 준비 중"),
        h("h2", { className: "result-title" }, result?.title || "아직 매칭되는 결과가 없어요"),
        h("p", { className: "result-description" }, result?.description || "데이터를 확인해 주세요."),
        h("ul", { className: "result-strengths" },
          (result?.strengths || []).map((strength) => h("li", {}, strength))
        ),
        h("p", { className: "result-caution" }, result?.caution || "")
      ),
      h("div", { className: "result-meta" },
        h("p", {}, `${nickname} 님의 축 판정`),
        h(
          "p",
          { className: "direction-text" },
          Object.keys(directions)
            .map((axisId) => `${axisId}:${directions[axisId]}`)
            .join(" / ")
        )
      ),
      PrimaryButton({
        label: "다시하기",
        onClick: onRestart,
      }),
    ],
  });
}
