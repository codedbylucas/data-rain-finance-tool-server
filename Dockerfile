FROM 19.0.0-bullseye-slim as builder

WORKDIR /app

COPY package*.json .

COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:19.0.0-alpine3.16 as runner
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
