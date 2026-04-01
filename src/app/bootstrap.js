import { APP_RUNTIME_CONTRACT } from "../engine/shared/contracts.js";

export function mountApp() {
  const root = document.querySelector("#app");

  root.innerHTML = `
    <main style="font-family: sans-serif; padding: 24px;">
      <h1>Mini React Personality Test</h1>
      <p>기초 폴더 구조가 준비되었습니다.</p>
      <p>현재 단계에서는 엔진팀과 페이지팀이 이 구조를 기준으로 병렬 작업을 시작하면 됩니다.</p>
      <pre>${JSON.stringify(APP_RUNTIME_CONTRACT, null, 2)}</pre>
    </main>
  `;
}
