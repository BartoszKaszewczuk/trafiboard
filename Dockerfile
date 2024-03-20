FROM node:21-alpine

LABEL maintainer="bartosz.kaszewczuk@icloud.com"
LABEL app_name="trafi-next"
LABEL project="trafi"

ENTRYPOINT ["top", "-b"]

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
#EXPOSE 3000
ENTRYPOINT npm run start