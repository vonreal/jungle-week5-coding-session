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

export function NicknamePage({
  nickname,
  onInputNickname,
  onSubmitNickname,
  onNicknameCompositionStart,
  onNicknameCompositionEnd,
}) {
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
          onCompositionStart: onNicknameCompositionStart,
          onCompositionEnd: onNicknameCompositionEnd,
          onKeydown: (event) => {
            if (event.isComposing) return;
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

function ChoiceButton({ choice, onSelect, selected }) {
  return h(
    "button",
    {
      className: `choice-button${selected ? " selected" : ""}`,
      onClick: () => onSelect(choice),
      type: "button",
    },
    choice.text
  );
}

function clampScore(value) {
  return Math.max(-4, Math.min(4, value || 0));
}

function RadarGraph({ scores }) {
  const ct = clampScore(scores?.CT);
  const tl = clampScore(scores?.TL);
  const pl = clampScore(scores?.PL);
  const ai = clampScore(scores?.AI);

  const points = [
    `80 ${80 - tl * 10}`,
    `${80 + ai * 10} 80`,
    `80 ${80 + pl * 10}`,
    `${80 - ct * 10} 80`,
  ].join(" ");

  return h(
    "div",
    { className: "radar-card" },
    h("p", { className: "result-section-label" }, "TECH_SPECS"),
    h(
      "svg",
      {
        className: "radar-graph",
        viewBox: "0 0 160 160",
        "aria-label": "성향 그래프",
      },
      h("polygon", {
        className: "radar-grid",
        points: "80 24 136 80 80 136 24 80",
      }),
      h("line", { className: "radar-axis", x1: "80", y1: "20", x2: "80", y2: "140" }),
      h("line", { className: "radar-axis", x1: "20", y1: "80", x2: "140", y2: "80" }),
      h("polygon", {
        className: "radar-shape",
        points,
      }),
      h("text", { className: "radar-label", x: "80", y: "12" }, "THEORY"),
      h("text", { className: "radar-label", x: "80", y: "154" }, "PLAN"),
      h("text", { className: "radar-label", x: "10", y: "84" }, "CO-OP"),
      h("text", { className: "radar-label", x: "150", y: "84" }, "AI")
    )
  );
}

function ResultHero({ result }) {
  const hasImage = Boolean(result?.image);

  return h(
    "section",
    { className: "result-hero" },
    hasImage
      ? h("img", {
          className: "result-image",
          src: result.image,
          alt: result?.animal || "결과 동물 이미지",
        })
      : h(
          "div",
          { className: "result-image result-image-placeholder" },
          h("span", { className: "result-image-animal" }, result?.animal || "정글 동물"),
          h("span", { className: "result-image-copy" }, result?.reason || "DEMO IMAGE SLOT")
        ),
    h("p", { className: "result-section-label" }, "TYPE"),
    h("p", { className: "result-hero-title" }, result?.title || "결과 준비 중")
  );
}

function BestSynergy({ bestMatchResult }) {
  return h(
    "section",
    { className: "synergy-card" },
    h("p", { className: "result-section-label" }, "BEST_SYNERGY"),
    h(
      "div",
      { className: "synergy-row" },
      h("div", { className: "synergy-icon" }, bestMatchResult?.animal?.split(" ")[0] || "?"),
      h(
        "div",
        { className: "synergy-copy" },
        h("strong", { className: "synergy-name" }, bestMatchResult?.title || "궁합 동물 준비 중"),
        h("p", { className: "synergy-description" }, bestMatchResult?.reason || "가장 잘 맞는 동물 정보를 여기에 표시합니다.")
      )
    )
  );
}

function ResultDescriptionCard({ result }) {
  return h(
    "article",
    { className: "result-card" },
    h("p", { className: "result-animal" }, result?.animal || "결과 준비 중"),
    h("h2", { className: "result-title" }, result?.title || "아직 매칭되는 결과가 없어요"),
    h("p", { className: "result-description" }, result?.description || "데이터를 확인해 주세요.")
  );
}

function ResultStrengthCard({ strengths }) {
  const summary = (strengths || []).join(", ") || "강점 정보 준비 중";

  return h(
    "section",
    { className: "insight-card insight-card-positive" },
    h("div", { className: "insight-icon" }, "⚡"),
    h(
      "div",
      { className: "insight-copy" },
      h("strong", { className: "insight-title" }, "강점"),
      h("p", { className: "insight-description" }, summary)
    )
  );
}

function ResultCautionCard({ caution }) {
  return h(
    "section",
    { className: "insight-card insight-card-caution" },
    h("div", { className: "insight-icon" }, "!"),
    h(
      "div",
      { className: "insight-copy" },
      h("strong", { className: "insight-title" }, "주의점"),
      h("p", { className: "insight-description" }, caution || "보완점 정보 준비 중")
    )
  );
}

export function QuestionPage({
  question,
  questionIndex,
  totalQuestions,
  selectedChoiceId,
  answeredCount,
  canGoPrev,
  canGoNext,
  canFinish,
  onSelectChoice,
  onPrevQuestion,
  onNextQuestion,
  onFinishQuiz,
}) {
  return AppShell({
    children: [
      ProgressBar({
        current: questionIndex + 1,
        total: totalQuestions,
      }),
      h("p", { className: "saved-status" }, `저장됨 ${answeredCount}/${totalQuestions}`),
      h("h2", { className: "question-title question-title-fixed" }, question.text),
      h(
        "div",
        { className: "choice-list" },
        question.choices.map((choice) =>
          ChoiceButton({
            choice,
            onSelect: onSelectChoice,
            selected: selectedChoiceId === choice.id,
          })
        )
      ),
      h(
        "div",
        { className: "question-nav" },
        h(
          "div",
          { className: "question-nav-row" },
          h(
            "button",
            {
              className: "nav-button",
              type: "button",
              onClick: onPrevQuestion,
              disabled: !canGoPrev,
            },
            "이전"
          ),
          h(
            "button",
            {
              className: "nav-button",
              type: "button",
              onClick: onNextQuestion,
              disabled: !canGoNext,
            },
            "다음"
          )
        ),
        h(
          "button",
          {
            className: "nav-button nav-finish nav-finish-full",
            type: "button",
            onClick: onFinishQuiz,
            disabled: !canFinish,
          },
          "결과 보기"
        )
      ),
    ],
  });
}

export function ResultPage({ nickname, result, scores, directions, bestMatchResult, onRestart }) {
  return AppShell({
    children: [
      HeaderLogo(),
      h("h1", { className: "page-title" }, "정글 성향 테스트 결과"),
      ResultHero({ result }),
      ResultDescriptionCard({ result }),
      ResultStrengthCard({ strengths: result?.strengths }),
      ResultCautionCard({ caution: result?.caution }),
      RadarGraph({ scores }),
      BestSynergy({ bestMatchResult }),
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
