# ===========================
# 1단계: Build Stage
# ===========================
FROM node:18-alpine AS builder

# 앱 디렉토리 생성
WORKDIR /app

# 패키지 파일만 먼저 복사 (캐시 활용)
COPY package*.json ./

# 프로덕션 빌드를 위한 의존성 설치
RUN npm ci

# 앱 전체 복사 후 빌드
COPY . .

# 정적 파일 빌드
RUN npm run build


# ===========================
# 2단계: Serve Stage (Nginx)
# ===========================
FROM nginx:stable-alpine

# Nginx 기본 설정 제거 및 교체 가능
# (필요 시 커스텀 nginx.conf를 COPY로 덮어씌움)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물을 Nginx 기본 정적 디렉토리에 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 80포트 개방
EXPOSE 80

# 컨테이너 실행 시 Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

