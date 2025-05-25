# monospace scope

FROM node:lts-alpine AS development-deps
COPY ./package.json ./yarn.lock ./.yarnrc.yml /app/
COPY ./.yarn/ /app/.yarn/
COPY ./apps/www/package.json /app/apps/www/
WORKDIR /app
RUN yarn workspaces focus gs-www

FROM node:lts-alpine AS production-deps
COPY ./package.json ./yarn.lock ./.yarnrc.yml /app/
COPY ./.yarn/ /app/.yarn/
COPY ./apps/www/package.json /app/apps/www/
WORKDIR /app
RUN yarn workspaces focus gs-www --production

FROM node:lts-alpine AS build-env
COPY ./apps/www/ /app/apps/www
COPY --from=development-deps /app/ /app/
WORKDIR /app/apps/www
RUN yarn build

FROM node:lts-alpine
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build-env /app/apps/www/package.json /app/package.json
COPY --from=build-env /app/apps/www/build /app/build
WORKDIR /app
CMD ["yarn", "start"]
