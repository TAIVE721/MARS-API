FROM node:21.7.1

RUN mkdir -p /home/app
COPY . /home/app
WORKDIR /home/app

RUN npm install
RUN npm install mysql2

CMD ["node","--watch","StartD.js"]