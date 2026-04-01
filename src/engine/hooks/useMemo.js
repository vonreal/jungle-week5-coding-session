import { getCurrentComponent } from "../core/runtime.js";

// useMemo도 의존성 배열을 비교해서
// "다시 계산할지, 이전 결과를 재사용할지" 결정합니다.
function hasDependenciesChanged(previousDeps, nextDeps) {
  if (!previousDeps) {
    return true;
  }

  if (!nextDeps) {
    return true;
  }

  if (previousDeps.length !== nextDeps.length) {
    return true;
  }

  for (let index = 0; index < nextDeps.length; index += 1) {
    if (!Object.is(previousDeps[index], nextDeps[index])) {
      return true;
    }
  }

  return false;
}

// useMemo는 "계산 결과"를 기억해두는 hook입니다.
//
// 왜 필요할까요?
// 어떤 값은 state 자체가 아니라, state를 바탕으로 계산해서 얻습니다.
// 예:
// - 완료된 할 일 개수
// - 필터링된 리스트
// - 성향테스트 축별 점수 합산
// - 최종 결과 타입 매칭
//
// 이런 계산을 렌더 때마다 매번 다시 하지 않고,
// 의존성이 바뀔 때만 다시 계산하고 싶을 때 useMemo를 씁니다.
export function useMemo(factory, dependencies) {
  const component = getCurrentComponent();

  if (!component) {
    throw new Error("useMemo는 FunctionComponent 렌더 중에만 사용할 수 있습니다.");
  }

  const currentIndex = component.hookIndex;
  const previousHook = component.hooks[currentIndex];
  const previousDeps = previousHook?.dependencies;
  const shouldRecompute = hasDependenciesChanged(previousDeps, dependencies);

  if (shouldRecompute) {
    component.hooks[currentIndex] = {
      type: "memo",
      dependencies,
      // factory를 실행한 결과를 저장해둡니다.
      value: factory(),
    };
  }

  const memoizedValue = component.hooks[currentIndex].value;

  // 다음 hook이 다음 칸을 쓰도록 index를 이동합니다.
  component.hookIndex += 1;

  return memoizedValue;
}
