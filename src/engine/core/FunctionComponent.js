import { render } from "../render/render.js";
import {
  clearCurrentComponent,
  setCurrentComponent,
} from "./runtime.js";

// FunctionComponent는 "루트 함수형 컴포넌트 1개"를 감싸는 클래스입니다.
//
// 이 클래스가 하는 핵심 일:
// 1. hooks 배열 보관
// 2. hookIndex 관리
// 3. 처음 mount()
// 4. state 변경 후 update()
//
// 즉, 함수형 컴포넌트가 다시 실행되어도
// state를 잃어버리지 않게 붙잡아두는 관리자 역할입니다.
export class FunctionComponent {
  constructor(componentFn, props = {}, container) {
    this.componentFn = componentFn;
    this.props = props;
    this.container = container;

    // hook 값들이 저장되는 배열입니다.
    // useState가 호출될 때마다 이 배열의 한 칸씩 사용합니다.
    this.hooks = [];

    // 이번 렌더에서 "몇 번째 hook까지 왔는지" 기억합니다.
    this.hookIndex = 0;

    // 현재 렌더 결과로 나온 VDOM을 저장합니다.
    this.currentTree = null;

    // 이번 렌더가 끝난 뒤 실행할 effect들을 잠깐 모아두는 배열입니다.
    this.pendingEffects = [];
  }

  // 매 렌더 시작 전에 hookIndex를 0으로 되돌립니다.
  // 그래야 useState 호출 순서대로 같은 칸을 다시 찾아갈 수 있습니다.
  prepareToRender() {
    this.hookIndex = 0;
    this.pendingEffects = [];
    setCurrentComponent(this);
  }

  // 렌더가 끝난 뒤에는 현재 컴포넌트 등록을 지웁니다.
  finishRender() {
    clearCurrentComponent();
  }

  // useEffect가 등록한 작업을 렌더가 끝난 뒤 실행합니다.
  //
  // 왜 렌더 뒤에 실행할까요?
  // effect는 "화면을 그리는 일"이 아니라
  // "그린 다음 해야 하는 일"이기 때문입니다.
  // 예:
  // - 콘솔 로그
  // - 타이머 등록
  // - localStorage 저장
  // - 서버 요청
  runEffects() {
    for (const runEffect of this.pendingEffects) {
      runEffect();
    }
  }

  // 실제로 함수형 컴포넌트를 실행해서 VDOM을 얻는 과정입니다.
  performRender() {
    this.prepareToRender();

    try {
      this.currentTree = this.componentFn(this.props);
      return this.currentTree;
    } finally {
      this.finishRender();
    }
  }

  // mount는 "첫 렌더"입니다.
  // 컴포넌트를 실행해서 나온 VDOM을 실제 DOM으로 바꿔 화면에 붙입니다.
  mount() {
    const tree = this.performRender();
    render(tree, this.container);
    this.currentTree = tree;
    this.runEffects();
  }

  // update는 "다시 렌더"입니다.
  // setState가 호출되면 이 함수가 실행됩니다.
  update() {
    const previousTree = this.currentTree;
    const tree = this.performRender();
    render(tree, this.container, previousTree);
    this.currentTree = tree;
    this.runEffects();
  }
}
