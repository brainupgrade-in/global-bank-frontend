# Multi-stage: the old Dockerfile assumed you had already run `ng build` and
# copied the result in by hand. This builds inside the image instead, so
# `docker build .` is the whole story.

FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
