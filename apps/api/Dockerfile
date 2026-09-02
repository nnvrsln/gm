# Образ API. Контекст сборки — корень репозитория: нужен и apps/api, и
# packages/shared, и общий package-lock.json.
#
# Запуск через tsx, а не через собранный бандл. Причина в устройстве
# монорепозитория: @gm/shared отдаёт исходный TypeScript без шага сборки,
# а Node сам TypeScript из node_modules не разбирает. tsx это делает и
# стоит около ста миллисекунд на старте — при десятках заказов в день
# цена невидимая, а код в разработке и в проде остаётся один и тот же.
FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

# Манифесты отдельным слоем: пока зависимости не менялись, npm ci при
# пересборке берётся из кеша.
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --omit=dev --workspace @gm/api --include-workspace-root

COPY packages/shared packages/shared
COPY apps/api apps/api

USER node
EXPOSE 3000

CMD ["npm", "run", "start", "-w", "@gm/api"]
