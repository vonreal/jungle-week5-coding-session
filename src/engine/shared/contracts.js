export const VDOM_NODE_SHAPE = {
  type: "string | function",
  props: "object",
  children: "array",
  textNodeType: "TEXT_NODE",
};

export const APP_RUNTIME_CONTRACT = {
  rootComponentOnlyHooks: true,
  rootComponentOnlyState: true,
  statelessChildren: true,
  eventProps: ["onClick", "onInput", "onChange", "onSubmit"],
  vdomFactory: "h(type, props, ...children)",
};
