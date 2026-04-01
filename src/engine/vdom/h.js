export const TEXT_NODE = "TEXT_NODE";

// createTextNode는 "문자열이나 숫자"를
// 우리가 다루기 쉬운 VDOM 노드 모양으로 바꿔주는 함수입니다.
//
// 예:
// "안녕" -> { type: "TEXT_NODE", props: { nodeValue: "안녕" }, children: [] }
export function createTextNode(value) {
  return {
    type: TEXT_NODE,
    props: {
      // 실제 글자는 nodeValue 안에 보관합니다.
      nodeValue: String(value),
    },
    children: [],
  };
}

// normalizeChild는 children 안으로 들어온 값을
// "렌더 가능한 VDOM 형태"로 정리하는 역할을 합니다.
//
// children에는 여러 가지가 들어올 수 있습니다.
// - 문자열
// - 숫자
// - 이미 만든 VDOM 객체
// - 배열
// - null, undefined, boolean
//
// 그래서 먼저 한 번 정리해줘야 다음 단계가 편해집니다.
function normalizeChild(child) {
  // 화면에 그릴 필요가 없는 값은 제거합니다.
  if (child === null || child === undefined || child === false || child === true) {
    return null;
  }

  // 배열이라면 안쪽까지 펼쳐서 같은 규칙으로 다시 정리합니다.
  if (Array.isArray(child)) {
    return child.flatMap(normalizeChild).filter(Boolean);
  }

  // 이미 객체 형태의 VDOM이라면 그대로 사용합니다.
  if (typeof child === "object") {
    return child;
  }

  // 문자열이나 숫자는 TEXT_NODE로 감싸서 통일합니다.
  return createTextNode(child);
}

// h 함수는 "가상 DOM 노드를 만드는 공장"입니다.
//
// 예:
// h("button", { className: "start-button" }, "시작하기")
//
// 이 코드는 아래 뜻입니다.
// - type: "button"
// - props: { className: "start-button" }
// - children: ["시작하기"]
export function h(type, props = {}, ...children) {
  return {
    type,
    // props가 없더라도 항상 객체 형태로 맞춰줍니다.
    props: { ...props },
    // children을 정리해서 항상 "깨끗한 배열"로 보관합니다.
    children: children.flatMap(normalizeChild).filter(Boolean),
  };
}
