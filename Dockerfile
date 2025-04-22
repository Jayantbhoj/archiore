
FROM node:18-alpine AS deps
WORKDIR /app


RUN npm install -g prisma


COPY package.json package-lock.json* ./
RUN npm install


COPY . .


RUN npx prisma generate


RUN npm run build


FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000


COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
