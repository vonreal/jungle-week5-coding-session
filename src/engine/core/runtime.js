// 현재 "실행 중인 루트 컴포넌트"를 기억하는 전역 변수입니다.
//
// 왜 필요할까요?
// useState 같은 hook은 "지금 어느 컴포넌트 안에서 호출됐는지" 알아야
// 올바른 hooks 배열 칸에 값을 저장할 수 있습니다.
let currentComponent = null;

// 렌더링을 시작하기 전에 "지금 실행 중인 컴포넌트"를 등록합니다.
export function setCurrentComponent(componentInstance) {
  currentComponent = componentInstance;
}

// hook이 실행될 때 현재 컴포넌트를 가져옵니다.
export function getCurrentComponent() {
  return currentComponent;
}

// 렌더링이 끝나면 현재 컴포넌트 정보를 비웁니다.
export function clearCurrentComponent() {
  currentComponent = null;
}
