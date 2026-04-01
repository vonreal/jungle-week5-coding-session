import { h } from "../vdom/h.js";
import { useState } from "../hooks/useState.js";

// CounterDemo는 Step 3~5를 한 번에 보여주는 루트 컴포넌트입니다.
//
// 여기서 볼 수 있는 핵심:
// - 함수형 컴포넌트가 다시 실행된다
// - 그런데 count 값은 hooks 배열 덕분에 유지된다
// - 버튼을 누르면 setState -> update() -> 다시 render() 흐름이 돈다
export function CounterDemo() {
  const [count, setCount] = useState(0);

  return h(
    "section",
    { className: "counter-card" },
    h("span", { className: "demo-badge" }, "STEP 3-5"),
    h("h2", null, "FunctionComponent + useState"),
    h(
      "p",
      { className: "demo-copy" },
      "버튼을 누를 때마다 state가 바뀌고, 루트 컴포넌트가 다시 실행되면서 화면도 함께 갱신됩니다."
    ),
    h(
      "div",
      { className: "counter-value-box" },
      h("strong", { className: "counter-value" }, count),
      h("span", { className: "counter-label" }, "현재 카운트")
    ),
    h(
      "div",
      { className: "counter-actions" },
      h(
        "button",
        {
          className: "counter-button primary",
          onClick: () => setCount((prevCount) => prevCount + 1),
        },
        "+1"
      ),
      h(
        "button",
        {
          className: "counter-button",
          onClick: () => setCount((prevCount) => prevCount - 1),
        },
        "-1"
      ),
      h(
        "button",
        {
          className: "counter-button",
          onClick: () => setCount(0),
        },
        "reset"
      )
    ),
    h(
      "ol",
      { className: "counter-flow" },
      h("li", null, "버튼을 누르면 onClick 함수가 실행됩니다."),
      h("li", null, "그 안에서 setState가 hooks 배열 값을 바꿉니다."),
      h("li", null, "setState가 update()를 호출합니다."),
      h("li", null, "컴포넌트 함수가 다시 실행됩니다."),
      h("li", null, "새 VDOM이 실제 DOM으로 다시 렌더링됩니다.")
    )
  );
}
