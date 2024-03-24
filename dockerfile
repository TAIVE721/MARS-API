FROM node:21.7.1

RUN mkdir -p /home/app
COPY . /home/app
WORKDIR /home/app

RUN npm install

CMD ["node","--watch","index.js"]