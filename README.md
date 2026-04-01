# week5_webcoding

## Base Structure

- `src/engine`: mini React 엔진
- `src/app`: 성향 테스트 앱
- `src/shared`: 팀 계약 문서
- `tests`: 테스트
- `docs`: 작업 메모

## Run

- 앱 시작점: `index.html`

## Engine

엔진 상세 흐름 문서는 [src/engine/README.md](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/engine/README.md)에 정리되어 있습니다.

구현 범위:

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

## App

실제 앱 시작점은 [src/app/bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)입니다.

핵심 앱 파일:

- [bootstrap.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/bootstrap.js)
- [pages.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/components/pages.js)
- [quiz-logic.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/domain/quiz-logic.js)
- [questions.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/data/questions.js)
- [results.js](/C:/Users/user/Desktop/정글/수요코딩회/5주차/week5_webcoding/src/app/data/results.js)

## Summary

현재 구조는 `App -> engine hooks -> h()로 VDOM 생성 -> render -> diff -> patch` 흐름으로 결과 화면까지 동작합니다.
