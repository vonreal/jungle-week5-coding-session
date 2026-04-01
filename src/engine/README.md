# Engine README

## 역할

이 폴더는 성향테스트 페이지를 실제로 움직이는 mini React 엔진입니다.

구현 범위:

- `FunctionComponent`
- `hooks 배열`
- `mount()`
- `update()`
- `useState`
- `useEffect`
- `useMemo`
- `Virtual DOM 생성`
- `diff`
- `patch`

현재 실제 앱은 [src/app/bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)에서 이 엔진을 사용합니다.

## 폴더 구조

- `core/`
  - 컴포넌트 실행 흐름과 hook runtime
- `hooks/`
  - `useState`, `useEffect`, `useMemo`
- `vdom/`
  - VDOM 노드 생성
- `render/`
  - 실제 DOM 생성, diff, patch
- `shared/`
  - 엔진 공통 계약

## 실제 앱에서 쓰는 엔진 함수

앱에서 직접 연결되는 핵심 함수는 아래입니다.

1. [mountRoot.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/mountRoot.js)
2. [useState.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useState.js)
3. [useMemo.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useMemo.js)
4. [h.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/vdom/h.js)

앱 내부 연결 위치:

- [bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)
  - `mountRoot`
  - `useState`
  - `useMemo`
- [pages.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/components/pages.js)
  - `h`

## 첫 화면이 뜨는 흐름

아래는 `정글 성향 테스트` 시작 화면이 처음 뜰 때까지의 과정을,  
함수와 변수 이름 기준으로 아주 자세히 적은 흐름입니다.

### 1. 브라우저가 HTML을 읽음

[index.html](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/index.html) 안에는 이 DOM이 있습니다.

```html
<div id="app"></div>
```

이 `#app`가 나중에 앱이 붙을 실제 자리입니다.

이 시점에 중요한 값:

- 실제 DOM 요소: `#app`
- 아직 엔진 객체는 없음
- 아직 `App()`도 실행 안 됨

### 2. src/main.js 실행

[src/main.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/main.js)

```js
import { mountApp } from "./app/bootstrap.js";

mountApp();
```

여기서 실행되는 함수:

- `mountApp()`

### 3. mountApp() 안에서 root 변수 생성

[src/app/bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)

```js
export function mountApp() {
  const root = document.querySelector("#app");
  mountRoot(App, root);
}
```

이 시점에 생기는 변수:

- `root`
  - 값: `document.querySelector("#app")`
  - 의미: 실제 DOM을 붙일 위치

이 시점의 호출:

- `mountRoot(App, root)`

즉 여기서 넘겨주는 값은:

- `componentFn = App`
- `container = root`
- `props = {}`

### 4. mountRoot() 안에서 rootComponent 생성

[mountRoot.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/mountRoot.js)

```js
export function mountRoot(componentFn, container, props = {}) {
  const rootComponent = new FunctionComponent(componentFn, props, container);
  rootComponent.mount();
  return rootComponent;
}
```

이 시점에 생기는 변수:

- `componentFn`
  - 값: `App`
  - 의미: 나중에 실행할 루트 함수형 컴포넌트

- `container`
  - 값: `root`
  - 의미: 실제 DOM을 붙일 위치

- `props`
  - 값: `{}`
  - 의미: 루트 컴포넌트에 줄 입력값

- `rootComponent`
  - 값: `new FunctionComponent(App, {}, root)`
  - 의미: App을 관리하는 엔진 객체

### 5. FunctionComponent constructor 실행

[FunctionComponent.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/FunctionComponent.js)

```js
constructor(componentFn, props = {}, container) {
  this.componentFn = componentFn;
  this.props = props;
  this.container = container;
  this.hooks = [];
  this.hookIndex = 0;
  this.currentTree = null;
  this.pendingEffects = [];
}
```

이 시점에 `rootComponent` 안에 저장되는 값:

- `this.componentFn`
  - 값: `App`
  - 의미: 실행할 함수

- `this.props`
  - 값: `{}`
  - 의미: 컴포넌트 입력값

- `this.container`
  - 값: `root`
  - 의미: 실제 DOM 자리

- `this.hooks`
  - 값: `[]`
  - 의미: hook 값 저장소

- `this.hookIndex`
  - 값: `0`
  - 의미: 이번 렌더에서 몇 번째 hook인지 세는 번호

- `this.currentTree`
  - 값: `null`
  - 의미: 아직 렌더된 VDOM 없음

- `this.pendingEffects`
  - 값: `[]`
  - 의미: 렌더 후 실행할 effect 목록

즉 constructor가 끝난 직후 `rootComponent`는 대충 이런 상태입니다.

```js
{
  componentFn: App,
  props: {},
  container: root,
  hooks: [],
  hookIndex: 0,
  currentTree: null,
  pendingEffects: []
}
```

### 6. rootComponent.mount() 실행

`mountRoot()`는 바로 아래 줄에서:

```js
rootComponent.mount();
```

를 실행합니다.

`mount()`의 코드:

```js
mount() {
  const tree = this.performRender();
  render(tree, this.container);
  this.currentTree = tree;
  this.runEffects();
}
```

여기서 생기는 변수:

- `tree`
  - 값: `this.performRender()`가 돌려준 VDOM 트리
  - 의미: 지금 화면의 설계도

### 7. performRender() 안에서 렌더 준비

`performRender()`는 이 순서로 움직입니다.

```js
performRender() {
  this.prepareToRender();

  try {
    this.currentTree = this.componentFn(this.props);
    return this.currentTree;
  } finally {
    this.finishRender();
  }
}
```

먼저 `prepareToRender()` 실행:

```js
prepareToRender() {
  this.hookIndex = 0;
  this.pendingEffects = [];
  setCurrentComponent(this);
}
```

이 시점에 바뀌는 값:

- `this.hookIndex = 0`
  - 이유: 이번 렌더에서 hook 순서를 처음부터 다시 세야 해서

- `this.pendingEffects = []`
  - 이유: 이번 렌더에서 등록할 effect만 다시 모으기 위해서

- `currentComponent = this`
  - `setCurrentComponent(this)`가 runtime 전역 변수에 저장
  - 의미: 지금 렌더 중인 컴포넌트는 `rootComponent`

### 8. App() 실제 실행

이제 `try` 안에서:

```js
this.currentTree = this.componentFn(this.props);
```

가 실행됩니다.

여기서 실제 값 대입은:

```js
this.currentTree = App({});
```

와 같은 뜻입니다.

즉, 이 시점에 `App()`이 처음 실행됩니다.

### 9. App() 안에서 appState 생성

[src/app/bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)의 `App()` 첫 부분:

```js
const [appState, setAppState] = useState({
  screen: "start",
  nickname: "",
  currentIndex: 0,
  answers: [],
});
```

이 시점에 useState가 하는 일:

- `component = getCurrentComponent()`
  - 값: `rootComponent`

- `currentIndex = component.hookIndex`
  - 값: `0`

- `component.hooks[0]`
  - 처음 렌더라 비어 있으므로 초기값 저장

그래서 hooks 배열은 이렇게 됩니다.

```js
rootComponent.hooks = [
  {
    screen: "start",
    nickname: "",
    currentIndex: 0,
    answers: []
  }
]
```

그리고 반환값:

- `appState`
  - 값: hooks[0] 안의 state 객체

- `setAppState`
  - 값: hooks[0]을 나중에 바꾸는 함수

그리고 마지막에:

- `component.hookIndex += 1`

그래서 이제:

```js
rootComponent.hookIndex === 1
```

### 10. App() 안에서 calculated 생성

다음 부분:

```js
const calculated = useMemo(() => {
  return evaluateQuizResult({
    questions: quizQuestions,
    answers: appState.answers,
    axes: quizConfig.axes,
    results: quizResults,
  });
}, [appState.answers]);
```

이 시점:

- `currentIndex = rootComponent.hookIndex`
  - 값: `1`

- `component.hooks[1]`
  - 처음 렌더라서 아직 없음

그래서 `factory()` 실행:

```js
evaluateQuizResult(...)
```

여기서 나오는 값:

- `scores`
- `directions`
- `result`

그리고 hooks 배열 1번 칸에 저장:

```js
rootComponent.hooks[1] = {
  type: "memo",
  dependencies: [appState.answers],
  value: {
    scores: ...,
    directions: ...,
    result: ...
  }
}
```

반환값:

- `calculated`
  - 값: memo에 저장된 `value`

그리고:

```js
rootComponent.hookIndex === 2
```

### 11. App() 안에서 startConfig 생성

다음 부분:

```js
const startConfig = {
  ...quizConfig,
  subtitle: quizConfig.subtitle || "정글 성향 테스트",
  ctaLabel: quizConfig.ctaLabel || "나는 어떤 정글 동물일까?",
};
```

이건 일반 지역 변수입니다.

값:

- `startConfig.title`
- `startConfig.description`
- `startConfig.subtitle`
- `startConfig.ctaLabel`
- `startConfig.axes`
- `startConfig.totalQuestions`

### 12. App() 안에서 이벤트 함수들 생성

이제 `App()` 안에서 이런 함수들이 만들어집니다.

- `handleStart`
- `handleNicknameInput`
- `handleNicknameSubmit`
- `handleChoiceSelect`
- `handleRestart`

이 함수들은 지금 바로 실행되는 게 아니라,  
나중에 버튼 클릭이나 입력 이벤트가 생겼을 때 실행됩니다.

### 13. 첫 화면 분기 선택

처음 렌더에서는:

```js
appState.screen === "start"
```

이므로 아래 분기로 들어갑니다.

```js
return StartPage({
  config: startConfig,
  onStart: handleStart,
});
```

즉 `App()`이 반환하는 값은:

- `StartPage(...)`가 만든 VDOM

### 14. StartPage() 안에서 실제 시작 화면 VDOM 생성

[pages.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/components/pages.js)의 `StartPage()`는 내부에서:

- `HeaderLogo()`
- `PrimaryButton(...)`
- `AppShell(...)`

를 사용합니다.

그리고 결국 모두 [h.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/vdom/h.js)의 `h()`로 VDOM 객체를 만듭니다.

즉 이 단계에서 만들어지는 값:

- `type`
- `props`
- `children`

형태의 객체 트리

이게 바로 `tree`입니다.

### 15. performRender() 종료

`try` 안에서:

```js
this.currentTree = this.componentFn(this.props);
return this.currentTree;
```

가 끝나면:

- `this.currentTree`
  - 값: StartPage 기반 VDOM 트리

- `return this.currentTree`
  - 값: `tree`

그리고 `finally`에서:

```js
this.finishRender();
```

실행

### 16. finishRender() 실행

`finishRender()`는:

```js
clearCurrentComponent();
```

를 호출합니다.

이 시점:

- `currentComponent = null`

왜냐하면 렌더가 끝났으니
“지금 렌더 중인 컴포넌트” 표시를 지워야 하기 때문입니다.

### 17. render(tree, this.container) 실행

다시 `mount()`로 돌아오면:

```js
render(tree, this.container);
```

실행

현재 값:

- `tree`
  - StartPage VDOM 트리

- `this.container`
  - 실제 DOM 요소 `#app`

첫 렌더이므로 `render()` 안에서는:

1. `container.innerHTML = ""`
2. `createElement(tree)`
3. `container.appendChild(...)`

### 18. createElement()가 실제 DOM 생성

`createElement(vNode)`는 VDOM 한 개를 실제 DOM 한 개로 바꿉니다.

즉:

- `main`
- `section`
- `div.logo`
- `h1`
- `p`
- `button`

같은 실제 DOM 요소들이 순서대로 생성됩니다.

이제 브라우저 화면에 보이는:

- `JUNGLE TEST`
- `정글 성향 테스트`
- `당신은 정글에서 어떤 동물입니까?`
- 버튼

이 실제 DOM으로 붙습니다.

### 19. currentTree 저장

다시 `mount()`에서:

```js
this.currentTree = tree;
```

실행

이제 `rootComponent.currentTree`에는
“현재 화면의 VDOM 트리”가 저장되어 있습니다.

이 값은 나중에 `update()`에서 이전 트리로 사용됩니다.

### 20. runEffects() 실행

마지막으로:

```js
this.runEffects();
```

실행

첫 화면에서는 `useEffect`를 아직 안 쓰고 있으므로:

- `this.pendingEffects = []`
- 실행할 effect 없음

그래서 여기서는 실제로 아무 일도 거의 안 일어납니다.

## 첫 화면 직후 메모리 상태 요약

첫 화면이 뜬 직후 중요한 값은 대충 이렇습니다.

### root 변수

```js
root = document.querySelector("#app")
```

### rootComponent 내부 상태

```js
rootComponent.componentFn = App
rootComponent.props = {}
rootComponent.container = root
rootComponent.hooks = [
  {
    screen: "start",
    nickname: "",
    currentIndex: 0,
    answers: []
  },
  {
    type: "memo",
    dependencies: [[]],
    value: {
      scores: ...,
      directions: ...,
      result: ...
    }
  }
]
rootComponent.hookIndex = 2
rootComponent.currentTree = StartPage VDOM 트리
rootComponent.pendingEffects = []
```

### runtime 전역 상태

```js
currentComponent = null
```

## 첫 화면 한 줄 흐름

정말 짧게만 적으면 아래 순서입니다.

1. `mountApp()`
2. `const root = document.querySelector("#app")`
3. `mountRoot(App, root)`
4. `const rootComponent = new FunctionComponent(App, {}, root)`
5. `rootComponent.mount()`
6. `performRender()`
7. `prepareToRender()`
8. `setCurrentComponent(rootComponent)`
9. `App()`
10. `useState()` -> hooks[0] 저장
11. `useMemo()` -> hooks[1] 저장
12. `StartPage()` -> VDOM 반환
13. `finishRender()`
14. `render(tree, root)`
15. `createElement(tree)`
16. 실제 DOM이 `#app`에 붙음
17. `currentTree` 저장
18. `runEffects()`

## 다음 단계

첫 화면 다음에는 버튼 클릭으로 `handleStart()`가 실행되고,  
그때부터는 `setAppState -> update -> diff -> patch` 흐름으로 닉네임 화면, 질문 화면, 결과 화면까지 이동합니다.
