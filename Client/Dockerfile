# Dockerfile
FROM nginx:alpine

# nginx 기본 설정 파일 삭제
RUN rm /etc/nginx/conf.d/default.conf

# 사용자 정의 nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/

# 빌드된 파일들을 nginx의 웹 루트 디렉토리로 복사
COPY dist /usr/share/nginx/html

# 80포트 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]