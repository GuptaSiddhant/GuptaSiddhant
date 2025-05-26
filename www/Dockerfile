FROM node:lts-alpine AS dev-deps-env
COPY ./package.json ./yarn.lock ./.yarnrc.yml /app/
COPY ./.yarn/ /app/.yarn/
COPY ./www/package.json /app/www/
WORKDIR /app
RUN yarn workspaces focus gs-www

FROM node:lts-alpine AS prod-deps-env
COPY ./package.json ./yarn.lock ./.yarnrc.yml /app/
COPY ./.yarn/ /app/.yarn/
COPY ./www/package.json /app/www/
WORKDIR /app
RUN yarn workspaces focus gs-www --production

FROM node:lts-alpine AS build-env
COPY ./www/ /app/www/
COPY --from=dev-deps-env /app/ /app/
WORKDIR /app/www
RUN yarn build

FROM node:lts-alpine
COPY --from=prod-deps-env /app/node_modules /app/node_modules
COPY --from=build-env /app/www/package.json /app/package.json
COPY --from=build-env /app/www/build /app/build
RUN mkdir -p /app/data
WORKDIR /app
CMD ["yarn", "start"]
