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

## 서비스 흐름

아래는 사용자가 페이지를 열고, 질문에 답하고, 결과 화면에 도달할 때까지 실제로 어떤 엔진 함수들이 호출되는지 순서대로 적은 흐름입니다.

### 1. 앱 시작

브라우저가 [index.html](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/index.html)을 열면 [src/main.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/main.js)가 실행됩니다.

흐름:

1. `mountApp()`
2. `mountRoot(App, root)`
3. `new FunctionComponent(App, props, root)`
4. `rootComponent.mount()`

관련 파일:

- [src/main.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/main.js)
- [src/app/bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)
- [src/engine/core/mountRoot.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/mountRoot.js)
- [src/engine/core/FunctionComponent.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/FunctionComponent.js)

### 2. 첫 렌더

`FunctionComponent.mount()` 안에서는 아래 순서로 실행됩니다.

1. `performRender()`
2. `prepareToRender()`
3. `setCurrentComponent(this)`
4. `App()` 실행
5. `finishRender()`
6. `render(tree, container)`
7. `runEffects()`

핵심:

- `App()`이 실행되면서 화면에 필요한 VDOM을 만듭니다.
- 그 VDOM은 `render()`를 통해 실제 DOM으로 붙습니다.

### 3. App 안에서 state 읽기

[src/app/bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)의 `App()`은 아래 state를 `useState()`로 관리합니다.

- `screen`
- `nickname`
- `currentIndex`
- `answers`

`useState()` 흐름:

1. `getCurrentComponent()`
2. `component.hookIndex` 확인
3. `component.hooks[currentIndex]` 사용
4. state 반환
5. `setState` 반환

즉, state는 함수 안이 아니라 `hooks 배열` 안에 저장됩니다.

관련 파일:

- [useState.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useState.js)
- [runtime.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/runtime.js)

### 4. App 안에서 결과 계산

`App()`은 `useMemo()`로 결과 계산을 캐싱합니다.

실제 코드:

- `evaluateQuizResult(...)`

흐름:

1. `useMemo(factory, [appState.answers])`
2. answers가 바뀌면만 `factory()` 다시 실행
3. `evaluateQuizResult()` 호출
4. 내부에서 아래 순서 실행

도메인 계산 순서:

1. `accumulateScores()`
2. `resolveDirections()`
3. `findMatchingResult()`

관련 파일:

- [useMemo.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useMemo.js)
- [quiz-logic.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/domain/quiz-logic.js)

### 5. 화면 VDOM 만들기

`App()`은 현재 `screen` 값에 따라 아래 페이지 함수 중 하나를 호출합니다.

- `StartPage(...)`
- `NicknamePage(...)`
- `QuestionPage(...)`
- `ResultPage(...)`

이 페이지 함수들은 결국 모두 [h.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/vdom/h.js)의 `h()`를 사용해서 VDOM 객체를 만듭니다.

`h()` 흐름:

1. `h(type, props, ...children)`
2. `normalizeChild()`
3. 필요하면 `createTextNode()`
4. `{ type, props, children }` 객체 반환

즉, 현재 앱 화면은 JSX 없이 직접 만든 객체 기반 VDOM입니다.

### 6. 질문 화면에서 선택 버튼을 누르면

질문 화면의 선택 버튼은 [pages.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/components/pages.js)의 `ChoiceButton()` 안에서 만들어집니다.

버튼 클릭 후 실제 흐름:

1. `onClick`
2. `handleChoiceSelect(choice)`
3. `setAppState(...)`
4. `useState()` 내부 `setState`
5. `component.hooks[currentIndex]` 값 변경
6. `FunctionComponent.update()`

### 7. update 후 다시 렌더

`FunctionComponent.update()` 흐름:

1. `previousTree = this.currentTree`
2. `performRender()`
3. `App()` 다시 실행
4. 새 VDOM 생성
5. `render(nextTree, container, previousTree)`
6. `runEffects()`

즉, state 변경 후 앱 전체 함수는 다시 실행되지만,
실제 DOM은 diff/patch를 통해 필요한 부분만 수정됩니다.

### 8. render -> diff -> patch

[render.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/render.js)에서 두 번째 렌더부터는 이전 트리와 새 트리를 같이 받습니다.

흐름:

1. `render(nextVNode, container, previousVNode)`
2. `diffTrees(previousVNode, nextVNode)`
3. `patch(container, previousVNode, nextVNode, 0)`

`patch()`가 하는 일:

- 새 노드면 추가
- 사라진 노드면 제거
- 타입 다르면 교체
- 타입 같으면 `updateDomProps()`
- children은 재귀적으로 계속 patch

관련 파일:

- [render.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/render.js)
- [diff.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/diff.js)
- [patch.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/patch.js)
- [createElement.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/createElement.js)

### 9. 결과 화면까지 가는 실제 흐름

사용자가 마지막 질문까지 답하면 `handleChoiceSelect()` 안에서 `screen`이 `"result"`로 바뀝니다.

그 다음 흐름:

1. `setAppState(...)`
2. `FunctionComponent.update()`
3. `App()` 다시 실행
4. `appState.screen === "result"` 분기 진입
5. `ResultPage(...)` 호출
6. `useMemo()`로 계산된 `calculated.result`, `calculated.directions` 전달
7. `h()`로 결과 화면 VDOM 생성
8. `render()` -> `diffTrees()` -> `patch()`
9. 실제 결과 화면 DOM 갱신

즉, 결과 화면도 별도 페이지 이동이 아니라 state 변경에 따른 재렌더링입니다.

## 따라가기 좋은 순서

처음 읽을 때는 아래 순서가 가장 좋습니다.

1. [src/app/bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)
2. [src/app/components/pages.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/components/pages.js)
3. [src/engine/core/mountRoot.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/mountRoot.js)
4. [src/engine/core/FunctionComponent.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/FunctionComponent.js)
5. [src/engine/hooks/useState.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useState.js)
6. [src/engine/hooks/useMemo.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useMemo.js)
7. [src/engine/vdom/h.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/vdom/h.js)
8. [src/engine/render/render.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/render.js)
9. [src/engine/render/diff.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/diff.js)
10. [src/engine/render/patch.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/patch.js)
11. [src/app/domain/quiz-logic.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/domain/quiz-logic.js)

## 한 줄 요약

현재 성향테스트 페이지는 `App -> hooks(state/memo) -> h()로 VDOM 생성 -> render -> diff -> patch` 흐름으로 결과 화면까지 도달합니다.
