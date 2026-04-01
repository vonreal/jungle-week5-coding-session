import { APP_RUNTIME_CONTRACT } from "../shared/contracts.js";
import { createStep1VdomDemo } from "./step1-vdom.js";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function mountEnginePlayground() {
  const root = document.querySelector("#engine-playground");
  const demo = createStep1VdomDemo();

  root.innerHTML = `
    <main class="page-shell">
      <div class="page-container">
        <section class="hero">
          <span class="eyebrow">ENGINE PLAYGROUND</span>
          <h1>Step 1. VDOM Node Shape</h1>
          <p>
            실제 결과물 페이지와 분리된 엔진 검증 화면입니다. 이번 단계에서는
            Virtual DOM 노드 구조를 먼저 고정합니다.
          </p>
        </section>

        <section class="grid">
          <article class="panel">
            <h2>Visual Preview</h2>
            <div id="step1-preview"></div>
          </article>

          <article class="panel">
            <h2>Tree Outline</h2>
            <pre class="mono-block">${escapeHtml(demo.treeLines)}</pre>
          </article>

          <article class="panel">
            <h2>Raw VDOM JSON</h2>
            <pre class="mono-block">${escapeHtml(demo.treeJson)}</pre>
          </article>

          <article class="panel">
            <h2>Runtime Contract</h2>
            <pre class="mono-block">${escapeHtml(JSON.stringify(APP_RUNTIME_CONTRACT, null, 2))}</pre>
          </article>

          <article class="panel">
            <h2>What We Locked In</h2>
            <ul class="contract-list">
              <li>모든 노드는 <code>type</code>, <code>props</code>, <code>children</code> 형태를 가진다.</li>
              <li>문자열과 숫자는 자동으로 <code>TEXT_NODE</code>로 정규화된다.</li>
              <li>중첩 배열 자식은 평탄화되고, <code>null/undefined/boolean</code> 값은 제거된다.</li>
              <li>다음 단계부터 이 구조를 기준으로 실제 DOM 렌더러를 붙일 수 있다.</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  `;

  const previewRoot = document.querySelector("#step1-preview");
  previewRoot.innerHTML = `
    <section class="demo-card">
      <span class="demo-badge">STEP 1</span>
      <h3>VDOM node shape</h3>
      <p class="demo-copy">이 카드는 방금 생성한 VDOM tree를 사람이 읽기 쉬운 형태로 옮겨서 보여주는 미리보기입니다.</p>
      <ul class="demo-list">
        <li>type: 태그 이름 또는 컴포넌트</li>
        <li>props: 속성과 이벤트를 담는 객체</li>
        <li>children: 또 다른 VDOM 노드 배열</li>
      </ul>
    </section>
  `;
}

mountEnginePlayground();
