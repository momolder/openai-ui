FROM node:20-alpine AS base
WORKDIR /app
EXPOSE 80/tcp
ENV PORT=80
ARG GIT_VERSION
ENV PUBLIC_App_Version=$GIT_VERSION

FROM node:20 AS testbase
ENV CI=true
WORKDIR /app
COPY . .
RUN npm install
RUN npx playwright install
RUN npx playwright install-deps

FROM testbase AS e2e
RUN npm run test


FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN cp ./package.json ./build/package.json
RUN cp ./package-lock.json ./build/package-lock.json
WORKDIR /app/build
RUN npm ci --omit dev

FROM base AS final
WORKDIR /app
COPY --from=build /app/build .
COPY --from=build /app/package.json .
ENTRYPOINT ["npm run node"]
