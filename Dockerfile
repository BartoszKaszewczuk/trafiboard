FROM node:21-alpine

LABEL maintainer="bartosz.kaszewczuk@icloud.com"
LABEL app_name="trafi-next"
LABEL project="trafi"

ENTRYPOINT ["top", "-b"]

WORKDIR /app
COPY package*.json ./
#COPY src/app/ .
COPY . .

#CMD mkdir app && npm install && npm run build .
CMD npm install

#ENTRYPOINT npm run start
ENTRYPOINT npm run dev