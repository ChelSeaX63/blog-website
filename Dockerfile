#Sample Dockerfile for NodeJS Apps

FROM node:18.14.2

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

ENV PORT 3000

EXPOSE 3000

CMD [ "node", "app.js" ]