FROM node:latest
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
RUM npm build
COPY . ./
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ] 