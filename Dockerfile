FROM node:19.0.0-alpine3.16 as builder

WORKDIR /app
COPY package*.json .
COPY prisma ./prisma/
RUN npm install
RUN npm run build

ENV NODE_ENV=production

FROM gcr.io/distroless/nodejs18-debian11


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
