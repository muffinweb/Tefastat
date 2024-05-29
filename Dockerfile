FROM node:darwin

WORKDIR /app

COPY package.json .

RUN npm install

RUN npx prisma generate

COPY . .

CMD ["node", "app.js"]
