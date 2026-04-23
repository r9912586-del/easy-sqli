FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

ENV FLAG=OBIS{sql_injection_success}

EXPOSE 3000

CMD ["node", "app.js"]