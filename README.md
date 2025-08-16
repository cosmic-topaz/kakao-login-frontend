# Kakao Login Frontend

카카오 OAuth 로그인을 테스트하기 위한 React + TypeScript 프론트엔드 애플리케이션

## 기술 스택

- **React 19.1.1** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구 및 개발 서버
- **ESLint + Prettier** - 코드 품질 관리

## 주요 기능

- 카카오 OAuth 로그인
- JWT 토큰 기반 인증
- 사용자 정보 조회
- 로그아웃 기능
- 로그인 상태 관리 (localStorage)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 코드 린팅
npm run lint
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 값을 설정하세요:

```env
# 백엔드 API 서버 URL
VITE_API_BASE_URL=http://localhost:3000
```

## 로그인 플로우

1. **로그인 시작**: "카카오로 로그인" 버튼 클릭
2. **카카오 인증**: 백엔드 `/auth/kakao` 엔드포인트로 리다이렉트
3. **카카오 로그인**: 사용자가 카카오 계정으로 로그인
4. **콜백 처리**: 백엔드에서 JWT 토큰 생성 후 프론트엔드로 리다이렉트
5. **토큰 저장**: URL 파라미터에서 토큰 추출하여 localStorage에 저장
6. **로그인 완료**: UI가 로그인 상태로 변경

## API 엔드포인트

- `GET /auth/kakao` - 카카오 로그인 시작
- `GET /auth/profile` - 사용자 정보 조회 (Bearer Token 필요)

## 프로젝트 구조

```
src/
├── App.tsx          # 메인 컴포넌트
├── main.tsx         # 앱 엔트리포인트
├── index.css        # 글로벌 스타일
└── vite-env.d.ts    # Vite 타입 정의
```

## 개발 참고사항

- 토큰은 localStorage에 `accessToken` 키로 저장됩니다
- 로그인 상태는 React state로 관리됩니다
- API 호출 시 Authorization 헤더에 Bearer 토큰을 포함합니다
- 개발 모드에서는 콘솔에 디버깅 정보가 출력됩니다

## 백엔드 연동

이 프론트엔드는 NestJS 백엔드와 연동됩니다. 백엔드가 다음 환경변수를 설정해야 합니다:

```env
FRONTEND_URL=http://localhost:5173
```
