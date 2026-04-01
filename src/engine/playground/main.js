import { APP_RUNTIME_CONTRACT } from "../shared/contracts.js";
import { mountRoot } from "../core/mountRoot.js";
import { render } from "../render/render.js";
import { EffectDemo } from "./step6-effect.js";
import { CounterDemo } from "./step3-counter.js";
import { MemoDemo } from "./step7-memo.js";
import { PatchDemo } from "./step8-patch.js";
import { createStep1VdomDemo } from "./step1-vdom.js";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// playground 시작 함수입니다.
// 여기서 하는 일은 두 가지입니다.
// 1. 설명 패널과 디버깅 정보 표시
// 2. Step 1에서 만든 VDOM을 Step 2 render로 실제 DOM에 붙이기
function mountEnginePlayground() {
  const root = document.querySelector("#engine-playground");
  const demo = createStep1VdomDemo();

  root.innerHTML = `
    <main class="page-shell">
      <div class="page-container">
        <section class="hero">
          <span class="eyebrow">ENGINE PLAYGROUND</span>
          <h1>Step 1-2. VDOM to Real DOM</h1>
          <p>
            이 화면은 최종 결과물 페이지와 분리된 엔진 학습용 테스트 화면입니다.
            이번 단계에서는 VDOM 구조를 만든 뒤, 그 구조를 실제 DOM으로 바꾸는 첫 렌더까지 확인합니다.
          </p>
        </section>

        <section class="grid">
          <article class="panel">
            <h2>Step 2 Render Result</h2>
            <p class="panel-copy">
              아래 카드는 문자열 HTML을 직접 넣은 것이 아니라,
              <code>h()</code>로 만든 VDOM을 <code>render()</code>로 실제 DOM에 붙인 결과입니다.
            </p>
            <div id="step2-render-preview"></div>
          </article>

          <article class="panel">
            <h2>Step 3-5 Interactive Counter</h2>
            <p class="panel-copy">
              아래 영역은 <code>FunctionComponent</code>, <code>mount/update</code>,
              <code>useState</code>가 실제로 동작하는 첫 인터랙션 예제입니다.
            </p>
            <div id="step3-counter-preview"></div>
          </article>

          <article class="panel">
            <h2>Step 6 Effect Demo</h2>
            <p class="panel-copy">
              이 영역은 <code>useEffect</code>가 "렌더 중"이 아니라
              "렌더가 끝난 뒤" 실행된다는 점을 보여줍니다.
            </p>
            <div id="step6-effect-preview"></div>
          </article>

          <article class="panel">
            <h2>Step 7 Memo Demo</h2>
            <p class="panel-copy">
              이 영역은 <code>useMemo</code>가 계산 결과를 기억해뒀다가,
              의존성이 안 바뀌면 다시 계산하지 않는 모습을 보여줍니다.
            </p>
            <div id="step7-memo-preview"></div>
          </article>

          <article class="panel">
            <h2>Step 8-9 Patch Demo</h2>
            <p class="panel-copy">
              이 영역은 <code>diff</code>가 무엇이 바뀌었는지 찾고,
              <code>patch</code>가 실제 DOM의 필요한 부분만 수정하는 과정을 보여줍니다.
            </p>
            <div id="step8-patch-preview"></div>
            <pre id="step8-patch-report" class="mono-block patch-report">아직 변경 없음</pre>
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
              <li>중첩 배열 자식은 평탄화되고, <code>null</code>, <code>undefined</code>, <code>boolean</code> 값은 제거된다.</li>
              <li>이제 <code>createElement()</code>가 이 구조를 실제 DOM 요소로 번역한다.</li>
            </ul>
          </article>

          <article class="panel">
            <h2>Flow Summary</h2>
            <pre class="mono-block">${escapeHtml(
              [
                "1. h()가 VDOM 객체를 만든다",
                "2. render()가 루트 컨테이너를 비운다",
                "3. createElement()가 VDOM 한 개를 실제 DOM 한 개로 바꾼다",
                "4. children도 같은 방식으로 재귀적으로 처리한다",
                "5. 완성된 실제 DOM을 화면에 붙인다",
                "6. setState가 실행되면 update()가 다시 render를 돌린다",
                "7. useEffect는 렌더가 끝난 뒤 별도로 실행된다",
                "8. useMemo는 의존성이 바뀔 때만 계산 결과를 다시 만든다",
                "9. diff는 이전/새 VDOM 차이를 찾고, patch는 실제 DOM 일부만 수정한다",
              ].join("\n")
            )}</pre>
          </article>
        </section>
      </div>
    </main>
  `;

  // Step 2의 핵심 동작:
  // Step 1에서 만든 VDOM 객체를 실제 DOM으로 렌더링합니다.
  const previewRoot = document.querySelector("#step2-render-preview");
  render(demo.tree, previewRoot);

  // Step 3~5의 핵심 동작:
  // 루트 함수형 컴포넌트를 FunctionComponent 클래스로 감싸서 실행합니다.
  // 그 안에서 useState가 hooks 배열에 값을 저장하고,
  // 버튼 클릭 시 setState -> update() 흐름이 실행됩니다.
  const counterRoot = document.querySelector("#step3-counter-preview");
  mountRoot(CounterDemo, counterRoot);

  // Step 6에서는 useEffect 예제를 따로 mount해서
  // "렌더 후 실행" 흐름을 눈으로 확인합니다.
  const effectRoot = document.querySelector("#step6-effect-preview");
  mountRoot(EffectDemo, effectRoot);

  // Step 7에서는 계산 결과 캐싱이 어떻게 보이는지 확인합니다.
  const memoRoot = document.querySelector("#step7-memo-preview");
  mountRoot(MemoDemo, memoRoot);

  const patchRoot = document.querySelector("#step8-patch-preview");
  const patchReport = document.querySelector("#step8-patch-report");

  // patch 보고서는 렌더 함수가 보낸 CustomEvent를 읽어서 표시합니다.
  patchRoot.addEventListener("mini-react:patch-report", (event) => {
    const reportLines = [
      `mode: ${event.detail.mode}`,
      "",
      ...event.detail.changes,
    ];

    patchReport.textContent = reportLines.join("\n");
  });

  mountRoot(PatchDemo, patchRoot);
}

mountEnginePlayground();
