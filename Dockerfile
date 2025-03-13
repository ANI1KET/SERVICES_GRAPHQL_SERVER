# FROM node:20
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npx prisma generate
# RUN npm run build
# CMD [ "npm","run","start" ]

FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl openssl-dev

COPY package*.json ./
RUN npm ci --omit=dev
RUN npm install typescript --no-save
COPY prisma/ ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build
RUN rm -rf src/ tsconfig.json prisma/ node_modules/.cache

FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache openssl openssl-dev

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./

CMD ["node", "build/server.js"]
