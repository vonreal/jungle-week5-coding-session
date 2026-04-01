# Team Contract

## 공통 규칙

- 모든 컴포넌트는 함수형 컴포넌트다.
- Hook은 루트 `App` 컴포넌트에서만 사용한다.
- State는 루트 `App`에서만 관리한다.
- 자식 컴포넌트는 props만 받는 stateless component다.
- Virtual DOM 생성 함수는 `h(type, props, ...children)` 형식을 따른다.
- 이벤트는 `onClick`, `onInput`, `onChange`, `onSubmit` 이름을 사용한다.

## 팀 분업

- 엔진팀: `src/engine`
- 페이지팀: `src/app`
- 공통 계약 문서: `src/shared`

## 초반 연결 체크

- 정적 컴포넌트 렌더링
- 버튼 클릭 기반 상태 갱신
- 입력값 반영
- 조건부 렌더링
- 성향 테스트 질문 화면 1개 연결
