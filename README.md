# Mini React 발표 흐름

## 발표 시작

안녕하세요.  
저희는 이번 과제에서 React를 직접 사용하는 대신, React의 핵심 개념인 **Component, State, Hook, Virtual DOM**의 동작 원리를 직접 구현하고, 그 위에서 실제로 동작하는 웹 페이지를 만드는 것을 목표로 했습니다.

즉, 단순히 성향 테스트 페이지를 만든 것이 아니라,  
"React가 왜 이렇게 동작하는가?"를 직접 구현으로 이해하는 프로젝트를 진행했습니다.

---

## 1. 왜 이 프로젝트를 만들었는가

이번 과제의 핵심은 웹페이지를 예쁘게 만드는 것보다,  
React가 내부적으로 어떻게 동작하는지 직접 구현해보는 데 있다고 생각했습니다.

그래서 저희는 사용자가 클릭하고 입력하면서 화면이 바뀌는 **성향 테스트 형식의 웹페이지**를 주제로 선택했습니다.

이 주제를 고른 이유는 다음과 같습니다.

- 시작 화면, 닉네임 입력, 문제 풀이, 로딩, 결과 화면처럼 **화면 전환이 분명하게 드러난다**
- 닉네임, 현재 문제 번호, 답변 목록처럼 **상태 변화가 명확하다**
- 결과 계산과 화면 갱신을 통해 **Hook과 렌더링 구조를 실제로 확인하기 좋다**

즉, 이 주제는 단순한 정적 페이지보다  
**Component, State, Hook, Virtual DOM의 필요성을 설명하기에 더 적합한 구조**라고 판단했습니다.

---

## 2. 프로젝트 목표

이번 프로젝트에서 저희가 직접 확인하고 싶었던 질문은 크게 세 가지였습니다.

1. 함수형 컴포넌트는 매번 실행되는데 상태를 어떻게 유지할까?
2. 상태가 바뀌면 누가 다시 렌더링을 시작할까?
3. 상태를 어디에 두어야 UI가 커져도 구조가 꼬이지 않을까?

이 질문에 답하기 위해 저희는 mini React 구조를 직접 구현했습니다.

---

## 3. 이번 프로젝트의 큰 구조

프로젝트는 크게 두 부분으로 나뉩니다.

- `src/app`
  - 사용자에게 실제로 보이는 성향 테스트 앱
- `src/engine`
  - 그 앱을 동작하게 만드는 mini React 엔진

즉,

- `app`은 "지금 어떤 화면을 보여줄지"를 결정하고
- `engine`은 "그 화면을 실제 브라우저에 어떻게 그릴지"를 담당합니다

---

## 4. 요구사항을 어떻게 만족했는가

### 4-1. Component

모든 화면은 **함수형 컴포넌트**로 구성했습니다.

예를 들어:

- `App`
- `StartPage`
- `NicknamePage`
- `QuestionPage`
- `LoadingPage`
- `ResultPage`

이런 컴포넌트들이 모두 함수 형태로 작성되어 있습니다.

그리고 이 함수형 컴포넌트를 직접 만든 [`FunctionComponent`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/engine/core/FunctionComponent.js) 클래스가 감싸는 구조로 구현했습니다.

이 클래스는 다음 역할을 담당합니다.

- `hooks` 배열 보관
- `hookIndex` 관리
- `mount()`로 첫 렌더링 수행
- `update()`로 상태 변경 후 재렌더링 수행

즉, **함수형 컴포넌트를 실행하고 관리하는 엔진 역할**을 직접 만든 것입니다.

관련 파일:

- [`src/app/bootstrap.js`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/app/bootstrap.js)
- [`src/app/components/pages.js`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/app/components/pages.js)
- [`src/engine/core/FunctionComponent.js`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/engine/core/FunctionComponent.js)

### 4-2. State

과제 조건에 맞게 state는 **루트 컴포넌트 `App`에서만 관리**했습니다.

예를 들어 `App`에서는 이런 데이터를 state로 관리합니다.

- 현재 화면 상태 `screen`
- 사용자가 입력한 `nickname`
- 현재 문제 번호 `currentIndex`
- 사용자의 답변 목록 `answers`

이 값들은 모두 [`src/app/bootstrap.js`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/app/bootstrap.js) 의 `useState` 안에서 관리됩니다.

자식 컴포넌트들은 state를 직접 가지지 않고,  
부모가 넘겨주는 `props`만 받아 화면을 그리도록 만들었습니다.

즉 저희는:

- 루트가 상태를 가지고
- 자식은 props만 받는
- **Lifting State Up 구조**

를 따랐습니다.

이 구조를 선택한 이유는:

- 상태 출처를 한 곳으로 모을 수 있고
- 화면이 많아져도 데이터 흐름이 단순하고
- 디버깅이 쉬워지기 때문입니다

### 4-3. Hook

저희는 Hook도 직접 구현했습니다.

구현한 Hook은 세 가지입니다.

#### `useState`

- 역할: 상태를 저장하고 유지
- 원리: `hooks` 배열과 `hookIndex`를 이용해 같은 순서의 Hook이 같은 칸을 다시 참조
- 효과: 함수가 다시 실행되어도 이전 상태를 유지할 수 있음

#### `useEffect`

- 역할: 렌더링이 끝난 뒤 실행할 작업 등록
- 프로젝트 예시: 로딩 화면에서 2초 뒤 결과 화면으로 넘기는 타이머

#### `useMemo`

- 역할: 계산 결과를 기억해두고 필요할 때만 다시 계산
- 프로젝트 예시: 답변 배열을 바탕으로 최종 결과와 궁합 결과를 계산

즉, 함수형 컴포넌트가 매번 새로 실행되더라도  
상태와 계산 결과, 렌더 후 동작을 유지할 수 있도록 Hook 구조를 직접 만든 것입니다.

관련 파일:

- [`src/engine/hooks/useState.js`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/engine/hooks/useState.js)
- [`src/engine/hooks/useEffect.js`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/engine/hooks/useEffect.js)
- [`src/engine/hooks/useMemo.js`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/engine/hooks/useMemo.js)

---

## 5. 첫 화면이 뜨는 흐름

이제 실제로 앱이 처음 실행될 때 어떤 일이 일어나는지 설명드리겠습니다.

1. 브라우저가 `index.html`을 읽고, `<div id="app"></div>` 라는 빈 공간을 준비합니다.
2. [`src/main.js`](/Users/j/Desktop/Jungle/week5/week5_webcoding/src/main.js) 가 실행되면서 `mountApp()`이 호출됩니다.
3. `mountApp()`은 `#app`을 찾고 `mountRoot(App, root)`를 실행합니다.
4. 그러면 `FunctionComponent` 인스턴스가 만들어지고 `mount()`가 실행됩니다.
5. `mount()` 안에서 `performRender()`가 `App()`을 실행합니다.
6. 이때 초기 state의 `screen` 값은 `"start"`이기 때문에 `StartPage()`가 반환됩니다.
7. 각 컴포넌트는 `h(type, props, ...children)` 형식으로 Virtual DOM을 만듭니다.
8. 마지막으로 `render()`가 이 Virtual DOM을 실제 DOM으로 바꿔서 브라우저에 붙입니다.

즉, 처음 화면은 바로 DOM을 직접 만드는 것이 아니라,

- 상태를 읽고
- 화면을 결정하고
- Virtual DOM 설계도를 만든 뒤
- 실제 DOM으로 변환해 붙이는 방식으로 나타납니다

---

## 6. 상태가 바뀌면 화면은 어떻게 갱신되는가

이제 시연에서 보여드릴 핵심 흐름입니다.

사용자가 버튼을 클릭하거나 답변을 선택하면 `setState`가 실행됩니다.

그러면 다음 과정이 일어납니다.

1. `useState`가 저장하고 있던 상태가 바뀝니다.
2. `FunctionComponent`의 `update()`가 호출됩니다.
3. 루트 컴포넌트 `App()`이 다시 실행됩니다.
4. 새로운 Virtual DOM이 생성됩니다.
5. 이전 Virtual DOM과 새 Virtual DOM을 `diff`로 비교합니다.
6. 바뀐 부분만 `patch`를 통해 실제 DOM에 반영합니다.

즉, 저희는 실제 DOM을 직접 다시 그리는 방식이 아니라,

**App -> Hook -> Virtual DOM 생성 -> render -> diff -> patch -> 실제 DOM 반영**

이라는 흐름으로 화면을 갱신합니다.

이 구조의 장점은:

- 전체 화면을 매번 다시 만들지 않아도 되고
- 상태가 바뀌었을 때 어떤 화면이 나와야 하는지 예측이 쉽고
- React가 왜 빠르게 동작하는지 이해하기 좋다는 점입니다

---

## 7. 실제 React와 비슷한 점, 다른 점

이 프로젝트는 학습용 mini React이기 때문에, 실제 React와 공통점도 있고 차이점도 있습니다.

공통점은:

- 함수형 컴포넌트를 사용한다
- state가 바뀌면 다시 렌더링된다
- Hook 호출 순서로 상태를 관리한다
- Virtual DOM을 만들고 비교한 뒤 필요한 부분만 업데이트한다

차이점은:

- 실제 React는 Fiber 구조, 스케줄링, batching 같은 더 복잡한 최적화가 있다
- 우리는 루트 `App` 중심의 단순한 구조로 구현했다
- 우리는 `useState`, `useEffect`, `useMemo` 중심의 최소 기능만 구현했다

즉, 저희 프로젝트는 실제 React를 그대로 복제한 것은 아니지만,
**React의 핵심 아이디어를 학습하고 설명하기에 적합한 구조**를 직접 구현한 것입니다.

---

## 8. 시연에서 보여줄 포인트

시연에서는 다음 내용을 중심으로 보여드릴 예정입니다.

1. 시작 화면에서 닉네임 입력 화면으로 전환
2. 질문 선택에 따라 현재 문제 번호와 답변 목록이 state로 저장되는 과정
3. 문제 이동 시 전체 화면이 아니라 필요한 부분만 바뀌는 모습
4. 로딩 화면에서 `useEffect` 타이머가 실행되어 결과 화면으로 넘어가는 과정
5. 결과 계산이 `useMemo`를 통해 정리되는 구조

즉, 시연에서는 단순히 "페이지가 넘어간다"를 보여주는 것이 아니라,
그 뒤에서 **state, hook, render, diff, patch가 어떻게 연결되는지**를 함께 설명할 수 있습니다.

---

## 9. 정리

정리하자면, 이 프로젝트는 단순히 성향 테스트 페이지를 만든 것이 아니라,
React의 핵심 원리인 **Component, State, Hook, Virtual DOM**을 직접 구현하고,
그것이 실제 화면에서 어떻게 동작하는지 확인하기 위한 프로젝트였습니다.

이번 과제를 통해 저희는:

- Component를 어떻게 나눌지
- State를 어디에 둘지
- Hook이 왜 필요한지
- Virtual DOM, Diff, Patch가 왜 중요한지

를 직접 구현하며 학습할 수 있었습니다.

감사합니다.
