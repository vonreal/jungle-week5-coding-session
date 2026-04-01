import { getCurrentComponent } from "../core/runtime.js";

// 의존성 배열이 바뀌었는지 비교하는 함수입니다.
// 길이가 다르거나, 같은 위치의 값이 하나라도 다르면 "변경됨"으로 봅니다.
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

// useEffect는 "렌더가 끝난 뒤 실행할 작업"을 등록하는 hook입니다.
//
// useState와 비슷하게 hooks 배열의 한 칸을 사용하지만,
// state 값을 저장하는 대신 "의존성 정보"와 "cleanup 함수"를 저장합니다.
export function useEffect(effect, dependencies) {
  const component = getCurrentComponent();

  if (!component) {
    throw new Error("useEffect는 FunctionComponent 렌더 중에만 사용할 수 있습니다.");
  }

  const currentIndex = component.hookIndex;
  const previousHook = component.hooks[currentIndex];
  const previousDeps = previousHook?.dependencies;

  // 의존성 배열이 바뀌었을 때만 effect를 다시 실행합니다.
  const shouldRunEffect = hasDependenciesChanged(previousDeps, dependencies);

  // hooks 배열에는 현재 effect의 메타데이터를 저장합니다.
  component.hooks[currentIndex] = {
    type: "effect",
    dependencies,
    cleanup: previousHook?.cleanup ?? null,
  };

  if (shouldRunEffect) {
    // 지금 당장 effect를 실행하지 않고,
    // 렌더가 끝난 뒤 FunctionComponent.runEffects()가 실행하도록 예약합니다.
    component.pendingEffects.push(() => {
      const hookState = component.hooks[currentIndex];

      // 이전 cleanup이 있으면 먼저 실행합니다.
      if (typeof hookState.cleanup === "function") {
        hookState.cleanup();
      }

      const cleanup = effect();

      // effect가 함수를 반환하면 다음 effect 전에 정리 작업으로 사용합니다.
      component.hooks[currentIndex] = {
        ...hookState,
        cleanup: typeof cleanup === "function" ? cleanup : null,
      };
    });
  }

  component.hookIndex += 1;
}
