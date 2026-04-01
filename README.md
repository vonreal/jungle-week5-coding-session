# week5_webcoding

## Base Structure

- `src/engine`: mini React 엔진 개발 영역
- `src/engine/playground`: 엔진 학습용 테스트 페이지
- `src/app`: 성향 테스트 페이지 개발 영역
- `src/shared`: 팀 간 계약 문서
- `tests`: 단위/통합 테스트
- `docs`: 작업 순서와 메모

## Run

- 최종 결과물 시작점: `index.html`
- 엔진 단계별 테스트 시작점: `src/engine/playground/index.html`

## Engine Scope

현재 엔진에서 구현된 핵심 기능은 아래와 같습니다.

- `FunctionComponent`
- `hooks 배열`
- `mount()`
- `update()`
- `useState`
- `useEffect`
- `useMemo`
- `Virtual DOM 생성`
- `Diff`
- `Patch`

## Engine Files

학습할 때는 아래 순서대로 보면 흐름이 잘 보입니다.

1. [h.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/vdom/h.js)
2. [createElement.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/createElement.js)
3. [render.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/render.js)
4. [FunctionComponent.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/FunctionComponent.js)
5. [runtime.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/runtime.js)
6. [useState.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useState.js)
7. [useEffect.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useEffect.js)
8. [useMemo.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useMemo.js)
9. [diff.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/diff.js)
10. [patch.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/patch.js)

## Service Flow

아래는 "브라우저에서 테스트 페이지가 열리고, 버튼을 눌렀을 때 화면이 다시 바뀌는 과정"을 함수 이름 기준으로 적은 흐름입니다.

### 1. 테스트 페이지 시작

브라우저가 [src/engine/playground/index.html](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/index.html)을 열면,  
[main.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/main.js)의 `mountEnginePlayground()`가 실행됩니다.

여기서 하는 일:

- 설명 패널 HTML 만들기
- Step 1 VDOM 샘플 만들기
- Step 2 정적 VDOM 렌더링
- Step 3 이후 인터랙션 데모 mount

관련 함수:

- `mountEnginePlayground()`
- `createStep1VdomDemo()`
- `render()`
- `mountRoot()`

### 2. VDOM 생성

[step1-vdom.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step1-vdom.js)의 `createStep1VdomDemo()`가 샘플 VDOM 트리를 만듭니다.

이때 실제로 노드를 만드는 핵심 함수는 [h.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/vdom/h.js)의 `h()`입니다.

흐름:

- `h(type, props, ...children)`
- `normalizeChild()`
- 필요하면 `createTextNode()`

즉, JSX 없이도 우리가 직접 VDOM 객체를 만드는 구조입니다.

### 3. 최초 렌더

[render.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/render.js)의 `render(nextVNode, container)`가 실행됩니다.

첫 렌더에서는 이전 트리가 없기 때문에:

- `createElement()`로 전체 DOM 생성
- `container.appendChild()`로 화면에 붙임

관련 함수:

- `render()`
- `createElement()`
- `updateDomProps()`

### 4. 루트 컴포넌트 시작

인터랙션이 있는 데모는 [mountRoot.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/mountRoot.js)의 `mountRoot()`로 시작합니다.

흐름:

- `new FunctionComponent(componentFn, props, container)`
- `rootComponent.mount()`

즉, 루트 함수형 컴포넌트를 그냥 바로 실행하지 않고,  
`FunctionComponent` 클래스가 감싸서 관리합니다.

### 5. mount 시 어떤 일이 일어나는가

[FunctionComponent.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/core/FunctionComponent.js)의 `mount()` 흐름은 아래와 같습니다.

1. `performRender()`
2. 내부에서 `prepareToRender()`
3. `setCurrentComponent(this)`
4. 실제 컴포넌트 함수 실행
5. VDOM 반환
6. `finishRender()`
7. `render(tree, container)`
8. `runEffects()`

즉, 렌더 전에 "지금 어떤 컴포넌트가 실행 중인지" 등록하고,  
렌더 후에는 실제 DOM 반영과 effect 실행까지 이어집니다.

### 6. useState는 어떻게 동작하는가

[useState.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useState.js)의 `useState(initialValue)` 흐름:

1. `getCurrentComponent()`로 현재 컴포넌트 가져오기
2. `component.hookIndex` 확인
3. `component.hooks[currentIndex]` 칸 사용
4. 첫 렌더면 초기값 저장
5. `[state, setState]` 반환

핵심:

- 상태는 함수 안이 아니라 `component.hooks[]` 배열에 저장됨
- 그래서 함수가 다시 실행돼도 state가 유지됨

### 7. 버튼 클릭 후 무슨 일이 일어나는가

예를 들어 [step3-counter.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step3-counter.js)의 `CounterDemo()`에서 `+1` 버튼을 누르면 아래 흐름이 실행됩니다.

1. `onClick`
2. `setCount((prevCount) => prevCount + 1)`
3. `useState` 내부의 `setState()`
4. `component.hooks[currentIndex]` 값 변경
5. `component.update()`
6. `performRender()`
7. `render(tree, container, previousTree)`
8. `diff / patch`
9. `runEffects()`

즉, 버튼 클릭 하나가 결국 `hooks 배열 수정 -> update -> 새 VDOM 생성 -> 실제 DOM 갱신`으로 이어집니다.

### 8. useEffect는 어디서 실행되는가

[useEffect.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useEffect.js)의 `useEffect(effect, dependencies)`는 effect를 즉시 실행하지 않습니다.

흐름:

- 렌더 중에는 `component.pendingEffects`에 등록만 함
- 렌더가 끝난 뒤 `FunctionComponent.runEffects()`가 실행
- 그 안에서 effect 실행
- 필요하면 cleanup 저장

즉:

- `render 전`: 실행 안 함
- `render 중`: 예약만 함
- `render 후`: 실제 실행

이 구조는 [step6-effect.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step6-effect.js)에서 눈으로 볼 수 있습니다.

### 9. useMemo는 어디에 쓰이는가

[useMemo.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/hooks/useMemo.js)의 `useMemo(factory, dependencies)`는 계산 결과를 저장합니다.

흐름:

1. 이전 dependencies 확인
2. 새 dependencies와 비교
3. 바뀌었으면 `factory()` 다시 실행
4. 안 바뀌었으면 이전 `value` 재사용

이 구조는 [step7-memo.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step7-memo.js)에서 확인할 수 있습니다.

성향테스트에 연결하면 여기에 들어갈 계산 예시는:

- 축별 점수 합산
- positive / negative 판정
- 결과 타입 매칭

### 10. diff / patch는 어떻게 동작하는가

이제 update에서는 이전 트리와 새 트리를 함께 `render()`에 넘깁니다.

관련 파일:

- [render.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/render.js)
- [diff.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/diff.js)
- [patch.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/render/patch.js)

흐름:

1. `render(nextVNode, container, previousVNode)`
2. `diffTrees(previousVNode, nextVNode)`
3. 변경 보고서 생성
4. `patch(container, previousVNode, nextVNode, 0)`
5. 실제 DOM 일부만 수정

`patch()`가 하는 일:

- 새 노드면 추가
- 없어진 노드면 제거
- 타입 다르면 교체
- 타입 같으면 `updateDomProps()`
- children은 재귀적으로 계속 patch

즉, 지금 엔진은:

- `VDOM 표현 방식`: 객체 기반
- `diff 방식`: children 인덱스 기반 비교

입니다.

### 11. patch 보고서는 어디서 보나

[main.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/main.js)에서 patch 데모 영역은 CustomEvent를 받아 보고서를 보여줍니다.

관련 흐름:

- `render()`가 `mini-react:patch-report` 이벤트 발생
- `patchRoot.addEventListener("mini-react:patch-report", ...)`
- `<pre id="step8-patch-report">`에 출력

이 구조는 [step8-patch.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step8-patch.js)와 같이 보면 이해가 쉽습니다.

## One Click Flow

카운터에서 `+1` 버튼을 눌렀을 때 따라가야 하는 함수 이름만 빠르게 적으면 아래 순서입니다.

1. `CounterDemo()`
2. `onClick`
3. `setCount()`
4. `useState()` 내부 `setState`
5. `FunctionComponent.update()`
6. `performRender()`
7. `prepareToRender()`
8. `setCurrentComponent()`
9. `CounterDemo()` 다시 실행
10. `finishRender()`
11. `render(nextVNode, container, previousVNode)`
12. `diffTrees()`
13. `patch()`
14. `runEffects()`

## Playground Mapping

엔진 학습용 테스트 페이지에서 각 영역은 아래 파일과 연결됩니다.

- Step 1-2: [step1-vdom.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step1-vdom.js)
- Step 3-5: [step3-counter.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step3-counter.js)
- Step 6: [step6-effect.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step6-effect.js)
- Step 7: [step7-memo.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step7-memo.js)
- Step 8-9: [step8-patch.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/playground/step8-patch.js)

## Next Step

이제 다음 단계는 이 엔진을 실제 성향테스트 App에 붙이는 것입니다.

추천 순서:

1. `App` 루트 컴포넌트 생성
2. 시작 화면 붙이기
3. 질문 화면 붙이기
4. 선택 시 점수/답변 저장
5. 로딩 화면 연결
6. 결과 화면 연결
7. `useMemo`로 점수 합산 + 결과 매칭
