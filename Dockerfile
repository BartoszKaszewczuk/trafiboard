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
RUN npm run build
# TODO: Shall we clean up src files after the build?

EXPOSE 8080

#ENTRYPOINT npm run start
#ENTRYPOINT ["npm", "run", "dev"]
ENTRYPOINT ["npm", "run", "start"]