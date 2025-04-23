FROM node:18-alpine AS deps

WORKDIR /app


COPY package.json package-lock.json ./
RUN npm install


COPY . .


COPY .env .env


RUN npm run build


FROM node:18-alpine AS runner

WORKDIR /app


COPY --from=deps /app ./


ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]