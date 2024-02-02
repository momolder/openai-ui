# OpenAI-UI

The OpenAI UI is designed to be a simple [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line%2Cpython&pivots=programming-language-studio) frontend. The application is written in [Svelte](https://svelte.dev/). The App focuses on:

- Easy to setup and integrate
- Easy to customise
- 100% Azure compatible

## Setup

There are many ways to use the app. A basic way to get started, is to set up an Azure AppService and pull the current latest image in the ghcr.io repository of the app.

### Environment variables

To get the app up and running, several environment variables are required. To easily get them into azure, use the advanced edit and add the following json elements to the settings.

```bash
AiSearch_Endpoint"your ai search endpoint"
AiSearch_IndexName"gyour ai search index name"
AiSearch_Key"your ai search key"
AiSearch_QueryType"'simple', 'semantic', 'vector', 'vectorSimpleHybrid' or 'vectorSemanticHybrid"
App_ClaimName""
App_ClaimValue""
Database_AccountEndpoint"your database endpoint"
Database_AccountKey"your database account key"
Database_DatabaseName"History"
OpenAi_Deployment"your OpenAI deployment"
OpenAi_Embedding"your OpenAI embedding deployment name"
OpenAi_Endpoint"your OpenAI endpoint"
OpenAi_Key"your OpenAI key"
OpenAi_MaxTokens"800"
OpenAi_Temperature"0.7"
OpenAi_FrequencyPenalty"0.0"
OpenAi_PresencePenalty"0.0"
OpenAi_NucleusSamplingFactor"0.95"
OpenAi_StopSequences"<|im_end|>"
OpenAi_SystemMessage"You are an AI assistant that helps people find information."
OpenAi_PastMessagesIncluded"10"
OpenAi_ApiVersion"2023-10-01-preview"
PORT"80"
PUBLIC_App_Autosave"true"
PUBLIC_App_UseHistory"true"
PUBLIC_App_UseMock"false"
```

### Debug

To debug the application setup a .env file for the Environment variables described above, then:

```bash
npm install
cp .env.example .env.test
npm run dev -- --mode test
```

### Build

```bash
npm run build
```

To test the build locally, run:

```bash
node build
```

and open the browser on http://localhost:3000

### Docker

To host the app in a docker container either pull the image from the ghcr.io repository or:

```bash
docker build --pull --rm -f "Dockerfile" -t openaiui:latest "."
docker run --rm -d -p 80:80/tcp openaiui:latest
```

### Azure

To develop and manually deploy the app to Azure, install the [Azure cli](https://learn.microsoft.com/en-us/cli/azure/) and login e.g.:

```bash
az login
az account set --subscription xxxxxxx-xxxxx-xxxx-xxxxx-xxxxxxxy
```

Prepare the azure resources:

```bash
az group create --name rg-openai-ui --location eastus
az appservice plan create --resource-group rg-openai-ui --location eastus --name asp-openai-ui --is-linux --sku FREE
az webapp create --name openai-ui --plan asp-openai-ui --resource-group rg-openai-ui -r NODE:LTS
az webapp config appsettings set --resource-group rg-openai-ui --name openai-ui --settings WEBSITE_RUN_FROM_PACKAGE="1"
```

Change the publishing model:

```bash
az webapp config show --resource-group rg-openai-ui --name openai-ui
az webapp config set --name openai-ui --resource-group rg-openai-ui --linux-fx-version "NODE:LTS"
az webapp config set --name openai-ui --resource-group rg-openai-ui --linux-fx-version "DOCKER"
az webapp config container set --docker-custom-image-name ghcr.io/momolder/openai-ui:latest  --docker-registry-server-url https://ghcr.io --name openai-ui --resource-group rg-openai-ui
```

Publish the local build:

```bash
npm run deploy:zip
```

Clean up:

```bash
az group delete --no-wait --name rg-openai-ui
```
