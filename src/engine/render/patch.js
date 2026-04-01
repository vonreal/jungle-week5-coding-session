import { TEXT_NODE } from "../vdom/h.js";
import { createElement, updateDomProps } from "./createElement.js";

function shouldReplaceNode(oldVNode, newVNode) {
  if (!oldVNode || !newVNode) {
    return false;
  }

  if (oldVNode.type !== newVNode.type) {
    return true;
  }

  return oldVNode.type === TEXT_NODE && oldVNode.props.nodeValue !== newVNode.props.nodeValue;
}

// patch는 "이전 VDOM과 새 VDOM의 차이"를 실제 DOM에 반영하는 함수입니다.
//
// 핵심 아이디어:
// - 새로 생긴 노드는 추가
// - 사라진 노드는 제거
// - 타입이 다르면 교체
// - 같은 타입이면 props와 children만 업데이트
//
// 이렇게 하면 전체를 다시 그리지 않고 바뀐 부분만 수정할 수 있습니다.
export function patch(parentElement, oldVNode, newVNode, index = 0) {
  const currentDomNode = parentElement.childNodes[index];

  if (!oldVNode && newVNode) {
    parentElement.appendChild(createElement(newVNode));
    return;
  }

  if (oldVNode && !newVNode) {
    currentDomNode?.remove();
    return;
  }

  if (shouldReplaceNode(oldVNode, newVNode)) {
    parentElement.replaceChild(createElement(newVNode), currentDomNode);
    return;
  }

  // 텍스트 노드는 type과 nodeValue가 같으면 더 건드릴 것이 없습니다.
  if (newVNode.type === TEXT_NODE) {
    return;
  }

  updateDomProps(currentDomNode, oldVNode.props || {}, newVNode.props || {});

  const oldChildrenLength = oldVNode.children?.length ?? 0;
  const newChildrenLength = newVNode.children?.length ?? 0;
  const childCount = Math.max(oldChildrenLength, newChildrenLength);

  for (let childIndex = childCount - 1; childIndex >= 0; childIndex -= 1) {
    patch(
      currentDomNode,
      oldVNode.children?.[childIndex],
      newVNode.children?.[childIndex],
      childIndex
    );
  }
}
