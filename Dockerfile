FROM node:19

WORKDIR /app

COPY package.json .

RUN npm install

RUN npx prisma generate

COPY . .

CMD ["node", "app.js"]
