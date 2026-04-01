import { h, TEXT_NODE } from "../vdom/h.js";

// 이 함수는 VDOM 트리를 사람이 읽기 쉬운 줄글 형태로 바꿔줍니다.
// 실제 렌더링용 함수는 아니고, 학습용/디버깅용 도우미입니다.
function collectNodeLines(node, depth = 0) {
  const indent = "  ".repeat(depth);
  const label =
    node.type === TEXT_NODE
      ? `"${node.props.nodeValue}"`
      : `<${typeof node.type === "function" ? "FunctionComponent" : node.type}>`;

  const propsKeys = Object.keys(node.props || {}).filter((key) => key !== "nodeValue");
  const propsText = propsKeys.length > 0 ? ` props=${JSON.stringify(node.props)}` : "";
  const lines = [`${indent}${label}${propsText}`];

  for (const child of node.children) {
    lines.push(...collectNodeLines(child, depth + 1));
  }

  return lines;
}

// Step 1에서 사용할 샘플 VDOM 트리를 만듭니다.
// 이 트리는 이후 Step 2에서 실제 DOM으로도 렌더링됩니다.
export function createStep1VdomDemo() {
  const tree = h(
    "section",
    { className: "demo-card", "data-step": "1" },
    h("span", { className: "demo-badge" }, "STEP 1"),
    h("h2", null, "VDOM node shape"),
    h(
      "p",
      { className: "demo-copy" },
      "h(type, props, ...children)로 만든 가상 노드 구조를 먼저 고정합니다."
    ),
    h(
      "ul",
      { className: "demo-list" },
      h("li", null, "type: 태그 이름 또는 컴포넌트"),
      h("li", null, "props: 속성과 이벤트를 담는 객체"),
      h("li", null, "children: 또 다른 VDOM 노드 배열")
    )
  );

  return {
    tree,
    treeJson: JSON.stringify(tree, null, 2),
    treeLines: collectNodeLines(tree).join("\n"),
  };
}
