FROM node:21-alpine

WORKDIR /app

ADD . .

RUN npm install

CMD ["npm", "run", "dev"]

EXPOSE 3000