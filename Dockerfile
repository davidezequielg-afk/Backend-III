FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

RUN mkdir -p /app/uploads /app/logs && chown -R node:node /app

USER node

ENV NODE_ENV=production \
    PORT=3000 \
    UPLOADS_DIR=uploads

EXPOSE 3000

CMD ["npm", "start"]