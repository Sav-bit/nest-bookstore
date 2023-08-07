FROM node:18.17-alpine3.17

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY prisma .

COPY src .

COPY .env .

COPY tsconfig*.json .

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

CMD [ "node", "dist/main.js" ]