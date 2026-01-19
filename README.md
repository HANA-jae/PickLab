# PickLab

PickLab은 NestJS 백엔드와 React(Vite) 프론트엔드로 구성된 풀스택 웹 서비스입니다.

## 프로젝트 구조

```
PickLab/
├── backend/          # NestJS 백엔드 프로젝트
├── frontend/         # React(Vite) 프론트엔드 프로젝트
├── package.json      # 루트 워크스페이스 설정
└── README.md         # 이 파일
```

## 요구사항

- Node.js 16+ 
- npm 8+ 또는 yarn 3+

## 설치

### 1. 저장소 클론
```bash
git clone https://github.com/HANA-jae/PickLab.git
cd PickLab
```

### 2. 의존성 설치
```bash
npm install
```

## 개발 실행

### 백엔드만 실행
```bash
npm run start:backend
```
백엔드는 `http://localhost:3001`에서 실행됩니다.

### 프론트엔드만 실행
```bash
npm run start:frontend
```
프론트엔드는 `http://localhost:5173`에서 실행됩니다.

### 전체 개발 모드 (동시 실행)
```bash
npm run dev
```

## 빌드

```bash
npm run build
```

## 환경 변수

각 프로젝트의 `.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

### Backend (.env)
```
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## 디렉토리 구조

### Backend (NestJS)
- `src/` - 소스 코드
  - `main.ts` - 애플리케이션 진입점
  - `app.module.ts` - 루트 모듈
  - `app.controller.ts` - 라우트 컨트롤러
  - `app.service.ts` - 비즈니스 로직

### Frontend (React + Vite)
- `src/` - 소스 코드
  - `main.tsx` - React 진입점
  - `App.tsx` - 루트 컴포넌트
  - `App.css` - 스타일
  - `index.css` - 전역 스타일

## 라이선스

MIT
