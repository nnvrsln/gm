FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --omit=dev --workspace @gm/api --include-workspace-root

COPY packages/shared packages/shared
COPY apps/api apps/api

USER node
EXPOSE 3000

CMD ["npm", "run", "start", "-w", "@gm/api"]
