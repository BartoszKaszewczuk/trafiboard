FROM node:21-alpine

LABEL maintainer="bartosz.kaszewczuk@icloud.com"
LABEL app_name="trafiboard"
LABEL project="trafiboard"

WORKDIR /app
COPY package*.json ./
COPY . .

#RUN mkdir app && npm install && npm run build .
RUN npm install
RUN npm test
RUN npm run build

# TODO: Shall we clean up src files after the build?

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]