import { h } from "../../engine/vdom/h.js";

function AppShell({ children, screenClassName = "" }) {
  const screenClass = screenClassName ? `screen ${screenClassName}` : "screen";
  return h("main", { className: "app-shell" }, h("section", { className: screenClass }, children));
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

function getAxisSpec(score, positiveLabel, negativeLabel) {
  const safeScore = Math.max(-4, Math.min(4, score || 0));
  const isPositive = safeScore > 0;
  const intensity = Math.round((Math.abs(safeScore) / 4) * 100);

  return {
    direction: isPositive ? "positive" : "negative",
    label: isPositive ? positiveLabel : negativeLabel,
    value: Math.max(25, intensity),
    score: safeScore,
  };
}

function computeTechSpecs(scores) {
  return {
    top: getAxisSpec(scores?.CT, "협업", "독립"),
    right: getAxisSpec(scores?.TL, "이론", "실전"),
    bottom: getAxisSpec(scores?.PL, "계획", "즉흥"),
    left: getAxisSpec(scores?.AI, "AI 의존", "AI 참고"),
  };
}

function getRadarPoints(techSpecs) {
  const maxRadius = 80;
  const topRadius = (techSpecs.top.value / 100) * maxRadius;
  const rightRadius = (techSpecs.right.value / 100) * maxRadius;
  const bottomRadius = (techSpecs.bottom.value / 100) * maxRadius;
  const leftRadius = (techSpecs.left.value / 100) * maxRadius;

  return [
    `100,${100 - topRadius}`,
    `${100 + rightRadius},100`,
    `100,${100 + bottomRadius}`,
    `${100 - leftRadius},100`,
  ].join(" ");
}

function RadarGraph({ scores, axes }) {
  const techSpecs = computeTechSpecs(scores);

  const axisItems = (axes || []).map((axis) => {
    const axisSpec = getAxisSpec(scores?.[axis.id], axis.labelPositive, axis.labelNegative);

    return h(
      "li",
      { className: "radar-detail-item" },
      h("strong", { className: "radar-detail-axis" }, axis.id),
      h("span", { className: "radar-detail-label" }, axisSpec.label),
      h("span", { className: "radar-detail-score" }, `${axisSpec.value}%`)
    );
  });

  return h(
    "div",
    { className: "radar-card" },
    h("p", { className: "result-section-label" }, "TECH_SPECS"),
    h(
      "div",
      { className: "radar-graph-wrap" },
      h(
        "svg",
        {
          className: "radar-graph",
          viewBox: "0 0 200 200",
          preserveAspectRatio: "xMidYMid meet",
          "aria-label": "성향 그래프",
        },
        h("polygon", {
          className: "radar-grid radar-grid-outer",
          points: "100 20 180 100 100 180 20 100",
        }),
        h("polygon", {
          className: "radar-grid",
          points: "100 40 160 100 100 160 40 100",
        }),
        h("polygon", {
          className: "radar-grid",
          points: "100 60 140 100 100 140 60 100",
        }),
        h("polygon", {
          className: "radar-grid",
          points: "100 80 120 100 100 120 80 100",
        }),
        h("line", { className: "radar-axis", x1: "100", y1: "20", x2: "100", y2: "180" }),
        h("line", { className: "radar-axis", x1: "20", y1: "100", x2: "180", y2: "100" }),
        h("polygon", {
          className: "radar-shape",
          points: getRadarPoints(techSpecs),
        }),
        h("circle", { className: "radar-center-dot", cx: "100", cy: "100", r: "3" }),
        h("text", { className: "radar-label", x: "100", y: "12" }, techSpecs.top.label),
        h("text", { className: "radar-label", x: "188", y: "104", "text-anchor": "end" }, techSpecs.right.label),
        h("text", { className: "radar-label", x: "100", y: "194" }, techSpecs.bottom.label),
        h("text", { className: "radar-label", x: "12", y: "104", "text-anchor": "start" }, techSpecs.left.label)
      )
    ),
    h("p", { className: "radar-summary-title" }, "축 판정 요약"),
    h(
      "ul",
      { className: "radar-detail-list" },
      axisItems
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
    h("p", { className: "result-section-label" }, "PROFILE"),
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
    screenClassName: "screen-result",
    children: [
      HeaderLogo(),
      h("h1", { className: "page-title" }, "정글 성향 테스트 결과"),
      h(
        "div",
        { className: "result-content" },
        ResultHero({ result }),
        ResultDescriptionCard({ result }),
        ResultStrengthCard({ strengths: result?.strengths }),
        ResultCautionCard({ caution: result?.caution }),
        RadarGraph({
          scores,
          axes: [
            { id: "CT", labelPositive: "협업", labelNegative: "독립" },
            { id: "TL", labelPositive: "이론", labelNegative: "실전" },
            { id: "PL", labelPositive: "계획", labelNegative: "즉흥" },
            { id: "AI", labelPositive: "AI의존", labelNegative: "AI참고" },
          ],
        }),
        BestSynergy({ bestMatchResult })
      ),
      h(
        "footer",
        { className: "result-actions" },
        PrimaryButton({
          label: "다시하기",
          onClick: onRestart,
        })
      ),
    ],
  });
}
