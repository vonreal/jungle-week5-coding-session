import { TEXT_NODE } from "../vdom/h.js";

// 노드 두 개가 "완전히 다른 종류"인지 확인합니다.
// 완전히 다르면 patch에서 교체(replace)해야 합니다.
function shouldReplaceNode(oldVNode, newVNode) {
  if (!oldVNode || !newVNode) {
    return false;
  }

  if (oldVNode.type !== newVNode.type) {
    return true;
  }

  if (
    oldVNode.type === TEXT_NODE &&
    oldVNode.props.nodeValue !== newVNode.props.nodeValue
  ) {
    return true;
  }

  return false;
}

function describeNode(vNode) {
  if (!vNode) {
    return "empty";
  }

  if (vNode.type === TEXT_NODE) {
    return `text("${vNode.props.nodeValue}")`;
  }

  return `<${vNode.type}>`;
}

function collectPropChanges(oldProps = {}, newProps = {}) {
  const changes = [];
  const shouldIgnoreProp = (propName) => propName === "key" || propName.startsWith("on");

  for (const [propName, oldValue] of Object.entries(oldProps)) {
    if (shouldIgnoreProp(propName)) {
      continue;
    }

    if (!(propName in newProps)) {
      changes.push(`remove prop "${propName}"`);
      continue;
    }

    if (!Object.is(oldValue, newProps[propName])) {
      changes.push(`update prop "${propName}"`);
    }
  }

  for (const propName of Object.keys(newProps)) {
    if (shouldIgnoreProp(propName)) {
      continue;
    }

    if (!(propName in oldProps)) {
      changes.push(`add prop "${propName}"`);
    }
  }

  return changes;
}

// diffTrees는 이전 VDOM과 새 VDOM을 비교해서
// "어디가 달라졌는지" 읽기 쉬운 목록으로 돌려줍니다.
//
// 이 함수는 patch 자체를 하지는 않고,
// 변경 내용을 사람이 이해하기 쉽게 설명하는 역할에 가깝습니다.
export function diffTrees(oldVNode, newVNode, path = "root") {
  const changes = [];

  if (!oldVNode && newVNode) {
    changes.push(`[${path}] add ${describeNode(newVNode)}`);
    return changes;
  }

  if (oldVNode && !newVNode) {
    changes.push(`[${path}] remove ${describeNode(oldVNode)}`);
    return changes;
  }

  if (shouldReplaceNode(oldVNode, newVNode)) {
    changes.push(
      `[${path}] replace ${describeNode(oldVNode)} -> ${describeNode(newVNode)}`
    );
    return changes;
  }

  if (oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
    return changes;
  }

  const propChanges = collectPropChanges(oldVNode.props, newVNode.props);
  for (const propChange of propChanges) {
    changes.push(`[${path}] ${propChange}`);
  }

  const childCount = Math.max(
    oldVNode.children?.length ?? 0,
    newVNode.children?.length ?? 0
  );

  for (let index = 0; index < childCount; index += 1) {
    changes.push(
      ...diffTrees(
        oldVNode.children?.[index],
        newVNode.children?.[index],
        `${path}.${index}`
      )
    );
  }

  return changes;
}
