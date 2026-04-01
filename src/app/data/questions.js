export const quizQuestions = [
  {
    id: 1,
    axis: "CT",
    text: "알고리즘 문제가 안 풀릴 때 나는?",
    choices: [
      { id: "A", text: "옆자리 팀원이랑 같이 고민한다", score: 2 },
      { id: "B", text: "팀원들한테 힌트를 물어본다", score: 1 },
      { id: "C", text: "혼자 30분 더 붙잡아 본다", score: -1 },
      { id: "D", text: "조용한 곳 찾아서 집중 모드에 들어간다", score: -2 },
    ],
  },
  {
    id: 2,
    axis: "CT",
    text: "수요코딩회에서 내가 가장 좋아하는 순간은?",
    choices: [
      { id: "A", text: "팀원들이랑 아이디어 던지면서 방향 잡을 때", score: 2 },
      { id: "B", text: "역할 분담 후 각자 코드 리뷰해줄 때", score: 1 },
      { id: "C", text: "내 파트를 몰입해서 완성했을 때", score: -1 },
      { id: "D", text: "혼자 맡은 기능이 깔끔하게 돌아갈 때", score: -2 },
    ],
  },
  {
    id: 3,
    axis: "TL",
    text: "새로운 개념을 처음 접할 때 나는?",
    choices: [
      { id: "A", text: "책 내용부터 꼼꼼히 읽고 정리한다", score: 2 },
      { id: "B", text: "핵심 개념을 먼저 파악하고 예제를 본다", score: 1 },
      { id: "C", text: "관련 코드를 먼저 돌려보고 이해가 안 되면 책을 본다", score: -1 },
      { id: "D", text: "일단 구현부터 하고 모르는 건 그때그때 찾는다", score: -2 },
    ],
  },
  {
    id: 4,
    axis: "TL",
    text: "새로운 자료구조를 배울 때 나는?",
    choices: [
      { id: "A", text: "시간복잡도 증명 과정이 궁금하다", score: 2 },
      { id: "B", text: "왜 이 구조가 효율적인지 원리를 먼저 이해하고 싶다", score: 1 },
      { id: "C", text: "바로 문제에 적용해보면서 감을 잡는다", score: -1 },
      { id: "D", text: "일단 외우고 문제 많이 풀어서 체화한다", score: -2 },
    ],
  },
  {
    id: 5,
    axis: "PL",
    text: "정글 한 주가 시작될 때 나는?",
    choices: [
      { id: "A", text: "요일별 할 일을 노션에 정리하고 시작한다", score: 2 },
      { id: "B", text: "큰 마감 기준으로 대략적인 순서를 잡는다", score: 1 },
      { id: "C", text: "일단 가장 재밌어 보이는 것부터 한다", score: -1 },
      { id: "D", text: "계획은 어차피 바뀌니까 그날그날 정한다", score: -2 },
    ],
  },
  {
    id: 6,
    axis: "PL",
    text: "이번 주차 마감이 다가올 때 나는?",
    choices: [
      { id: "A", text: "이미 계획대로 진행 중이라 여유 있다", score: 2 },
      { id: "B", text: "남은 할 일을 체크리스트로 정리한다", score: 1 },
      { id: "C", text: "압박감이 오히려 집중력을 높여준다", score: -1 },
      { id: "D", text: "밤새워서라도 마감 직전에 폭발적으로 끝낸다", score: -2 },
    ],
  },
  {
    id: 7,
    axis: "AI",
    text: "코드를 작성할 때 AI를 어떻게 쓰나?",
    choices: [
      { id: "A", text: "전체 구조를 AI에게 먼저 설계하게 하고 내가 검토한다", score: 2 },
      { id: "B", text: "막히는 부분마다 AI에게 물어본다", score: 1 },
      { id: "C", text: "내가 먼저 짜고 AI로 개선점을 찾는다", score: -1 },
      { id: "D", text: "가능하면 직접 짜고 AI는 최소한으로 쓴다", score: -2 },
    ],
  },
  {
    id: 8,
    axis: "AI",
    text: "AI가 생성한 코드를 받았을 때 나는?",
    choices: [
      { id: "A", text: "돌아가면 OK, 빠르게 다음으로 넘어간다", score: 2 },
      { id: "B", text: "핵심 로직만 이해하고 나머진 신뢰한다", score: 1 },
      { id: "C", text: "한 줄씩 읽으면서 왜 이렇게 짰는지 파악한다", score: -1 },
      { id: "D", text: "AI 코드를 참고만 하고 내 스타일로 다시 짠다", score: -2 },
    ],
  },
];
