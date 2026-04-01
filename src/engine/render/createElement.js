import { TEXT_NODE } from "../vdom/h.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const SVG_TAGS = new Set([
  "svg",
  "g",
  "path",
  "circle",
  "ellipse",
  "line",
  "polygon",
  "polyline",
  "rect",
  "text",
  "tspan",
]);

// onClick, onInput 같은 이름인지 확인하는 도우미입니다.
function isEventProp(name) {
  return name.startsWith("on");
}

// style이 객체인지 확인합니다.
function isStyleObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// style 객체 안의 값을 실제 DOM style에 하나씩 넣어줍니다.
function applyStyleObject(element, previousStyle = {}, nextStyle = {}) {
  // 예전에는 있었는데 새 style에는 없는 값은 지워줍니다.
  for (const styleName of Object.keys(previousStyle)) {
    if (!(styleName in nextStyle)) {
      element.style[styleName] = "";
    }
  }

  // 새 style 값은 덮어씁니다.
  for (const [styleName, styleValue] of Object.entries(nextStyle)) {
    element.style[styleName] = styleValue;
  }
}

function isSvgElement(element) {
  return element?.namespaceURI === SVG_NAMESPACE;
}

// prop 하나를 실제 DOM에 적용합니다.
function setProp(element, propName, propValue) {
  if (propName === "nodeValue" || propName === "key") {
    return;
  }

  if (isEventProp(propName) && typeof propValue === "function") {
    const eventName = propName.slice(2).toLowerCase();
    element.addEventListener(eventName, propValue);
    return;
  }

  if (propName === "className") {
    if (isSvgElement(element)) {
      element.setAttribute("class", propValue ?? "");
    } else {
      element.className = propValue ?? "";
    }
    return;
  }

  if (propName === "style" && isStyleObject(propValue)) {
    applyStyleObject(element, {}, propValue);
    return;
  }

  if (!isSvgElement(element) && propName in element) {
    element[propName] = propValue;
    return;
  }

  if (propValue !== undefined && propValue !== null) {
    element.setAttribute(propName, propValue);
  }
}

// prop 하나를 실제 DOM에서 제거합니다.
function removeProp(element, propName, propValue) {
  if (propName === "nodeValue" || propName === "key") {
    return;
  }

  if (isEventProp(propName) && typeof propValue === "function") {
    const eventName = propName.slice(2).toLowerCase();
    element.removeEventListener(eventName, propValue);
    return;
  }

  if (propName === "className") {
    if (isSvgElement(element)) {
      element.removeAttribute("class");
    } else {
      element.className = "";
    }
    return;
  }

  if (propName === "style" && isStyleObject(propValue)) {
    applyStyleObject(element, propValue, {});
    return;
  }

  if (!isSvgElement(element) && propName in element) {
    if (typeof element[propName] === "boolean") {
      element[propName] = false;
    } else {
      element[propName] = "";
    }
    return;
  }

  element.removeAttribute(propName);
}

// old props와 new props를 비교해서
// 실제 DOM에 필요한 변경만 반영합니다.
export function updateDomProps(element, oldProps = {}, newProps = {}) {
  for (const [propName, oldValue] of Object.entries(oldProps)) {
    const newValue = newProps[propName];

    if (!(propName in newProps)) {
      removeProp(element, propName, oldValue);
      continue;
    }

    // style은 객체끼리 비교해서 세밀하게 반영합니다.
    if (propName === "style" && isStyleObject(oldValue) && isStyleObject(newValue)) {
      applyStyleObject(element, oldValue, newValue);
      continue;
    }

    if (!Object.is(oldValue, newValue)) {
      removeProp(element, propName, oldValue);
      setProp(element, propName, newValue);
    }
  }

  for (const [propName, newValue] of Object.entries(newProps)) {
    if (!(propName in oldProps)) {
      setProp(element, propName, newValue);
    }
  }
}

// createElement는 "가상 DOM 한 개"를 "실제 DOM 한 개"로 바꾸는 함수입니다.
//
// 동작 흐름:
// 1. TEXT_NODE인지 확인
// 2. 일반 태그면 실제 DOM 요소 생성
// 3. props를 실제 DOM에 반영
// 4. children도 같은 함수로 다시 처리
export function createElement(vNode) {
  return createElementWithNamespace(vNode, false);
}

function createElementWithNamespace(vNode, inSvgNamespace) {
  if (vNode.type === TEXT_NODE) {
    return document.createTextNode(vNode.props.nodeValue);
  }

  const shouldUseSvgNamespace = inSvgNamespace || SVG_TAGS.has(vNode.type);
  const element = shouldUseSvgNamespace
    ? document.createElementNS(SVG_NAMESPACE, vNode.type)
    : document.createElement(vNode.type);

  updateDomProps(element, {}, vNode.props || {});

  for (const child of vNode.children || []) {
    element.appendChild(createElementWithNamespace(child, shouldUseSvgNamespace));
  }

  return element;
}
