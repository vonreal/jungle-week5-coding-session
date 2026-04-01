import { h } from "../vdom/h.js";
import { useEffect } from "../hooks/useEffect.js";
import { useState } from "../hooks/useState.js";

// EffectDemo는 useEffect가 "렌더 후" 동작한다는 걸 보여주는 예제입니다.
//
// 여기서 볼 수 있는 포인트:
// - count state가 바뀌면 화면이 먼저 다시 그려진다
// - 그 다음 useEffect가 실행되어 로그가 쌓인다
// - cleanup 함수는 이전 effect를 정리할 때 실행된다
export function EffectDemo() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState(() => ["처음 렌더링이 끝나면 effect가 실행됩니다."]);
  const [status, setStatus] = useState("아직 effect 실행 전");

  useEffect(() => {
    setStatus(`count=${count} 기준 effect 실행 완료`);

    setLogs((previousLogs) => [
      ...previousLogs,
      `effect 실행: count가 ${count}(으)로 바뀐 뒤 실행됨`,
    ]);

    // cleanup은 다음 effect가 실행되기 직전에 불립니다.
    return () => {
      setLogs((previousLogs) => [
        ...previousLogs,
        `cleanup 실행: 이전 count=${count} effect 정리`,
      ]);
    };
  }, [count]);

  return h(
    "section",
    { className: "effect-card" },
    h("span", { className: "demo-badge" }, "STEP 6"),
    h("h2", null, "useEffect"),
    h(
      "p",
      { className: "demo-copy" },
      "버튼으로 state를 바꾸면 먼저 화면이 다시 그려지고, 그 다음 effect가 실행되어 상태 메시지와 로그가 갱신됩니다."
    ),
    h(
      "div",
      { className: "effect-status-box" },
      h("strong", { className: "effect-status-count" }, `count: ${count}`),
      h("span", { className: "effect-status-text" }, status)
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
          onClick: () => setCount(0),
        },
        "count reset"
      )
    ),
    h(
      "ol",
      { className: "counter-flow" },
      h("li", null, "버튼 클릭 -> setState 실행"),
      h("li", null, "컴포넌트가 다시 렌더링됨"),
      h("li", null, "렌더가 끝난 뒤 useEffect 실행"),
      h("li", null, "필요하면 이전 cleanup 먼저 실행"),
      h("li", null, "로그와 상태 문구가 effect 결과로 갱신됨")
    ),
    h(
      "div",
      { className: "log-panel" },
      h("h3", null, "Effect Log"),
      h(
        "ul",
        { className: "log-list" },
        logs.map((logText, index) =>
          h("li", { key: `log-${index}` }, logText)
        )
      )
    )
  );
}
