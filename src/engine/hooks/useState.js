import { getCurrentComponent } from "../core/runtime.js";

// useState는 함수형 컴포넌트 안에서 "기억해야 하는 값"을 만드는 hook입니다.
//
// 핵심 아이디어:
// - hooks 배열에 값을 저장한다
// - hook이 호출된 순서를 기준으로 같은 칸을 다시 찾는다
// - setState가 실행되면 update()를 불러 다시 렌더링한다
export function useState(initialValue) {
  const component = getCurrentComponent();

  // 지금 렌더 중인 컴포넌트가 없으면 hook을 잘못 쓴 것입니다.
  if (!component) {
    throw new Error("useState는 FunctionComponent 렌더 중에만 사용할 수 있습니다.");
  }

  // 이번에 사용할 hooks 배열의 칸 번호입니다.
  const currentIndex = component.hookIndex;

  // 첫 렌더라면 이 칸이 비어 있으므로 초기값을 넣어둡니다.
  if (component.hooks[currentIndex] === undefined) {
    component.hooks[currentIndex] =
      typeof initialValue === "function" ? initialValue() : initialValue;
  }

  // 현재 칸의 state 값을 읽어옵니다.
  const state = component.hooks[currentIndex];

  // setState는 같은 칸의 값을 바꾼 뒤 update()를 호출합니다.
  const setState = (nextValue) => {
    const previousValue = component.hooks[currentIndex];

    component.hooks[currentIndex] =
      typeof nextValue === "function" ? nextValue(previousValue) : nextValue;

    component.update();
  };

  // 다음 hook이 다음 칸을 쓰도록 index를 1 증가시킵니다.
  component.hookIndex += 1;

  return [state, setState];
}
