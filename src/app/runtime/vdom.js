export function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: children.flat().filter((child) => child !== null && child !== undefined && child !== false),
  };
}

function resolveVNode(vnode) {
  if (vnode === null || vnode === undefined || vnode === false) return null;
  if (typeof vnode === "string" || typeof vnode === "number") return vnode;

  if (typeof vnode.type === "function") {
    const rendered = vnode.type({
      ...(vnode.props || {}),
      children: vnode.children || [],
    });
    return resolveVNode(rendered);
  }

  return {
    type: vnode.type,
    props: vnode.props || {},
    children: (vnode.children || []).map(resolveVNode).filter((child) => child !== null),
  };
}

function createDomNode(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  const element = document.createElement(vnode.type);
  const props = vnode.props || {};

  Object.keys(props).forEach((key) => {
    const value = props[key];

    if (key.startsWith("on") && typeof value === "function") {
      element[key.toLowerCase()] = value;
      return;
    }

    if (key === "className") {
      element.setAttribute("class", value);
      return;
    }

    if (key === "value") {
      element.value = value;
      return;
    }

    if (value === true) {
      element.setAttribute(key, "");
      return;
    }

    if (value !== false && value !== null && value !== undefined) {
      element.setAttribute(key, String(value));
    }
  });

  vnode.children.forEach((child) => {
    element.appendChild(createDomNode(child));
  });

  return element;
}

function nodeChanged(newVNode, oldVNode) {
  return (
    typeof newVNode !== typeof oldVNode ||
    ((typeof newVNode === "string" || typeof newVNode === "number") && newVNode !== oldVNode) ||
    newVNode?.type !== oldVNode?.type
  );
}

function updateProps(target, newProps, oldProps) {
  const keys = new Set([...Object.keys(newProps || {}), ...Object.keys(oldProps || {})]);

  keys.forEach((key) => {
    const newValue = newProps?.[key];
    const oldValue = oldProps?.[key];

    if (newValue === oldValue) return;

    if (key.startsWith("on")) {
      target[key.toLowerCase()] = typeof newValue === "function" ? newValue : null;
      return;
    }

    if (key === "className") {
      if (newValue === null || newValue === undefined || newValue === false) {
        target.removeAttribute("class");
      } else {
        target.setAttribute("class", newValue);
      }
      return;
    }

    if (key === "value") {
      target.value = newValue ?? "";
      return;
    }

    if (newValue === null || newValue === undefined || newValue === false) {
      target.removeAttribute(key);
      return;
    }

    if (newValue === true) {
      target.setAttribute(key, "");
      return;
    }

    target.setAttribute(key, String(newValue));
  });
}

function patch(parent, newVNode, oldVNode, index = 0) {
  const currentNode = parent.childNodes[index];

  if (!oldVNode) {
    parent.appendChild(createDomNode(newVNode));
    return;
  }

  if (!newVNode) {
    if (currentNode) parent.removeChild(currentNode);
    return;
  }

  if (nodeChanged(newVNode, oldVNode)) {
    parent.replaceChild(createDomNode(newVNode), currentNode);
    return;
  }

  if (typeof newVNode === "string" || typeof newVNode === "number") {
    return;
  }

  updateProps(currentNode, newVNode.props || {}, oldVNode.props || {});

  const maxLength = Math.max(newVNode.children.length, oldVNode.children.length);
  for (let i = 0; i < maxLength; i += 1) {
    patch(currentNode, newVNode.children[i], oldVNode.children[i], i);
  }
}

export function createRenderer(rootElement) {
  let previousVNode = null;

  return {
    render(nextVNode) {
      const resolvedNextVNode = resolveVNode(nextVNode);

      if (!previousVNode) {
        rootElement.innerHTML = "";
        rootElement.appendChild(createDomNode(resolvedNextVNode));
      } else {
        patch(rootElement, resolvedNextVNode, previousVNode, 0);
      }
      previousVNode = resolvedNextVNode;
    },
  };
}
