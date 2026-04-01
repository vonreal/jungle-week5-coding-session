import { createElement } from "./createElement.js";
import { diffTrees } from "./diff.js";
import { patch } from "./patch.js";

// render는 "가상 DOM 트리 전체"를 실제 DOM에 반영하는 함수입니다.
//
// Step 2까지는 매번 전체를 다시 그렸지만,
// 이제는 old VDOM이 있으면 diff/patch 흐름으로 바뀐 부분만 수정합니다.
export function render(nextVNode, container, previousVNode = null) {
  // 첫 렌더라면 비교 대상이 없으므로 전체를 한 번 붙입니다.
  if (!previousVNode || !container.firstChild) {
    container.innerHTML = "";
    container.appendChild(createElement(nextVNode));

    container.dispatchEvent(
      new CustomEvent("mini-react:patch-report", {
        detail: {
          mode: "initial-render",
          changes: ["[root] initial render"],
        },
      })
    );
    return;
  }

  const changes = diffTrees(previousVNode, nextVNode);

  patch(container, previousVNode, nextVNode, 0);

  container.dispatchEvent(
    new CustomEvent("mini-react:patch-report", {
      detail: {
        mode: "patch-update",
        changes: changes.length > 0 ? changes : ["[root] no visible changes"],
      },
    })
  );
}
