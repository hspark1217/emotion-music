# ===========================
# 1단계: Build Stage
# ===========================
FROM node:18-alpine AS builder

WORKDIR /app
RUN npm config set registry https://registry.npmjs.org

# 패키지 복사
COPY package*.json ./

# CRA는 react-scripts가 devDependencies에 있을 수 있으므로 전체 설치 필요
RUN npm install --legacy-peer-deps

# 앱 복사 및 빌드
COPY . .
RUN npx react-scripts build

# ===========================
# 2단계: Serve Stage (Nginx)
# ===========================
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

