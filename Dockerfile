#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80/tcp
ENV ASPNETCORE_URLS="http://+:80"

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend
RUN mkdir /Release/Backend -p
WORKDIR /backend
COPY ./Backend .
RUN dotnet restore "Backend.csproj"
RUN dotnet publish Backend.csproj -c Release /p:PublishProfile='./Properties/PublishProfiles/PublishProfile.pubxml'

FROM node:18 AS frontend
RUN mkdir /Release/Backend -p
WORKDIR /frontend
COPY ./Frontend .
RUN npm ci
RUN npm run build

FROM base AS final
WORKDIR /app
COPY --from=frontend /Release/Backend .
COPY --from=backend /Release/Backend .
ENTRYPOINT ["dotnet", "Backend.dll"]
