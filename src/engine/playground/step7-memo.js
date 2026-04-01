import { useMemo } from "../hooks/useMemo.js";
import { useState } from "../hooks/useState.js";
import { h } from "../vdom/h.js";

// 화면 밖에 있는 변수로 계산 횟수를 기록합니다.
// 이렇게 하면 "언제 실제 계산이 다시 일어났는지" 눈으로 확인하기 쉽습니다.
let calculationCount = 0;

// 성향테스트에서 하게 될 "점수 합산"과 비슷한 느낌의 데모입니다.
// count와 multiplier를 곱한 값을 비싼 계산 결과라고 가정합니다.
export function MemoDemo() {
  const [count, setCount] = useState(1);
  const [multiplier, setMultiplier] = useState(2);
  const [theme, setTheme] = useState("sand");

  const memoResult = useMemo(() => {
    calculationCount += 1;

    // 일부러 계산을 하는 척 표현만 넣었습니다.
    // 실제 프로젝트에서는 축별 점수 합산, 결과 매칭 같은 계산이 여기에 들어갑니다.
    return count * multiplier;
  }, [count, multiplier]);

  const isForestTheme = theme === "forest";

  return h(
    "section",
    {
      className: isForestTheme ? "memo-card memo-card-forest" : "memo-card",
    },
    h("span", { className: "demo-badge" }, "STEP 7"),
    h("h2", null, "useMemo"),
    h(
      "p",
      { className: "demo-copy" },
      "count와 multiplier가 바뀔 때만 계산을 다시 하고, theme만 바뀌면 이전 계산 결과를 그대로 재사용합니다."
    ),
    h(
      "div",
      { className: "memo-stats-grid" },
      h(
        "div",
        { className: "memo-stat-box" },
        h("span", { className: "memo-stat-label" }, "count"),
        h("strong", { className: "memo-stat-value" }, count)
      ),
      h(
        "div",
        { className: "memo-stat-box" },
        h("span", { className: "memo-stat-label" }, "multiplier"),
        h("strong", { className: "memo-stat-value" }, multiplier)
      ),
      h(
        "div",
        { className: "memo-stat-box" },
        h("span", { className: "memo-stat-label" }, "memo result"),
        h("strong", { className: "memo-stat-value" }, memoResult)
      ),
      h(
        "div",
        { className: "memo-stat-box" },
        h("span", { className: "memo-stat-label" }, "calculation count"),
        h("strong", { className: "memo-stat-value" }, calculationCount)
      )
    ),
    h(
      "div",
      { className: "counter-actions" },
      h(
        "button",
        {
          className: "counter-button primary",
          onClick: () => setCount((previousCount) => previousCount + 1),
        },
        "count +1"
      ),
      h(
        "button",
        {
          className: "counter-button",
          onClick: () => setMultiplier((previousMultiplier) => previousMultiplier + 1),
        },
        "multiplier +1"
      ),
      h(
        "button",
        {
          className: "counter-button",
          onClick: () =>
            setTheme((previousTheme) =>
              previousTheme === "sand" ? "forest" : "sand"
            ),
        },
        "theme toggle"
      )
    ),
    h(
      "ol",
      { className: "counter-flow" },
      h("li", null, "count 변경 -> 의존성 변경 -> 계산 다시 실행"),
      h("li", null, "multiplier 변경 -> 의존성 변경 -> 계산 다시 실행"),
      h("li", null, "theme 변경 -> 의존성 그대로 -> 계산 결과 재사용"),
      h("li", null, "성향테스트에서는 점수 합산과 결과 매칭이 이 자리에 들어갈 수 있음")
    )
  );
}
