import { useState } from "../hooks/useState.js";
import { h } from "../vdom/h.js";

// 이 데모는 diff / patch가 어떤 상황에서 쓰이는지 보여줍니다.
//
// 버튼을 누를 때마다 전체 카드 목록을 다시 만드는 대신,
// 바뀐 카드의 text/props/children만 실제 DOM에 반영하게 됩니다.
export function PatchDemo() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [showLastCard, setShowLastCard] = useState(true);
  const [titleMode, setTitleMode] = useState("normal");

  const cards = [
    { id: "card-1", label: "협업형", tone: "warm" },
    {
      id: "card-2",
      label: titleMode === "normal" ? "분석형" : "분석형 업그레이드",
      tone: "cool",
    },
    { id: "card-3", label: "탐험형", tone: "green" },
  ];

  const visibleCards = showLastCard ? cards : cards.slice(0, 2);

  return h(
    "section",
    { className: "patch-card" },
    h("span", { className: "demo-badge" }, "STEP 8-9"),
    h("h2", null, "Diff + Patch"),
    h(
      "p",
      { className: "demo-copy" },
      "버튼을 눌러 text, class, children 개수를 바꿔보세요. 아래 변경 보고서에는 diff가 찾은 차이가 표시되고, 실제 DOM은 필요한 부분만 patch됩니다."
    ),
    h(
      "div",
      { className: "counter-actions" },
      h(
        "button",
        {
          className: "counter-button primary",
          onClick: () =>
            setSelectedIndex((previousIndex) => (previousIndex + 1) % visibleCards.length),
        },
        "선택 카드 변경"
      ),
      h(
        "button",
        {
          className: "counter-button",
          onClick: () =>
            setTitleMode((previousMode) =>
              previousMode === "normal" ? "upgrade" : "normal"
            ),
        },
        "두 번째 카드 텍스트 변경"
      ),
      h(
        "button",
        {
          className: "counter-button",
          onClick: () => setShowLastCard((previousValue) => !previousValue),
        },
        "마지막 카드 추가/제거"
      )
    ),
    h(
      "div",
      { className: "patch-grid" },
      visibleCards.map((card, index) =>
        h(
          "article",
          {
            className:
              index === selectedIndex
                ? `patch-item patch-item-active patch-item-${card.tone}`
                : `patch-item patch-item-${card.tone}`,
          },
          h("span", { className: "patch-item-index" }, `CARD ${index + 1}`),
          h("strong", { className: "patch-item-title" }, card.label),
          h(
            "p",
            { className: "demo-copy" },
            index === selectedIndex ? "지금 선택된 카드입니다." : "현재 비선택 카드입니다."
          )
        )
      )
    )
  );
}
