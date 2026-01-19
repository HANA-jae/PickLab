# PickLab
## 메뉴 프로퍼티 저장소 추상화

메뉴 데이터는 전역 프로퍼티(`MenuProperties`)로 관리되며, 저장소 추상화(`MenuRepository`)를 통해 로컬/원격 저장을 교체할 수 있습니다.

- 인터페이스: `frontend/src/services/menuRepository.ts`의 `MenuRepository` (`load`, `save`)
- 로컬 저장소: `LocalStorageMenuRepository` (기본값)
- 원격 API: `ApiMenuRepository` (`GET/PUT /menu-properties`)

훅 `useMenuProperties`는 저장소를 자동 선택합니다.

- `VITE_USE_REMOTE_MENU` 또는 `VITE_API_URL`이 설정되어 있으면 원격 저장소를 사용합니다.
- 옵션으로 저장소를 직접 주입할 수도 있습니다: `useMenuProperties({ repository })`

### 백엔드 연동 가이드(선택)

원격 저장소 사용 시, 백엔드(NestJS)에 아래 엔드포인트를 추가하세요.

1. `GET /menu-properties`: 현재 `MenuProperties` 반환
2. `PUT /menu-properties`: 본문으로 받은 `MenuProperties` 저장

간단한 메모리/파일 기반 구현으로 시작하고, 추후 DB로 교체하면 프런트엔드는 변경 없이 동작합니다.

### 환경 변수

프런트엔드 `.env`에 다음을 설정합니다.

```
VITE_API_URL=http://localhost:3001
VITE_USE_REMOTE_MENU=true
```

설정이 없으면 로컬스토리지로 동작합니다.

### 마이그레이션 전략

- 스키마 버전 필드를 `MenuProperties`에 추가(필요 시): `version`으로 변경 추적
- 서버 응답과 로컬 기본값을 병합하여 신뢰할 수 있는 초기 상태 보장
- 실패 시 폴백(원격 저장 실패시 로컬 유지)으로 사용자 경험 보호

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
