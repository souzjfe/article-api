FROM node:22-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

RUN touch .env

EXPOSE 3000

CMD sh -c "pnpm run migration:run && pnpm run seed && pnpm run start:prod"
