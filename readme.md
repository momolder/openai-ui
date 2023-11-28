# OpenAI-UI

The OpenAI-UI is designed to be as easy to use and understand as possible. It consists of a Backend and Frontend.
Both can be ran independently.

## Setup

### Debug

```bash
npm ci && (cd ./Frontend && npm ci) && cd..
npm run dev
```

> To change the backend url, the Frontend/vite.config.ts and Backend/Properties/launchSettings.json need to be adjusted.

### Build

```bash
npm run build
```

To test the build locally, run:

```bash
dotnet run ./Release/backend/backend.dll
```

and open the browser on http://localhost:5000

### Docker (TODO)

Frontend and Backend are build independently in docker to keep them seperated here too.

```bash
docker build --pull --rm -f "Dockerfile" -t openaiui:latest "."
docker run --rm -d -p 80:80/tcp openaiui:latest
```

### Azure

Install azure cli and login e.g.:

```bash
az login
az account set --subscription xxxxxxx-xxxxx-xxxx-xxxxx-xxxxxxxy
```

Prepare the azure resources:

```bash
az group create --name rg-openai-ui --location eastus
az appservice plan create --resource-group rg-openai-ui --location eastus --name asp-openai-ui --is-linux --sku FREE
az webapp create --name openai-ui --plan asp-openai-ui --resource-group rg-openai-ui -r DOTNETCORE:7.0 --startup-file backend.dll
az webapp config appsettings set --resource-group rg-openai-ui --name openai-ui --settings WEBSITE_RUN_FROM_PACKAGE="1"
```

Change the publishing model:

```bash
az webapp config show --resource-group rg-openai-ui --name openai-ui
az webapp config set --name openai-ui --resource-group rg-openai-ui --linux-fx-version "DOTNETCORE|7.0"
az webapp config set --name openai-ui --resource-group rg-openai-ui --linux-fx-version "DOCKER"
az webapp config container set --docker-custom-image-name mcr.microsoft.com/appsvc/staticsite:latest  --docker-registry-server-url https://ghcr.io --name openai-ui --resource-group rg-openai-ui
```

Zip the release folder contents:

```bash
Compress-Archive -Path .\Release\Backend\* -DestinationPath release.zip -force
```

Deploy the app to azure:

```bash
npm run deploy
```

Clean up:

```bash
az group delete --no-wait --name rg-openai-ui
```

## TODOs

- Update readme
- e2e tests against azure
- cancel request / resonse
- regenerate last response
- modify last request
- ENV config for language
- user Entra ID icon & bot icon (bot.svg == logo.svg)
- document upload
- hyperlinks to documents
- TTS
