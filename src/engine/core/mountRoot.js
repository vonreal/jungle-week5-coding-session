import { FunctionComponent } from "./FunctionComponent.js";

// mountRoot는 루트 App을 시작하는 가장 바깥 함수입니다.
//
// 사용 흐름:
// 1. FunctionComponent 인스턴스 생성
// 2. mount() 호출
// 3. 인스턴스를 반환해서 나중에 필요하면 참조 가능
export function mountRoot(componentFn, container, props = {}) {
  const rootComponent = new FunctionComponent(componentFn, props, container);
  rootComponent.mount();
  return rootComponent;
}
