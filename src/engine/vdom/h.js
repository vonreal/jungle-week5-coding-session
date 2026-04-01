export const TEXT_NODE = "TEXT_NODE";

export function createTextNode(value) {
  return {
    type: TEXT_NODE,
    props: {
      nodeValue: String(value),
    },
    children: [],
  };
}

function normalizeChild(child) {
  if (child === null || child === undefined || child === false || child === true) {
    return null;
  }

  if (Array.isArray(child)) {
    return child.flatMap(normalizeChild).filter(Boolean);
  }

  if (typeof child === "object") {
    return child;
  }

  return createTextNode(child);
}

export function h(type, props = {}, ...children) {
  return {
    type,
    props: { ...props },
    children: children.flatMap(normalizeChild).filter(Boolean),
  };
}
