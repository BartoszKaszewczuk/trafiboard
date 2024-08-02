FROM node:21-alpine

LABEL maintainer="bartosz.kaszewczuk@icloud.com"
LABEL app_name="trafi-next"
LABEL project="trafi"

WORKDIR /app
COPY package*.json ./
#COPY src/app/ app/
COPY . .

#RUN mkdir app && npm install && npm run build .
RUN npm install

#ENTRYPOINT npm run start
ENTRYPOINT npm run dev