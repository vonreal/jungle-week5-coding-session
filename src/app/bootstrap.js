export function mountApp() {
  const root = document.querySelector("#app");

  root.innerHTML = `
    <main style="font-family: sans-serif; padding: 24px;">
      <h1>Mini React Personality Test</h1>
      <p>이 페이지는 최종 결과물용 진입점입니다.</p>
      <p>엔진 단계별 테스트는 <code>src/engine/playground/index.html</code>에서 진행합니다.</p>
    </main>
  `;
}
