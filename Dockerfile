#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80/tcp
ENV ASPNETCORE_URLS="http://+:80"
ARG GIT_VERSION
ENV BackendConfiguration__Version=$GIT_VERSION

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS testbase
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
RUN echo "Node Version: " && node --version
RUN echo "Npm Version: " && npm --version
RUN npx playwright install-deps
RUN npx playwright install
# Set playwright environment
ENV CI=true

FROM testbase AS e2e
WORKDIR /app
COPY . .
RUN npm ci
RUN cd ./Frontend && npm ci && cd ..
RUN npm run test

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend
RUN mkdir /Release -p
WORKDIR /backend
COPY --from=e2e ./app/Backend .
RUN dotnet restore "Backend.csproj"
RUN dotnet publish Backend.csproj -c Release /p:PublishProfile='./Properties/PublishProfiles/PublishProfile.pubxml'

FROM node:18 AS frontend
RUN mkdir /Release -p
WORKDIR /frontend
COPY --from=e2e ./app/Frontend .
RUN npm ci
RUN npm run build

FROM base AS final
WORKDIR /app
COPY --from=frontend /Release .
COPY --from=backend /Release .
ENTRYPOINT ["dotnet", "Backend.dll"]
