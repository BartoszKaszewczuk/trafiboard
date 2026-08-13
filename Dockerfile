FROM node:24-alpine

LABEL maintainer="bartosz.kaszewczuk@icloud.com"
LABEL app_name="trafiboard"
LABEL project="trafiboard"

WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY . .
RUN npm run build

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]