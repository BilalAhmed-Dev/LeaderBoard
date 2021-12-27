FROM node:10.24.0

WORKDIR /app

COPY ./app/package.json ./

RUN npm install

COPY ./app/ .

CMD ["npm", "start"]
