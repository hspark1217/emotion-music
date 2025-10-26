# ===========================
# 1단계: Base Stage
# ===========================
FROM node:18-alpine AS base

# 작업 디렉토리 설정
WORKDIR /app

# npm 미러 설정 (네트워크 안정)
RUN npm config set registry https://registry.npmmirror.com

# package.json만 복사 (빌드 캐시 활용)
COPY package*.json ./

# 프로덕션 의존성 설치
# npm ci → npm install 로 변경 (peer deps 문제 방지)
RUN npm install --legacy-peer-deps

# 앱 소스 복사
COPY . .

# 환경변수 설정
ENV NODE_ENV=production

# 포트 노출
EXPOSE 5000

# 앱 실행 명령
CMD ["node", "index.js"]

